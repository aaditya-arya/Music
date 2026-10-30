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
