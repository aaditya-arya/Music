<?php
if (!defined('ABSPATH')) exit;

function aes_blog_url() {
    $id = intval(get_option('aes_blog_page_id'));
    return $id && get_post_status($id) === 'publish' ? get_permalink($id) : home_url('/blog/');
}

/** Keep normal WordPress Posts as the article source and a native page for intro copy. */
add_action('init', function () {
    if (get_option('aes_blog_setup_v1')) return;
    $page = get_page_by_path('blog');
    if (!$page) {
        $id = wp_insert_post([
            'post_type' => 'page', 'post_status' => 'publish', 'post_name' => 'blog', 'post_title' => 'Engineering Insights',
            'post_content' => '<!-- wp:paragraph --><p>Perspectives on inspection, quality assurance and safer project delivery. Explore the thinking behind our work and the questions that matter to engineering teams.</p><!-- /wp:paragraph -->',
            'meta_input' => ['_wp_page_template' => 'page-blog.php'],
        ], true);
        if (is_wp_error($id)) return;
    } else {
        $id = $page->ID;
        update_post_meta($id, '_wp_page_template', 'page-blog.php');
    }
    update_option('aes_blog_page_id', $id, false);
    $ids = (array) get_option('aes_page_ids', []); $ids['blog'] = $id; update_option('aes_page_ids', $ids, false);
    update_option('aes_blog_setup_v1', 1, false);
}, 41);

/** Add Blog without rebuilding any page or replacing shared footer copy. */
function aes_blog_footer_links($html) {
    if (!$html || strpos($html, '<footer') === false) return $html;
    $doc = new DOMDocument('1.0', 'UTF-8'); $previous = libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="UTF-8"><div id="aes-blog-footer-root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors(); libxml_use_internal_errors($previous); $xpath = new DOMXPath($doc);
    foreach ($xpath->query('//footer//a') as $link) {
        if (stripos($link->textContent, 'Engineering Insights') !== false) {
            $link->setAttribute('href', aes_blog_url()); $link->removeAttribute('onclick');
        }
    }
    $list = $xpath->query('//footer//*[contains(concat(" ", normalize-space(@class), " "), " aes-footer-links ")]//*[self::ul or contains(concat(" ", normalize-space(@class), " "), " footer-list ")]')->item(0);
    if ($list) {
        $exists = false;
        foreach ($xpath->query('.//a', $list) as $link) if (strcasecmp(trim($link->textContent), 'Blog') === 0) { $link->setAttribute('href', aes_blog_url()); $exists = true; }
        if (!$exists) {
            $link = $doc->createElement('a', 'Blog');
            $sample = $xpath->query('.//a', $list)->item(0);
            if ($sample) $link->setAttribute('class', $sample->getAttribute('class'));
            $link->setAttribute('href', aes_blog_url());
            if ($list->nodeName === 'ul') { $item = $doc->createElement('li'); $item->appendChild($link); $list->appendChild($item); }
            else $list->appendChild($link);
        }
    }
    $html = ''; foreach ($doc->getElementById('aes-blog-footer-root')->childNodes as $node) $html .= $doc->saveHTML($node);
    return preg_replace('/\bviewbox=/i', 'viewBox=', $html);
}

add_action('init', function () {
    if (get_option('aes_blog_footer_v2')) return;
    $footer = get_option('aes_global_footer_html', ''); if (!$footer) return;
    $updated = aes_blog_footer_links(aes_refine_footer_markup($footer));
    update_option('aes_global_footer_html', $updated, false);
    update_option('aes_blog_footer_v2', 1, false);
}, 42);

add_action('wp_enqueue_scripts', function () {
    if (is_page_template('page-blog.php') || is_singular('post')) wp_enqueue_style('aes-blog', get_template_directory_uri() . '/assets/blog.css', ['aes-public-pages'], filemtime(AES_DIR . '/assets/blog.css'));
});

/** Leave the untouched WordPress welcome example out of the engineering library. */
function aes_blog_sample_posts() {
    $sample = get_page_by_path('hello-world', OBJECT, 'post');
    return $sample && $sample->post_title === 'Hello world!' && strpos($sample->post_content, 'Welcome to WordPress') !== false ? [$sample->ID] : [];
}

function aes_blog_header() {
    $html = get_option('aes_global_header_html', ''); $menu = aes_get_dynamic_nav();
    if ($menu) $html = preg_replace('/<div class="mega-dropdown-menu[^>]*>.*?<\/div>/s', $menu, $html);
    echo aes_resolve($html);
}

