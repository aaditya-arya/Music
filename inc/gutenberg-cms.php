<?php
if (!defined('ABSPATH')) exit;

/**
 * Locate the HTML template file on disk for a given manifest key
 */
function aes_get_template_file($key) {
    if (!isset(aes_data('manifest')[$key])) return '';
    $file = AES_DIR . '/templates/' . $key . '.html';
    if (!file_exists($file)) {
        $manifest = aes_data('manifest');
        if (!empty($manifest[$key]['file'])) {
            $file = AES_DIR . '/templates/' . $manifest[$key]['file'];
        }
    }
    return file_exists($file) ? $file : '';
}

/**
 * Resolve the base HTML of a template using saved _aes_values and aes_shared_values
 */
function aes_get_resolved_template_html($key, $post_id = 0) {
    $file = aes_get_template_file($key);
    if (!$file) return '';
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

    $html = preg_replace_callback('/<footer\b[^>]*>.*?<\/footer>/is', function ($match) {
        return aes_refine_footer_markup($match[0]);
    }, $html);
    $html = aes_prepare_public_markup($html, $key);
    if ($key === 'about' || strpos($key, 'service-') === 0) {
        // Refine only content blocks; leave modal scripts and shared navigation intact.
        $parts = aes_split_template_parts($html);
        foreach ($parts['sections'] as &$section) {
            $section = aes_refine_detail_block($section, $key);
            if ($key === 'about') $section = aes_prepare_about_owner($section);
        }
        unset($section);
        $html = $parts['header'] . $parts['aside'] . implode("\n", $parts['sections']) . $parts['footer'] . $parts['tail'];
    }
    return aes_apply_hero_video(aes_resolve($html));
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
    if ($global_header) {
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

    if ($post_id) {
        $tpl_file = aes_get_template_file($key);
        if ($tpl_file && file_exists($tpl_file)) {
            update_post_meta($post_id, '_aes_template_synced_mtime', filemtime($tpl_file));
        }
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
                return aes_resolve(aes_policy_footer_links(aes_refine_footer_markup($html)));
            }
            $html = str_replace(
                ['@@JOBS@@', '@@JOB_OPTIONS@@', '@@AJAX@@'],
                [aes_job_cards(), aes_job_options(), esc_url(admin_url('admin-ajax.php'))],
                $html
            );
            $html = aes_apply_hero_video($html, ($attrs['sectionId'] ?? '') === 'home-sec-1');
            return aes_resolve($html);
        },
    ]);

    // Auto-migrate any AES pages with empty post_content into visual Gutenberg blocks
    if (!get_option('aes_gutenberg_migrated_v3')) {
        aes_ensure_all_pages_migrated();
        update_option('aes_gutenberg_migrated_v3', 1, false);
    }

    // Deploy freshly generated AES-branded images from brain directory to assets directory
    if (!get_option('aes_branded_assets_deployed_v1')) {
        $brain_dir = 'C:/Users/DELL/.gemini/antigravity/brain/467a317b-037f-49df-9524-9c5681004a98';
        $assets_map = [
            'aes_tpi_inspection_1791606832223.jpg'     => 'service_tpi.jpg',
            'aes_vendor_audit_1791606851565.jpg'       => 'service_vendor_audit.jpg',
            'aes_shutdown_inspection_1791606871693.jpg' => 'service_plant_shutdown.jpg',
            'aes_welding_inspection_1791606891936.jpg' => 'service_welding_nde.jpg',
            'aes_qaqc_dossier_1791606910139.jpg'       => 'service_qa_qc.jpg',
            'aes_preshipment_1791606930244.jpg'        => 'service_pre_dispatch.jpg',
            'aes_hydrotest_witness_1791606948958.jpg'  => 'service_hydrotest.jpg',
            'aes_tank_inspection_1791606969505.jpg'    => 'service_api_tank.jpg',
            'aes_coating_inspection_1791606987994.jpg' => 'service_coating.jpg',
            'aes_expediting_1791607022086.jpg'         => 'service_expediting.jpg',
            'aes_design_exam_1791607044502.jpg'        => 'service_design_calc.jpg',
            'aes_global_sourcing_1791607064391.jpg'    => 'service_global_sourcing.jpg',
            'aes_piping_spool_1791607085229.jpg'       => 'service_piping_spool.jpg',
        ];

        foreach ($assets_map as $src_name => $dest_name) {
            $src_file  = $brain_dir . '/' . $src_name;
            $dest_file = AES_DIR . '/assets/' . $dest_name;
            if (file_exists($src_file)) {
                copy($src_file, $dest_file);
            }
        }
        update_option('aes_branded_assets_deployed_v1', 1, false);
    }

    // Sync updated homepage structure, global header dropdown, and services page order
    if (!get_option('aes_home_synced_v8')) {
        $shared_vals = get_option('aes_shared_values', []);
        if (is_array($shared_vals)) {
            unset($shared_vals['gca3ee6126502']);
            update_option('aes_shared_values', $shared_vals, false);
        }
        delete_option('aes_global_header_html');

        $ids = get_option('aes_page_ids', []);
        $home_id = !empty($ids['home']) ? intval($ids['home']) : intval(get_option('page_on_front'));
        if ($home_id && get_post($home_id)) {
            $page_vals = get_post_meta($home_id, '_aes_values', true);
            if (is_array($page_vals)) {
                unset($page_vals['f218'], $page_vals['f219'], $page_vals['f220'], $page_vals['f221'], $page_vals['f222']);
                update_post_meta($home_id, '_aes_values', $page_vals);
            }
            $home_blocks = aes_build_gutenberg_content_for_page('home', $home_id);
            if ($home_blocks) {
                wp_update_post([
                    'ID'           => $home_id,
                    'post_content' => wp_slash($home_blocks),
                ]);
            }
        }

        $services_id = !empty($ids['services']) ? intval($ids['services']) : 0;
        if ($services_id && get_post($services_id)) {
            $svc_vals = get_post_meta($services_id, '_aes_values', true);
            if (is_array($svc_vals)) {
                unset($svc_vals['f238'], $svc_vals['f240']);
                update_post_meta($services_id, '_aes_values', $svc_vals);
            }
            $svc_blocks = aes_build_gutenberg_content_for_page('services', $services_id);
            if ($svc_blocks) {
                wp_update_post([
                    'ID'           => $services_id,
                    'post_content' => wp_slash($svc_blocks),
                ]);
            }
        }

        update_option('aes_home_synced_v8', 1, false);
    }

    // Sync updated homepage structure (removed subtitle lines f205, f255, f287 and perfected UX)
    if (!get_option('aes_home_synced_v9')) {
        $ids = get_option('aes_page_ids', []);
        $home_id = !empty($ids['home']) ? intval($ids['home']) : intval(get_option('page_on_front'));
        if ($home_id && get_post($home_id)) {
            $page_vals = get_post_meta($home_id, '_aes_values', true);
            if (is_array($page_vals)) {
                unset($page_vals['f205'], $page_vals['f255'], $page_vals['f287']);
                update_post_meta($home_id, '_aes_values', $page_vals);
            }
            $home_blocks = aes_build_gutenberg_content_for_page('home', $home_id);
            if ($home_blocks) {
                wp_update_post([
                    'ID'           => $home_id,
                    'post_content' => wp_slash($home_blocks),
                ]);
            }
        }
        update_option('aes_home_synced_v9', 1, false);
    }

    // Sync updated homepage structure (added premium Work With Us Career section)
    if (!get_option('aes_home_synced_v10')) {
        $ids = get_option('aes_page_ids', []);
        $home_id = !empty($ids['home']) ? intval($ids['home']) : intval(get_option('page_on_front'));
        if ($home_id && get_post($home_id)) {
            $home_blocks = aes_build_gutenberg_content_for_page('home', $home_id);
            if ($home_blocks) {
                wp_update_post([
                    'ID'           => $home_id,
                    'post_content' => wp_slash($home_blocks),
                ]);
            }
        }
        update_option('aes_home_synced_v10', 1, false);
    }

    // Sync updated homepage structure (high-contrast work-with-us section)
    if (!get_option('aes_home_synced_v11')) {
        $ids = get_option('aes_page_ids', []);
        $home_id = !empty($ids['home']) ? intval($ids['home']) : intval(get_option('page_on_front'));
        if ($home_id && get_post($home_id)) {
            $home_blocks = aes_build_gutenberg_content_for_page('home', $home_id);
            if ($home_blocks) {
                wp_update_post([
                    'ID'           => $home_id,
                    'post_content' => wp_slash($home_blocks),
                ]);
            }
        }
        update_option('aes_home_synced_v11', 1, false);
    }

    // Sync updated About page structure (Company Journey 1st, MD Intro with AES logo watermark 2nd, Distinct Mission & Vision 3rd)
    if (!get_option('aes_about_synced_v2')) {
        $ids = get_option('aes_page_ids', []);
        $about_id = !empty($ids['about']) ? intval($ids['about']) : 0;
        if (!$about_id) {
            $p = get_page_by_path('about');
            if ($p) $about_id = $p->ID;
        }
        if ($about_id && get_post($about_id)) {
            $about_blocks = aes_build_gutenberg_content_for_page('about', $about_id);
            if ($about_blocks) {
                wp_update_post([
                    'ID'           => $about_id,
                    'post_content' => wp_slash($about_blocks),
                ]);
            }
        }
        update_option('aes_about_synced_v2', 1, false);
    }

    // Sync updated Careers page structure (Appreciation card, Process of Employment, Apply Now form)
    if (!get_option('aes_careers_synced_v2')) {
        $ids = get_option('aes_page_ids', []);
        $careers_id = !empty($ids['careers']) ? intval($ids['careers']) : 0;
        if (!$careers_id) {
            $p = get_page_by_path('careers');
            if ($p) $careers_id = $p->ID;
        }
        if ($careers_id && get_post($careers_id)) {
            $careers_blocks = aes_build_gutenberg_content_for_page('careers', $careers_id);
            if ($careers_blocks) {
                wp_update_post([
                    'ID'           => $careers_id,
                    'post_content' => wp_slash($careers_blocks),
                ]);
            }
        }
        update_option('aes_careers_synced_v2', 1, false);
    }

    // Sync updated We Hear You page structure (4 selected contact reasons and synced fields)
    if (!get_option('aes_we_hear_you_synced_v2')) {
        $ids = get_option('aes_page_ids', []);
        $why_id = !empty($ids['we-hear-you']) ? intval($ids['we-hear-you']) : 0;
        if (!$why_id) {
            $p = get_page_by_path('we-hear-you');
            if ($p) $why_id = $p->ID;
        }
        if ($why_id && get_post($why_id)) {
            $why_blocks = aes_build_gutenberg_content_for_page('we-hear-you', $why_id);
            if ($why_blocks) {
                wp_update_post([
                    'ID'           => $why_id,
                    'post_content' => wp_slash($why_blocks),
                ]);
            }
        }
        update_option('aes_we_hear_you_synced_v2', 1, false);
    }

    // Clean and normalize navigation typography in global header if cached
    if (!get_option('aes_header_fonts_normalized_v1')) {
        $hdr = get_option('aes_global_header_html', '');
        if ($hdr) {
            update_option('aes_global_header_html', $hdr, false);
        }
        update_option('aes_header_fonts_normalized_v1', 1, false);
    }

    // Sync newly redesigned minimalistic footer and updated home page sections
    if (!get_option('aes_footer_minimal_synced_v8')) {
        delete_option('aes_global_footer_html');
        delete_option('aes_global_header_html');
        $ids = get_option('aes_page_ids', []);
        if (is_array($ids)) {
            foreach ($ids as $k => $pid) {
                $p = get_post($pid);
                if (!$p || strpos($p->post_content, 'wp:aes/section') === false) continue;
                $new_content = aes_build_gutenberg_content_for_page($k, $pid);
                if ($new_content) {
                    wp_update_post([
                        'ID'           => $pid,
                        'post_content' => wp_slash($new_content),
                    ]);
                }
            }
        }
        update_option('aes_footer_minimal_synced_v8', 1, false);
    }
}, 20);

