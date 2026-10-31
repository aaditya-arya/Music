<?php
if (!defined('ABSPATH')) exit;
define('AES_DIR', get_template_directory());

function aes_data($name) {
    static $cache = [];
    if (!isset($cache[$name])) $cache[$name] = json_decode(file_get_contents(AES_DIR . '/data/' . $name . '.json'), true) ?: [];
    return $cache[$name];
}

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('editor-styles');
    add_editor_style(['assets/fonts.css', 'assets/compiled.css', 'assets/site.css', 'assets/brand-refinements.css', 'assets/public-pages.css', 'assets/services-page.css', 'assets/support-page.css', 'assets/gutenberg-cms.css']);
    register_nav_menus([
        'primary' => 'Services Dropdown Menu'
    ]);
});

class AES_Nav_Walker extends Walker_Nav_Menu {
    function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
        $output .= '<a class="block px-4 py-2.5 text-xs font-bold text-white hover:text-brand-orange hover:bg-white/5 transition-colors" href="' . esc_url($item->url) . '">';
        $output .= apply_filters('the_title', $item->title, $item->ID);
        $output .= '</a>';
    }
    function end_el(&$output, $item, $depth = 0, $args = null) {}
}

function aes_get_dynamic_nav() {
    if (has_nav_menu('primary')) {
        return wp_nav_menu([
            'theme_location' => 'primary',
            'container'      => false,
            'items_wrap'     => '<div class="mega-dropdown-menu absolute top-full left-1/2 -translate-x-1/2 w-72 bg-[#0b1633] border border-slate-700/80 shadow-2xl rounded-2xl py-2 invisible opacity-0 z-50 transition-all flex flex-col text-left divide-y divide-white/10">%3$s</div>',
            'echo'           => false,
            'fallback_cb'    => false,
            'walker'         => new AES_Nav_Walker()
        ]);
    }
    return '';
}

function aes_page_url($key) {
    if ($key === 'home') return home_url('/');
    if ($key === 'admin') return admin_url();
    if ($key === 'blog') return function_exists('aes_blog_url') ? aes_blog_url() : home_url('/blog/');
    if (strpos($key, 'service-') === 0) {
        return home_url('/service/' . substr($key, 8) . '/');
    }
    $ids = get_option('aes_page_ids', []);
    return !empty($ids[$key]) && get_post_status($ids[$key]) === 'publish' ? get_permalink($ids[$key]) : home_url('/' . $key . '/');
}

add_filter('page_link', function ($link, $post_id) {
    $key = get_post_meta($post_id, '_aes_layout', true);
    if (!$key) {
        $post = get_post($post_id);
        if ($post && strpos($post->post_name, 'service-') === 0) {
            $key = $post->post_name;
        }
    }
    if ($key && strpos($key, 'service-') === 0) {
        return home_url('/service/' . substr($key, 8) . '/');
    }
    return $link;
}, 10, 2);

add_action('init', function () {
    add_rewrite_rule('^service/([a-z0-9-]+)/?$', 'index.php?pagename=service-$matches[1]', 'top');
}, 5);

add_filter('request', function ($query_vars) {
    $path = trim(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH), '/');
    if (preg_match('#^service/([a-z0-9-]+)$#i', $path, $m)) {
        $service_key = 'service-' . strtolower($m[1]);
        if (isset(aes_data('manifest')[$service_key])) {
            $ids = get_option('aes_page_ids', []);
            if (!empty($ids[$service_key])) {
                return ['page_id' => intval($ids[$service_key])];
            }
            return ['pagename' => $service_key];
        }
    }
    return $query_vars;
});

function aes_resolve($value) {
    $value = str_replace('@@ASSET@@', untrailingslashit(get_template_directory_uri()), $value);
    $value = preg_replace_callback('/@@PAGE:([a-zA-Z0-9_-]+)@@/', function ($m) { return aes_page_url($m[1]); }, $value);
    $value = preg_replace('~(/service)-([a-z0-9-]+)(/?)(?=["\'\?#\s>]|$)~i', '$1/$2$3', $value);
    return $value;
}