/** Seed foundational engineering articles and category taxonomy if not already present. */
add_action('init', function () {
    if (get_option('aes_blog_seeded_v3')) return;
    
    $blog_id = intval(get_option('aes_blog_page_id'));
    if ($blog_id) {
        wp_update_post([
            'ID' => $blog_id,
            'post_content' => '<!-- wp:paragraph --><p>Technical perspectives on third-party inspection, advanced non-destructive testing, ASME code compliance, and asset integrity management from the senior engineering specialists at Akshar Engineering Services.</p><!-- /wp:paragraph -->'
        ]);
    }

    $get_cat = function ($name, $slug) {
        $term = term_exists($slug, 'category');
        if (!$term) $term = wp_insert_term($name, 'category', ['slug' => $slug]);
        return is_array($term) ? intval($term['term_id']) : intval($term);
    };

    $get_cat('Third-Party Inspection', 'third-party-inspection');
    $get_cat('NDT & Materials Testing', 'ndt-materials-testing');
    $get_cat('Plant & Asset Integrity', 'plant-asset-integrity');
    $get_cat('Welding & Metallurgy', 'welding-metallurgy');
    $get_cat('Quality Assurance & Standards', 'quality-assurance-standards');

    $helper_attach = function ($rel_path, $title, $post_id = 0) {
        $full_path = get_template_directory() . '/' . ltrim($rel_path, '/');
        if (!file_exists($full_path)) return 0;
        $filename = basename($full_path);
        $upload_dir = wp_upload_dir();
        $target = $upload_dir['path'] . '/' . $filename;
        if (!file_exists($target)) @copy($full_path, $target);
        if (!file_exists($target)) return 0;

        $existing = get_posts([
            'post_type' => 'attachment',
            'meta_key' => '_wp_attached_file',
            'meta_value' => _wp_relative_upload_path($target),
            'posts_per_page' => 1
        ]);
        if (!empty($existing)) return $existing[0]->ID;

        $filetype = wp_check_filetype($filename, null);
        $attachment = [
            'post_mime_type' => $filetype['type'],
            'post_title' => $title,
            'post_content' => '',
            'post_status' => 'inherit'
        ];
        $attach_id = wp_insert_attachment($attachment, $target, $post_id);
        if (!is_wp_error($attach_id) && file_exists(ABSPATH . 'wp-admin/includes/image.php')) {
            require_once ABSPATH . 'wp-admin/includes/image.php';
            $attach_data = wp_generate_attachment_metadata($attach_id, $target);
            wp_update_attachment_metadata($attach_id, $attach_data);
        }
        return is_wp_error($attach_id) ? 0 : $attach_id;
    };

    $articles = [
        ['slug' => 'role-of-type-a-third-party-inspection', 'title' => 'The Role of Type-A Third-Party Inspection in Heavy Fabrication & Pressure Equipment', 'img' => 'assets/service_tpi.jpg'],
        ['slug' => 'advanced-ultrasonic-testing-paut-tofd-vs-radiography', 'title' => 'Advanced Ultrasonic Testing (PAUT & TOFD) vs. Radiography in Thick-Walled Welds', 'img' => 'assets/service_welding_nde.jpg'],
        ['slug' => 'api-653-storage-tank-inspection-integrity', 'title' => 'API 653 Storage Tank Inspection: Bottom Settlement, Corrosion Rates & Outage QA', 'img' => 'assets/service_api_tank.jpg'],
        ['slug' => 'qualifying-wps-pqr-duplex-stainless-steels-asme-ix', 'title' => 'Qualifying WPS/PQR for Duplex Stainless Steels Under ASME Section IX', 'img' => 'assets/service_qa_qc.jpg'],
        ['slug' => 'pre-dispatch-inspection-mtr-verification-counterfeit-prevention', 'title' => 'Pre-Dispatch Inspection & Mill Test Report Verification: Preventing Counterfeit Materials', 'img' => 'assets/service_pre_dispatch.jpg'],
        ['slug' => 'qa-qc-playbook-fast-track-refinery-turnarounds', 'title' => 'QA/QC Playbook for Fast-Track Refinery Turnarounds: Delivering Zero Rework', 'img' => 'assets/service_plant_shutdown.jpg'],
    ];

    foreach ($articles as $art) {
        $p = get_page_by_path($art['slug'], OBJECT, 'post');
        if ($p) {
            update_post_meta($p->ID, 'aes_post_image', $art['img']);
            if (!has_post_thumbnail($p->ID)) {
                $aid = $helper_attach($art['img'], $art['title'], $p->ID);
                if ($aid) set_post_thumbnail($p->ID, $aid);
            }
        }
    }

    update_option('aes_blog_seeded_v3', 1, false);
}, 43);