// Migrate new pages automatically; replacing edited blocks requires an explicit template resync.
add_action('load-post.php', function () {
    $post_id = isset($_GET['post']) ? intval($_GET['post']) : 0;
    if (!$post_id) return;
    $post = get_post($post_id);
    if (!$post || $post->post_type !== 'page') return;
    $key = get_post_meta($post_id, '_aes_layout', true);
    if (!$key || !isset(aes_data('manifest')[$key])) return;

    $tpl_file    = aes_get_template_file($key);
    $tpl_mtime   = ($tpl_file && file_exists($tpl_file)) ? filemtime($tpl_file) : 0;

    $force_resync = isset($_GET['aes_resync']) && check_admin_referer('aes_resync_' . $post_id);
    $needs_initial_migration = strpos($post->post_content, 'wp:aes/section') === false;

    if ($needs_initial_migration || $force_resync) {
        $block_content = aes_build_gutenberg_content_for_page($key, $post_id);
        if ($block_content) {
            wp_update_post([
                'ID'           => $post_id,
                'post_content' => wp_slash($block_content),
            ]);
            update_post_meta($post_id, '_aes_template_synced_mtime', $tpl_mtime ?: time());
        }
        if ($force_resync) {
            wp_safe_redirect(remove_query_arg(['aes_resync', '_wpnonce']));
            exit;
        }
    }
});