function aes_current_key() {
    $meta = get_post_meta(get_queried_object_id(), '_aes_layout', true);
    if ($meta && isset(aes_data('manifest')[$meta])) return $meta;
    $post = get_queried_object();
    if ($post && !empty($post->post_name) && isset(aes_data('manifest')[$post->post_name])) {
        return $post->post_name;
    }
    if (is_front_page()) return 'home';

    $path = trim(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH), '/');
    if (preg_match('#^service/([a-z0-9-]+)$#i', $path, $m)) {
        $service_key = 'service-' . strtolower($m[1]);
        if (isset(aes_data('manifest')[$service_key])) {
            return $service_key;
        }
    }
    $slug = basename($path);
    if ($slug && isset(aes_data('manifest')[$slug])) {
        return $slug;
    }
    if ($path && isset(aes_data('manifest')[$path])) {
        return $path;
    }
    return '';
}

add_action('template_redirect', function () {
    $path = trim(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH), '/');
    if (preg_match('#^service-([a-z0-9-]+)$#i', $path, $m)) {
        $service_key = 'service-' . strtolower($m[1]);
        if (isset(aes_data('manifest')[$service_key])) {
            wp_safe_redirect(home_url('/service/' . strtolower($m[1]) . '/'), 301);
            exit;
        }
    }
    if (strtolower($path) === 'service') {
        wp_safe_redirect(aes_page_url('services'), 301);
        exit;
    }
    $key = aes_current_key();
    if ($key && isset(aes_data('manifest')[$key]) && is_404()) {
        global $wp_query;
        $wp_query->is_404 = false;
        status_header(200);
    }
});

function aes_fields($key) {
    $data = aes_data($key);
    return $data['fields'] ?? [];
}

function aes_optimize_html_standards($html) {
    if (!$html || !is_string($html)) return $html;
    static $size_cache = [];

    // Auto-enrich images with width/height, loading=lazy, decoding=async
    return preg_replace_callback('/<img\b([^>]*)>/i', function ($match) use (&$size_cache) {
        $attrs = $match[1];

        // Skip loading="lazy" if fetchpriority="high"
        $is_high = stripos($attrs, 'fetchpriority="high"') !== false || stripos($attrs, "fetchpriority='high'") !== false;
        if (!$is_high && stripos($attrs, 'loading=') === false) {
            $attrs .= ' loading="lazy"';
        }
        if (stripos($attrs, 'decoding=') === false) {
            $attrs .= ' decoding="async"';
        }

        // Detect dimensions for local assets if missing width or height
        $has_width = stripos($attrs, 'width=') !== false;
        $has_height = stripos($attrs, 'height=') !== false;
        if ((!$has_width || !$has_height) && preg_match('~src=["\']([^"\'?#]+)~i', $attrs, $src_m)) {
            $src = $src_m[1];
            $asset_name = '';
            if (preg_match('~/assets/([^"\'?#]+)~i', $src, $name_m)) {
                $asset_name = $name_m[1];
            }
            if ($asset_name) {
                if (!isset($size_cache[$asset_name])) {
                    $file_path = AES_DIR . '/assets/' . $asset_name;
                    $size_cache[$asset_name] = file_exists($file_path) ? @getimagesize($file_path) : false;
                }
                $size = $size_cache[$asset_name];
                if ($size && !empty($size[0]) && !empty($size[1])) {
                    if (!$has_width) $attrs .= ' width="' . intval($size[0]) . '"';
                    if (!$has_height) $attrs .= ' height="' . intval($size[1]) . '"';
                }
            }
        }

        return '<img' . $attrs . '>';
    }, $html);
}

