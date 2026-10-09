<?php
if (!defined('ABSPATH')) exit;

/**
 * Resolve the base HTML of a template using saved _aes_values and aes_shared_values
 */
function aes_get_resolved_template_html($key, $post_id = 0) {
    if (!isset(aes_data('manifest')[$key])) return '';
    $file = AES_DIR . '/templates/' . $key . '.html';
    if (!file_exists($file)) return '';
    $html = file_get_contents($file);
    $page = $post_id ? get_post_meta($post_id, '_aes_values', true) : [];
    $page = is_array($page) ? $page : [];
    $shared = get_option('aes_shared_values', []);
    $shared = is_array($shared) ? $shared : [];
    $defs = array_merge(aes_fields($key), aes_data('shared'));
    $values = array_merge($page, $shared);

    $html = preg_replace_callback('/@@JSFIELD:([a-zA-Z0-9_-]+)@@/', function ($m) use ($defs, $values) {
        $v = $values[$m[1]] ?? ($defs[$m[1]]['default'] ?? '');
        return wp_json_encode(aes_resolve($v), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    }, $html);

    $html = preg_replace_callback('/@@FIELD:([a-zA-Z0-9_-]+)@@/', function ($m) use ($defs, $values) {
        if (!isset($defs[$m[1]])) return '';
        $d = $defs[$m[1]];
        $v = array_key_exists($m[1], $values) ? $values[$m[1]] : $d['default'];
        $v = aes_resolve($v);
        return in_array($d['type'], ['url', 'image'], true) ? esc_url($v) : esc_html($v);
    }, $html);

    $nav_html = aes_get_dynamic_nav();
    if ($nav_html) {
        $html = preg_replace('/<div class="mega-dropdown-menu[^>]*>.*?<\/div>/s', $nav_html, $html);
    }

    return aes_resolve($html);
}

/**
 * Extract a human-readable title from an HTML section snippet
 */
function aes_detect_section_title($html, $index) {
    if (preg_match('/<h[1-3][^>]*>(.*?)<\/h[1-3]>/is', $html, $m)) {
        $t = trim(preg_replace('/\s+/', ' ', wp_strip_all_tags($m[1])));
        if ($t !== '') return mb_substr($t, 0, 60);
    }
    if (preg_match('/id=["\']([a-zA-Z0-9_-]+)["\']/i', $html, $m)) {
        return ucwords(str_replace(['-', '_'], ' ', $m[1]));
    }
    if ($index === 1) return 'Hero Banner';
    return 'Page Section ' . $index;
}

/**
 * Split a resolved template HTML into visual Gutenberg blocks (Header, Sections, Footer)
 * while keeping floating aside, hidden modals, and scripts separate.
 */
function aes_split_template_parts($html) {
    // Strip HTML comments so they never interfere with Gutenberg block comment delimiters
    $clean = preg_replace('/<!--.*?-->/s', '', $html);

    $header = '';
    $aside = '';
    $footer = '';
    $tail = '';
    $middle = $clean;

    // 1. Extract <header>...</header>
    if (preg_match('/(<header\b[^>]*>.*?<\/header>)/is', $middle, $m, PREG_OFFSET_CAPTURE)) {
        $header = $m[1][0];
        $middle = substr($middle, $m[1][1] + strlen($m[1][0]));
    }

    // 2. Extract <aside>...</aside> if present
    if (preg_match('/^\s*(<aside\b[^>]*>.*?<\/aside>)/is', $middle, $m)) {
        $aside = $m[1];
        $middle = substr($middle, strlen($m[0]));
    }

    // 3. Extract <footer>...</footer> and tail (modals + scripts)
    if (preg_match('/(<footer\b[^>]*>.*?<\/footer>)(.*)$/is', $middle, $m, PREG_OFFSET_CAPTURE)) {
        $footer = $m[1][0];
        $tail = $m[2][0];
        $middle = substr($middle, 0, $m[1][1]);
    }

    $middle = trim($middle);
    // Unwrap plain <main>...</main> (without classes) so individual <section> children become separate blocks
    if (preg_match('/^<main>\s*(.*)\s*<\/main>$/is', $middle, $m)) {
        $middle = trim($m[1]);
    }

    // Split $middle into top-level <section> or <main class="..."> blocks, preserving any leading div
    $sections = [];
    $pattern = '/<(section|main)\b[^>]*>/i';
    $offset = 0;
    $len = strlen($middle);

    while ($offset < $len && preg_match($pattern, $middle, $openMatch, PREG_OFFSET_CAPTURE, $offset)) {
        $tagStart = $openMatch[0][1];
        $tagName = strtolower($openMatch[1][0]);

        // If there is non-empty HTML before this tag (e.g. header div in we-hear-you.html), keep it as a section
        $before = trim(substr($middle, $offset, $tagStart - $offset));
        if ($before !== '') {
            $sections[] = $before;
        }

        // Find matching closing tag for $tagName (handling nested tags of the same name)
        $depth = 1;
        $searchPos = $tagStart + strlen($openMatch[0][0]);
        $tagPattern = '/<(\/?)' . preg_quote($tagName, '/') . '\b[^>]*>/i';
        $blockEnd = $len;

        while ($depth > 0 && preg_match($tagPattern, $middle, $nestedMatch, PREG_OFFSET_CAPTURE, $searchPos)) {
            if ($nestedMatch[1][0] === '/') {
                $depth--;
            } else {
                $depth++;
            }
            $searchPos = $nestedMatch[0][1] + strlen($nestedMatch[0][0]);
            if ($depth === 0) {
                $blockEnd = $searchPos;
                break;
            }
        }

        $sections[] = trim(substr($middle, $tagStart, $blockEnd - $tagStart));
        $offset = $blockEnd;
    }

    $remaining = trim(substr($middle, $offset));
    if ($remaining !== '') {
        $sections[] = $remaining;
    }

    return [
        'header'   => $header,
        'aside'    => $aside,
        'sections' => $sections,
        'footer'   => $footer,
        'tail'     => $tail,
    ];
}

/**
 * Serialize an aes/section Gutenberg block safely
 */
function aes_serialize_section_block($attrs) {
    if (isset($attrs['html'])) {
        $attrs['html'] = preg_replace('/<!--.*?-->/s', '', $attrs['html']);
        $attrs['html'] = rawurlencode(trim($attrs['html']));
    }
    $json = wp_json_encode($attrs, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    return '<!-- wp:aes/section ' . $json . " /-->\n\n";
}

/**
 * Build the complete Gutenberg post_content for a given template key and post ID
 */
function aes_build_gutenberg_content_for_page($key, $post_id) {
    $resolved = aes_get_resolved_template_html($key, $post_id);
    if (!$resolved) return '';
    $parts = aes_split_template_parts($resolved);

    $global_header = get_option('aes_global_header_html', '');
    if (!$global_header && !empty($parts['header'])) {
        $global_header = $parts['header'];
        update_option('aes_global_header_html', $global_header, false);
    }

    $global_footer = get_option('aes_global_footer_html', '');
    if (!$global_footer && !empty($parts['footer'])) {
        $global_footer = $parts['footer'];
        update_option('aes_global_footer_html', $global_footer, false);
    }

    $out = '';
    if (!empty($parts['header'])) {
        $out .= aes_serialize_section_block([
            'sectionId'      => 'global-header',
            'title'          => 'Header & Services Dropdown (Global)',
            'isGlobalHeader' => true,
            'isGlobalFooter' => false,
            'html'           => $global_header ?: $parts['header'],
        ]);
    }

    foreach ($parts['sections'] as $idx => $sec_html) {
        $num = $idx + 1;
        $out .= aes_serialize_section_block([
            'sectionId'      => $key . '-sec-' . $num,
            'title'          => aes_detect_section_title($sec_html, $num),
            'isGlobalHeader' => false,
            'isGlobalFooter' => false,
            'html'           => $sec_html,
        ]);
    }

    if (!empty($parts['footer'])) {
        $out .= aes_serialize_section_block([
            'sectionId'      => 'global-footer',
            'title'          => 'Footer & Contact Links (Global)',
            'isGlobalHeader' => false,
            'isGlobalFooter' => true,
            'html'           => $global_footer ?: $parts['footer'],
        ]);
    }

    return trim($out);
}

/**
 * Ensure all AES pages are migrated into Gutenberg blocks so the Block Editor shows the full visual page
 */
function aes_ensure_all_pages_migrated() {
    $ids = get_option('aes_page_ids', []);
    if (empty($ids) || !is_array($ids)) return;

    foreach ($ids as $key => $id) {
        $post = get_post($id);
        if (!$post) continue;
        if (strpos($post->post_content, 'wp:aes/section') === false) {
            $block_content = aes_build_gutenberg_content_for_page($key, $id);
            if ($block_content) {
                wp_update_post([
                    'ID'           => $id,
                    'post_content' => wp_slash($block_content),
                ]);
            }
        }
    }
}

add_action('init', function () {
    // Register the visual section Gutenberg block
    register_block_type('aes/section', [
        'api_version'     => 2,
        'attributes'      => [
            'sectionId'      => ['type' => 'string', 'default' => ''],
            'title'          => ['type' => 'string', 'default' => 'Page Section'],
            'isGlobalHeader' => ['type' => 'boolean', 'default' => false],
            'isGlobalFooter' => ['type' => 'boolean', 'default' => false],
            'html'           => ['type' => 'string', 'default' => ''],
        ],
        'render_callback' => function ($attrs) {
            $html = isset($attrs['html']) ? rawurldecode($attrs['html']) : '';
            if (!empty($attrs['isGlobalHeader'])) {
                $opt_html = get_option('aes_global_header_html', '');
                if ($opt_html) $html = $opt_html;
                $nav_html = aes_get_dynamic_nav();
                if ($nav_html) {
                    $html = preg_replace('/<div class="mega-dropdown-menu[^>]*>.*?<\/div>/s', $nav_html, $html);
                }
                return aes_resolve($html);
            }
            if (!empty($attrs['isGlobalFooter'])) {
                $opt_html = get_option('aes_global_footer_html', '');
                if ($opt_html) $html = $opt_html;
                return aes_resolve($html);
            }
            $html = str_replace(
                ['@@JOBS@@', '@@JOB_OPTIONS@@', '@@AJAX@@'],
                [aes_job_cards(), aes_job_options(), esc_url(admin_url('admin-ajax.php'))],
                $html
            );
            return aes_resolve($html);
        },
    ]);

    // Auto-migrate any AES pages with empty post_content into visual Gutenberg blocks
    if (!get_option('aes_gutenberg_migrated_v3')) {
        aes_ensure_all_pages_migrated();
        update_option('aes_gutenberg_migrated_v3', 1, false);
    }
}, 20);

// Also check single page when opening post.php in admin
add_action('load-post.php', function () {
    $post_id = isset($_GET['post']) ? intval($_GET['post']) : 0;
    if (!$post_id) return;
    $post = get_post($post_id);
    if (!$post || $post->post_type !== 'page') return;
    $key = get_post_meta($post_id, '_aes_layout', true);
    if ($key && isset(aes_data('manifest')[$key]) && strpos($post->post_content, 'wp:aes/section') === false) {
        $block_content = aes_build_gutenberg_content_for_page($key, $post_id);
        if ($block_content) {
            wp_update_post([
                'ID'           => $post_id,
                'post_content' => wp_slash($block_content),
            ]);
        }
    }
});

// Sync Global Header (including Services Dropdown) & Global Footer when any page is saved in Gutenberg
add_action('save_post_page', function ($post_id, $post) {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) return;
    if (strpos($post->post_content, 'wp:aes/section') === false) return;

    $blocks = parse_blocks($post->post_content);
    foreach ($blocks as $block) {
        if (($block['blockName'] ?? '') !== 'aes/section') continue;
        $attrs = $block['attrs'] ?? [];
        if (!empty($attrs['isGlobalHeader']) && !empty($attrs['html'])) {
            update_option('aes_global_header_html', rawurldecode($attrs['html']), false);
        }
        if (!empty($attrs['isGlobalFooter']) && !empty($attrs['html'])) {
            update_option('aes_global_footer_html', rawurldecode($attrs['html']), false);
        }
    }
}, 10, 2);

// Enqueue Gutenberg Visual Builder assets & page list for link/dropdown management
add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_media();
    wp_enqueue_style(
        'aes-gutenberg-fonts',
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap',
        [],
        null
    );
    wp_enqueue_style(
        'aes-gutenberg-cms',
        get_template_directory_uri() . '/assets/gutenberg-cms.css',
        [],
        '3.0'
    );
    wp_enqueue_script(
        'aes-gutenberg-cms',
        get_template_directory_uri() . '/assets/gutenberg-cms.js',
        ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-block-editor', 'wp-data', 'wp-edit-post'],
        time(), // cache-busting for testing
        true
    );

    // Gather all published pages for easy dropdown link selection
    $pages_list = [];
    foreach (get_pages(['post_status' => 'publish']) as $p) {
        $pages_list[] = [
            'title' => $p->post_title,
            'url'   => get_permalink($p->ID),
        ];
    }

    wp_localize_script('aes-gutenberg-cms', 'AES_GUTENBERG', [
        'themeUri'     => get_template_directory_uri(),
        'globalHeader' => get_option('aes_global_header_html', ''),
        'globalFooter' => get_option('aes_global_footer_html', ''),
        'pages'        => $pages_list,
        'menusUrl'     => admin_url('nav-menus.php'),
    ]);
});