// Sync Global Header & Footer when saved in Gutenberg, and update sync mtime so in-editor edits aren't overwritten
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

    // AJAX is authoritative. Ignore unchanged legacy meta-box fields on later page saves.
    if (aes_is_home_page($post_id) && current_user_can('edit_post', $post_id)
        && isset($_POST['aes_hero_video_url'], $_POST['aes_home_video_nonce'])
        && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['aes_home_video_nonce'])), 'aes_save_home_video')) {
        $new_video = esc_url_raw(trim(wp_unslash($_POST['aes_hero_video_url'])));
        $initial_video = esc_url_raw(trim(wp_unslash($_POST['aes_hero_video_initial'] ?? $new_video)));
        if ($new_video !== $initial_video) aes_save_hero_video_setting($post_id, $new_video);
    }

    $key = get_post_meta($post_id, '_aes_layout', true);
    $tpl_file = aes_get_template_file($key);
    $tpl_mtime = ($tpl_file && file_exists($tpl_file)) ? filemtime($tpl_file) : 0;
    update_post_meta($post_id, '_aes_template_synced_mtime', max($tpl_mtime, time()));
}, 10, 2);

// Register Admin Meta Box for Homepage Background Video
add_action('add_meta_boxes', function () {
    global $post;
    if (!$post || $post->post_type !== 'page') return;
    $layout = get_post_meta($post->ID, '_aes_layout', true);
    $front_id = (int) get_option('page_on_front');
    if ($layout === 'home' || $post->ID === $front_id || $post->post_name === 'home') {
        add_meta_box(
            'aes_home_hero_video_box',
            '🎬 Homepage Hero Background Video',
            'aes_render_home_video_meta_box',
            'page',
            'side',
            'high'
        );
    }
});