function aes_render($key) {
    if (!isset(aes_data('manifest')[$key])) return '';
    $post_id = get_queried_object_id();
    $post = $post_id ? get_post($post_id) : null;

    // Resolve template base for modals/scripts tail (and fallback if post_content not yet migrated)
    $resolved_full = aes_get_resolved_template_html($key, $post_id);
    $resolved_full = str_replace(
        ['@@JOBS@@', '@@JOB_OPTIONS@@', '@@AJAX@@'],
        [aes_job_cards(), aes_job_options(), esc_url(admin_url('admin-ajax.php'))],
        $resolved_full
    );

    if ($post && strpos($post->post_content, 'wp:aes/section') === false) {
        $migrated = aes_build_gutenberg_content_for_page($key, $post_id);
        if ($migrated) {
            wp_update_post([
                'ID'           => $post_id,
                'post_content' => wp_slash($migrated),
            ]);
            $post = get_post($post_id);
        }
    }

    if ($post && !empty($post->post_content) && has_blocks($post->post_content)) {
        $parts = aes_split_template_parts($resolved_full);
        $blocks_html = do_blocks($post->post_content);
        if (strpos($blocks_html, '<main') === false) {
            $blocks_html = preg_replace_callback(
                '/(<\/header>)(.*?)(<footer\b)/is',
                function ($m) {
                    return $m[1] . '<main id="main-content">' . $m[2] . '</main>' . $m[3];
                },
                $blocks_html,
                1
            );
        }
        $full_output = aes_resolve($parts['aside'] . $blocks_html . $parts['tail']);
        return aes_optimize_html_standards($full_output);
    }

    $full_output = aes_resolve($resolved_full);
    return aes_optimize_html_standards($full_output);
}

add_action('send_headers', function () {
    if (headers_sent()) return;
    header_remove('X-Powered-By');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
    header("Content-Security-Policy: frame-ancestors 'self'");
});

add_action('wp_enqueue_scripts', function () {
    $ver = filemtime(AES_DIR . '/assets/site.css') ?: '3.0';
    wp_enqueue_style('aes-utilities', get_template_directory_uri() . '/assets/compiled.css', [], $ver);
    wp_enqueue_style('aes-site', get_template_directory_uri() . '/assets/site.css', ['aes-utilities'], $ver);
    wp_enqueue_style('aes-brand-refinements', get_template_directory_uri() . '/assets/brand-refinements.css', ['aes-site'], filemtime(AES_DIR . '/assets/brand-refinements.css'));
    wp_enqueue_style('aes-fonts', get_template_directory_uri() . '/assets/fonts.css', [], filemtime(AES_DIR . '/assets/fonts.css'));
    wp_enqueue_style('aes-public-pages', get_template_directory_uri() . '/assets/public-pages.css', ['aes-brand-refinements'], filemtime(AES_DIR . '/assets/public-pages.css'));
    if (aes_current_key() === 'services') {
        wp_enqueue_style('aes-services-page', get_template_directory_uri() . '/assets/services-page.css', ['aes-public-pages'], filemtime(AES_DIR . '/assets/services-page.css'));
        wp_enqueue_script('aes-services-page', get_template_directory_uri() . '/assets/services-page.js', ['aes-site'], filemtime(AES_DIR . '/assets/services-page.js'), true);
    }
    if (aes_current_key() === 'we-hear-you') {
        wp_enqueue_style('aes-support-page', get_template_directory_uri() . '/assets/support-page.css', ['aes-public-pages'], filemtime(AES_DIR . '/assets/support-page.css'));
        wp_enqueue_script('aes-support-page', get_template_directory_uri() . '/assets/support-page.js', ['aes-site', 'aes-forms'], filemtime(AES_DIR . '/assets/support-page.js'), true);
        wp_localize_script('aes-support-page', 'AES_SUPPORT_REQUESTS', aes_data('support-requests'));
    }
    wp_enqueue_script('aes-site', get_template_directory_uri() . '/assets/site.js', [], filemtime(AES_DIR . '/assets/site.js'), true);
    wp_localize_script('aes-site', 'AES', ['theme' => get_template_directory_uri(), 'ajax' => admin_url('admin-ajax.php'), 'nonce' => wp_create_nonce('aes_submit'), 'supportUrl' => aes_page_url('we-hear-you'), 'brochureUrl' => aes_site_settings()['brochure_url']]);
    wp_enqueue_script('aes-brochure', get_template_directory_uri() . '/assets/brochure-reader.js', ['aes-site'], filemtime(AES_DIR . '/assets/brochure-reader.js'), true);
    wp_enqueue_script('aes-forms', get_template_directory_uri() . '/assets/forms.js', ['aes-site'], filemtime(AES_DIR . '/assets/forms.js'), true);
    wp_add_inline_style('aes-site', '#wpadminbar{position:fixed!important;top:0!important}.admin-bar > header{top:32px}.aes-form-status{padding:12px;margin-top:12px;font-size:14px}.aes-form-status[data-error="true"]{color:#b91c1c}.aes-form-status[data-error="false"]{color:#166534}.aes-trap{position:absolute!important;left:-9999px!important}.aes-generic{max-width:1100px;margin:auto;padding:60px 24px}.aes-generic h1{font-size:40px;font-weight:800}.aes-generic p{margin:16px 0}@media(max-width:782px){.admin-bar > header{top:46px}}');
});

