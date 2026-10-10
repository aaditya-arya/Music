<?php
if (!defined('ABSPATH')) exit;

/** Update only the requested Careers section, keeping the existing application and jobs. */
function aes_simplify_career_culture($html) {
    if (strpos($html, 'aes-culture-gallery') !== false) return $html;
    return preg_replace_callback('/<section\b[^>]*class="[^"]*aes-culture-section[^"]*"[^>]*>.*?<\/section>/s', function ($match) {
        $doc = new DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $doc->loadHTML('<?xml encoding="UTF-8">' . $match[0], LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors(); libxml_use_internal_errors($previous);
        $xpath = new DOMXPath($doc);
        $section = $doc->getElementsByTagName('section')->item(0);
        if (!$section) return $match[0];
        $cards = $xpath->query('.//article[contains(concat(" ", normalize-space(@class), " "), " aes-culture-card ")]', $section);
        if ($cards->length !== 4) return $match[0];
        $section->setAttribute('class', $section->getAttribute('class') . ' aes-culture-gallery');
        foreach ($xpath->query('.//*[contains(@class,"aes-section-introduction")]/p', $section) as $paragraph) $paragraph->parentNode->removeChild($paragraph);
        $grid = $cards->item(0)->parentNode;
        $grid->setAttribute('tabindex', '0'); $grid->setAttribute('role', 'region');
        $grid->setAttribute('aria-label', 'Our working principles; scroll horizontally on smaller screens');
        foreach ($cards as $index => $card) {
            $image = $xpath->query('.//*[contains(@class,"aes-culture-card__image")]', $card)->item(0);
            $title = $xpath->query('.//h3', $card)->item(0);
            if (!$image || !$title) continue;
            $image = $image->cloneNode(true); $title = $title->cloneNode(true);
            while ($card->firstChild) $card->removeChild($card->firstChild);
            $card->appendChild($image); $card->appendChild($title);
            if ($index < 3) {
                $svg = $doc->createElement('svg');
                foreach (['class' => 'aes-culture-arrow', 'viewBox' => '0 0 64 40', 'fill' => 'none', 'stroke' => 'currentColor', 'stroke-width' => '3', 'aria-hidden' => 'true'] as $key => $value) $svg->setAttribute($key, $value);
                $path = $doc->createElement('path'); $path->setAttribute('d', 'M3 20h56M43 5l16 15-16 15');
                $svg->appendChild($path); $card->appendChild($svg);
            }
        }
        return $doc->saveHTML($section);
    }, $html);
}

add_action('init', function () {
    $ids = (array) get_option('aes_page_ids', []);
    if (!get_option('aes_career_culture_gallery_v1') && !empty($ids['careers'])) {
        $post = get_post($ids['careers']);
        if ($post) {
            $blocks = parse_blocks($post->post_content);
            $changed = false;
            $has_gallery = false;
            foreach ($blocks as &$block) {
                if (($block['blockName'] ?? '') !== 'aes/section' || !empty($block['attrs']['isGlobalHeader']) || !empty($block['attrs']['isGlobalFooter'])) continue;
                $old = rawurldecode($block['attrs']['html'] ?? '');
                $new = aes_simplify_career_culture($old);
                if (strpos($new, 'aes-culture-gallery') !== false) $has_gallery = true;
                if ($old !== $new) { $block['attrs']['html'] = rawurlencode($new); $changed = true; }
            }
            unset($block);
            if ($changed) {
                $result = wp_update_post(['ID' => $post->ID, 'post_content' => wp_slash(serialize_blocks($blocks))], true);
                if (!is_wp_error($result)) update_option('aes_career_culture_gallery_v1', 1, false);
            } elseif ($has_gallery) update_option('aes_career_culture_gallery_v1', 1, false);
        }
    }
    if (get_option('aes_support_page_v1') || empty($ids['we-hear-you'])) return;
    $post = get_post($ids['we-hear-you']);
    if (!$post) return;
    $parts = aes_split_template_parts(aes_get_resolved_template_html('we-hear-you', $post->ID));
    if (count($parts['sections']) !== 1 || strpos($parts['sections'][0], 'aes-support-page') === false) return;
    $header = get_option('aes_global_header_html', '') ?: $parts['header'];
    $footer = get_option('aes_global_footer_html', '') ?: $parts['footer'];
    $blocks = [];
    foreach ([['global-header', 'Header', $header, 'isGlobalHeader'], ['support-page', 'We Hear You', $parts['sections'][0], ''], ['global-footer', 'Footer', $footer, 'isGlobalFooter']] as [$id, $title, $html, $global]) {
        $attrs = ['sectionId' => $id, 'title' => $title, 'html' => rawurlencode($html)];
        if ($global) $attrs[$global] = true;
        $blocks[] = ['blockName' => 'aes/section', 'attrs' => $attrs, 'innerBlocks' => [], 'innerHTML' => '', 'innerContent' => []];
    }
    $result = wp_update_post(['ID' => $post->ID, 'post_content' => wp_slash(serialize_blocks($blocks))], true);
    if (!is_wp_error($result)) update_option('aes_support_page_v1', 1, false);
}, 35);