function aes_render_home_video_meta_box($post) {
    wp_nonce_field('aes_save_home_video', 'aes_home_video_nonce');
    $video_url = get_option('aes_hero_video_url', null);
    if ($video_url === null) {
        $page_vals = get_post_meta($post->ID, '_aes_values', true);
        if (is_array($page_vals) && !empty($page_vals['f182'])) {
            $video_url = aes_resolve($page_vals['f182']);
        }
    }
    if ($video_url === null) {
        $video_url = get_template_directory_uri() . '/video/video.mp4';
    }
    ?>
    <div class="aes-video-metabox" style="padding:4px 0;">
        <p style="font-size:12px;color:#64748b;margin:0 0 10px 0;line-height:1.4;">
            Upload, change, or remove the MP4 / WebM background video playing in the Homepage Hero section.
        </p>
        <div id="aes-video-preview-wrap" style="background:#070e22;border-radius:8px;overflow:hidden;margin-bottom:10px;border:1px solid #334155;<?php echo empty($video_url) ? 'display:none;' : ''; ?>">
            <video id="aes-admin-hero-preview" src="<?php echo esc_url($video_url); ?>" controls muted playsinline style="width:100%;max-height:160px;display:block;object-fit:cover;"></video>
        </div>
        <p style="margin:0 0 4px 0;"><label for="aes_hero_video_input" style="font-size:11px;font-weight:700;color:#334155;">Video URL:</label></p>
        <input type="hidden" id="aes_hero_video_initial" name="aes_hero_video_initial" value="<?php echo esc_attr($video_url); ?>" />
        <input type="text" id="aes_hero_video_input" name="aes_hero_video_url" value="<?php echo esc_attr($video_url); ?>" class="widefat" style="margin-bottom:8px;font-size:12px;" placeholder="https://.../video.mp4" />
        <div style="display:flex;gap:6px;margin-bottom:8px;">
            <button type="button" class="button button-primary" id="aes_choose_video_btn" style="flex:1;">
                📁 Choose Video
            </button>
            <button type="button" class="button button-secondary" id="aes_clear_video_btn" style="color:#b91c1c;">
                🗑 Remove
            </button>
        </div>
        <button type="button" class="button button-secondary" id="aes_manual_save_video_btn" style="width:100%;font-weight:700;">
            💾 Save Video to Homepage
        </button>
        <div id="aes-video-ajax-status" style="margin-top:8px;font-size:12px;font-weight:700;display:none;"></div>
        <script>
        jQuery(document).ready(function($){
            function saveHeroVideoAjax(url) {
                $('#aes-video-ajax-status').text('⏳ Saving video to homepage...').css('color', '#f16826').show();
                $.post(ajaxurl, {
                    action: 'aes_save_hero_video_ajax',
                    video_url: url,
                    post_id: <?php echo (int) $post->ID; ?>,
                    nonce: '<?php echo wp_create_nonce("aes_ajax_video_nonce"); ?>'
                }, function(res) {
                    if (res && res.success) {
                        $('#aes-video-ajax-status').text('✅ Video saved & active on homepage!').css('color', '#10b981').show();
                        $('#aes_hero_video_initial').val(res.data.video_url);
                        window.dispatchEvent(new CustomEvent('aes:hero-video-saved', { detail: { url: res.data.video_url } }));
                    } else {
                        $('#aes-video-ajax-status').text('❌ Error saving video.').css('color', '#ef4444').show();
                    }
                }).fail(function(){
                    $('#aes-video-ajax-status').text('Could not save video. Please try again.').css('color', '#ef4444').show();
                });
            }

            window.addEventListener('aes:hero-video-saved', function(event){
                var url = event.detail.url;
                $('#aes_hero_video_input, #aes_hero_video_initial').val(url);
                $('#aes-admin-hero-preview').attr('src', url);
                $('#aes-video-preview-wrap').toggle(Boolean(url));
            });

            $('#aes_choose_video_btn').on('click', function(e){
                e.preventDefault();
                var frame = wp.media({
                    title: 'Select Homepage Hero Background Video',
                    button: { text: 'Use this Video' },
                    library: { type: 'video' },
                    multiple: false
                });
                frame.on('select', function(){
                    var attachment = frame.state().get('selection').first().toJSON();
                    if (attachment && attachment.url) {
                        $('#aes_hero_video_input').val(attachment.url);
                        $('#aes-admin-hero-preview').attr('src', attachment.url);
                        $('#aes-video-preview-wrap').show();
                        saveHeroVideoAjax(attachment.url);
                    }
                });
                frame.open();
            });

            $('#aes_clear_video_btn').on('click', function(e){
                e.preventDefault();
                if (confirm('Remove the background video? The hero will display with a solid dark navy background.')) {
                    $('#aes_hero_video_input').val('');
                    $('#aes-admin-hero-preview').attr('src', '');
                    $('#aes-video-preview-wrap').hide();
                    saveHeroVideoAjax('');
                }
            });

            $('#aes_manual_save_video_btn').on('click', function(e){
                e.preventDefault();
                saveHeroVideoAjax($('#aes_hero_video_input').val());
            });

            $('#aes_hero_video_input').on('change', function(){
                var u = $(this).val();
                if (u) {
                    $('#aes-admin-hero-preview').attr('src', u);
                    $('#aes-video-preview-wrap').show();
                } else {
                    $('#aes-video-preview-wrap').hide();
                }
                saveHeroVideoAjax(u);
            });
        });
        </script>
    </div>
    <?php
}