add_action('wp_head', function () {
    foreach (['inter', 'montserrat'] as $font) {
        echo '<link rel="preload" href="' . esc_url(get_template_directory_uri() . '/assets/fonts/' . $font . '-latin.woff2') . '" as="font" type="font/woff2" crossorigin />';
    }
}, 1);

require AES_DIR . '/inc/site-controls.php';
require AES_DIR . '/inc/hero-video.php';
require AES_DIR . '/inc/brand-intro.php';
require AES_DIR . '/inc/gutenberg-cms.php';
require AES_DIR . '/inc/presentation-updates.php';
require AES_DIR . '/inc/detail-pages.php';
require AES_DIR . '/inc/about-updates.php';
require AES_DIR . '/inc/public-pages.php';
require AES_DIR . '/inc/services-directory.php';
require AES_DIR . '/inc/support-updates.php';
require AES_DIR . '/inc/admin.php';
require AES_DIR . '/inc/policies.php';
require AES_DIR . '/inc/blog.php';
require AES_DIR . '/inc/submissions.php';

function aes_register_types() {
    register_post_type('aes_job', ['labels' => ['name' => 'AES Jobs', 'singular_name' => 'Job', 'add_new_item' => 'Add job'], 'public' => false, 'show_ui' => true, 'show_in_rest' => true, 'supports' => ['title', 'editor', 'revisions'], 'menu_icon' => 'dashicons-businessperson']);
    register_post_type('aes_submission', ['labels' => ['name' => 'AES Submissions', 'singular_name' => 'Submission'], 'public' => false, 'publicly_queryable' => false, 'show_ui' => true, 'show_in_menu' => false, 'show_in_rest' => false, 'supports' => ['title'], 'menu_icon' => 'dashicons-email-alt', 'capabilities' => ['edit_post' => 'manage_options', 'read_post' => 'manage_options', 'delete_post' => 'manage_options', 'edit_posts' => 'manage_options', 'edit_others_posts' => 'manage_options', 'publish_posts' => 'manage_options', 'read_private_posts' => 'manage_options', 'delete_posts' => 'manage_options', 'delete_private_posts' => 'manage_options', 'delete_published_posts' => 'manage_options', 'delete_others_posts' => 'manage_options', 'edit_private_posts' => 'manage_options', 'edit_published_posts' => 'manage_options', 'create_posts' => 'do_not_allow'], 'map_meta_cap' => false]);
}
add_action('init', 'aes_register_types');