// Both video controls persist only the setting, without rewriting the open editor's page.
function aes_handle_hero_video_ajax($nonce_action) {
    check_ajax_referer($nonce_action, 'nonce');
    $post_id = isset($_POST['post_id']) ? absint($_POST['post_id']) : 0;
    if (!$post_id || !current_user_can('edit_post', $post_id) || !aes_is_home_page($post_id)) {
        wp_send_json_error(['message' => 'You cannot change the video for this page.'], 403);
    }
    if (!isset($_POST['video_url']) || !is_string($_POST['video_url'])) {
        wp_send_json_error(['message' => 'Missing video URL.'], 400);
    }
    $url = aes_save_hero_video_setting($post_id, wp_unslash($_POST['video_url']));
    wp_send_json_success(['video_url' => $url]);
}

add_action('wp_ajax_aes_save_hero_video_ajax', function () {
    aes_handle_hero_video_ajax('aes_ajax_video_nonce');
});

// Enqueue media library scripts when editing pages in standard admin
add_action('admin_enqueue_scripts', function () {
    $screen = get_current_screen();
    if ($screen && $screen->post_type === 'page') {
        wp_enqueue_media();
    }
});

// Enqueue Gutenberg Visual Builder assets & page list for link/dropdown management with dynamic cache busting
add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_media();
    wp_enqueue_style(
        'aes-gutenberg-fonts',
        get_template_directory_uri() . '/assets/fonts.css',
        [],
        filemtime(AES_DIR . '/assets/fonts.css')
    );

    $ver_util    = file_exists(AES_DIR . '/assets/compiled.css') ? filemtime(AES_DIR . '/assets/compiled.css') : '3.0';
    $ver_site    = file_exists(AES_DIR . '/assets/site.css') ? filemtime(AES_DIR . '/assets/site.css') : '3.0';
    $ver_cms_css = file_exists(AES_DIR . '/assets/gutenberg-cms.css') ? filemtime(AES_DIR . '/assets/gutenberg-cms.css') : '3.0';
    $ver_cms_js  = file_exists(AES_DIR . '/assets/gutenberg-cms.js') ? filemtime(AES_DIR . '/assets/gutenberg-cms.js') : '3.0';

    wp_enqueue_style('aes-utilities', get_template_directory_uri() . '/assets/compiled.css', [], $ver_util);
    wp_enqueue_style('aes-site', get_template_directory_uri() . '/assets/site.css', ['aes-utilities'], $ver_site);
    wp_enqueue_style(
        'aes-gutenberg-cms',
        get_template_directory_uri() . '/assets/gutenberg-cms.css',
        ['aes-site'],
        $ver_cms_css
    );
    wp_enqueue_script(
        'aes-gutenberg-cms',
        get_template_directory_uri() . '/assets/gutenberg-cms.js',
        ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-block-editor', 'wp-data', 'wp-edit-post'],
        $ver_cms_js,
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

    $post_id = isset($_GET['post']) ? intval($_GET['post']) : 0;
    $layout  = $post_id ? get_post_meta($post_id, '_aes_layout', true) : '';

    $g_header = get_option('aes_global_header_html', '');
    if ($g_header) {
    }

    wp_localize_script('aes-gutenberg-cms', 'AES_GUTENBERG', [
        'themeUri'     => get_template_directory_uri(),
        'globalHeader' => $g_header,
        'globalFooter' => get_option('aes_global_footer_html', ''),
        'pages'        => $pages_list,
        'menusUrl'     => admin_url('nav-menus.php'),
        'ajaxUrl'      => admin_url('admin-ajax.php'),
        'nonce'        => wp_create_nonce('aes_gutenberg_sync'),
        'postId'       => $post_id,
        'layout'       => $layout,
        'supportRequests' => aes_data('support-requests'),
    ]);
});