function aes_job_cards() {
    $jobs = get_posts(['post_type' => 'aes_job', 'post_status' => 'publish', 'numberposts' => -1, 'orderby' => 'date', 'order' => 'ASC']);
    if (!$jobs) return '<p>No vacancies are currently published. You can submit a general application below.</p>';
    $html = '';
    foreach ($jobs as $job) {
        $d = (array) get_post_meta($job->ID, '_aes_job', true);
        $html .= '<article class="bouncy-card bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between"><div><div class="flex items-center justify-between gap-2 mb-4"><span class="bg-orange-100 text-brand-orange text-[11px] font-extrabold px-3 py-1 rounded-full">' . esc_html($d['type'] ?? '') . '</span><span class="text-xs text-slate-400">' . esc_html($d['location'] ?? '') . '</span></div><h3 class="text-lg font-black text-brand-dark mb-2">' . esc_html($job->post_title) . '</h3><div class="text-xs text-slate-600 leading-relaxed mb-4">' . wp_kses_post(wpautop($job->post_content)) . '</div><p class="text-xs text-slate-500"><strong>Experience:</strong> ' . esc_html($d['experience'] ?? '') . '</p><p class="text-xs text-slate-500"><strong>Key skills:</strong> ' . esc_html($d['skills'] ?? '') . '</p></div><div class="mt-6 pt-4 border-t border-slate-100"><button type="button" data-aes-role="' . esc_attr($job->post_title) . '" class="bouncy-btn w-full btn-premium-orange bg-brand-blue hover:bg-brand-orange text-white py-3 rounded-xl text-xs font-bold uppercase transition-colors">Apply for this role →</button></div></article>';
    }
    return $html;
}

function aes_job_options() {
    $html = '<option value="">Select a role</option>';
    foreach (get_posts(['post_type' => 'aes_job', 'numberposts' => -1, 'post_status' => 'publish']) as $j) {
        $html .= '<option>' . esc_html($j->post_title) . '</option>';
    }
    return $html . '<option>General application / Other</option>';
}

function aes_setup_pages() {
    $ids = get_option('aes_page_ids', []);
    foreach (aes_data('manifest') as $key => $d) {
        if (!empty($ids[$key]) && get_post($ids[$key])) continue;
        $existing = get_posts(['post_type' => 'page', 'post_status' => 'any', 'meta_key' => '_aes_layout', 'meta_value' => $key, 'numberposts' => 1]);
        if ($existing) {
            $ids[$key] = $existing[0]->ID;
            continue;
        }
        $by_slug = get_page_by_path($key, OBJECT, 'page');
        if ($by_slug && $by_slug->post_status === 'publish') {
            $ids[$key] = $by_slug->ID;
            update_post_meta($by_slug->ID, '_aes_layout', $key);
            continue;
        }
        $id = wp_insert_post(['post_type' => 'page', 'post_status' => 'publish', 'post_title' => $d['title'], 'post_name' => $key, 'meta_input' => ['_aes_layout' => $key]], true);
        if (is_wp_error($id)) return $id;
        $ids[$key] = $id;
    }
    update_option('aes_page_ids', $ids, false);
    update_option('show_on_front', 'page');
    update_option('page_on_front', $ids['home']);
    if (!get_option('aes_jobs_seeded')) {
        foreach (aes_data('jobs') as $d) {
            wp_insert_post(['post_type' => 'aes_job', 'post_status' => 'publish', 'post_title' => $d['title'], 'post_content' => $d['description'], 'meta_input' => ['_aes_job' => ['type' => $d['type'], 'location' => $d['location'], 'experience' => $d['experience'], 'skills' => $d['skills']]]]);
        }
        update_option('aes_jobs_seeded', 1, false);
    }
    aes_ensure_all_pages_migrated();
    return $ids;
}

add_action('admin_post_aes_setup', function () {
    if (!current_user_can('manage_options')) wp_die('Not allowed', 403);
    check_admin_referer('aes_setup');
    $r = aes_setup_pages();
    if (is_wp_error($r)) wp_die(esc_html($r->get_error_message()));
    wp_safe_redirect(admin_url('admin.php?page=aes-cms&ready=1'));
    exit;
});