// AJAX: Re-sync entire page from code template file
add_action('wp_ajax_aes_resync_page_template', function () {
    check_ajax_referer('aes_gutenberg_sync', 'nonce');
    if (!current_user_can('edit_pages')) {
        wp_send_json_error(['message' => 'Unauthorized permissions']);
    }

    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    if (!$post_id) wp_send_json_error(['message' => 'Missing post ID']);

    $key = get_post_meta($post_id, '_aes_layout', true);
    if (!$key || !isset(aes_data('manifest')[$key])) {
        wp_send_json_error(['message' => 'Invalid page layout']);
    }

    $block_content = aes_build_gutenberg_content_for_page($key, $post_id);
    if (!$block_content) {
        wp_send_json_error(['message' => 'Could not build template blocks']);
    }

    wp_update_post([
        'ID'           => $post_id,
        'post_content' => wp_slash($block_content),
    ]);

    $tpl_file = aes_get_template_file($key);
    $tpl_mtime = ($tpl_file && file_exists($tpl_file)) ? filemtime($tpl_file) : time();
    update_post_meta($post_id, '_aes_template_synced_mtime', $tpl_mtime);

    wp_send_json_success([
        'message' => 'Page successfully re-synced from code template (templates/' . esc_html($key) . '.html)!',
    ]);
});

add_action('wp_ajax_aes_save_hero_video', function () {
    aes_handle_hero_video_ajax('aes_gutenberg_sync');
});

// AJAX: Fetch fresh HTML for a specific section from disk template
add_action('wp_ajax_aes_get_fresh_section_html', function () {
    check_ajax_referer('aes_gutenberg_sync', 'nonce');
    if (!current_user_can('edit_pages')) {
        wp_send_json_error(['message' => 'Unauthorized permissions']);
    }

    $post_id    = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    $section_id = isset($_POST['section_id']) ? sanitize_text_field($_POST['section_id']) : '';
    if (!$post_id || !$section_id) wp_send_json_error(['message' => 'Missing arguments']);

    $key = get_post_meta($post_id, '_aes_layout', true);
    if (!$key || !isset(aes_data('manifest')[$key])) {
        wp_send_json_error(['message' => 'Invalid page layout']);
    }

    $resolved = aes_get_resolved_template_html($key, $post_id);
    if (!$resolved) wp_send_json_error(['message' => 'Could not resolve template']);

    $parts = aes_split_template_parts($resolved);
    $html = '';

    if ($section_id === 'global-header') {
        $html = $parts['header'];
    } elseif ($section_id === 'global-footer') {
        $html = $parts['footer'];
    } else {
        foreach ($parts['sections'] as $idx => $sec) {
            $num = $idx + 1;
            $candidate_id = $key . '-sec-' . $num;
            if ($candidate_id === $section_id) {
                $html = $sec;
                break;
            }
        }
    }

    if (!$html) {
        wp_send_json_error(['message' => 'Section not found in template']);
    }

    wp_send_json_success([
        'html' => rawurlencode($html),
    ]);
});
