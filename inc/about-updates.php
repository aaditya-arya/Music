<?php
if (!defined('ABSPATH')) exit;

/** Repair only the legacy leadership section, preserving its editable copy. */
function aes_refine_about_leadership($html) {
    if (strpos($html, 'mdLeadership') === false || strpos($html, 'aes-about-leadership') !== false) return $html;
    $doc = new DOMDocument('1.0', 'UTF-8');
    $previous = libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="UTF-8"><div id="aes-about-update-root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors(); libxml_use_internal_errors($previous);
    $xpath = new DOMXPath($doc);
    $section = $doc->getElementById('mdLeadership');
    if (!$section) return $html;
    $shell = $xpath->query('./div', $section)->item(0);
    $old_intro = $shell ? $xpath->query('./div[1]', $shell)->item(0) : null;
    $body = $shell ? $xpath->query('./div[contains(@class,"lg:grid-cols-12")]', $shell)->item(0) : null;
    $story = $body ? $xpath->query('./div[1]', $body)->item(0) : null;
    $heading = $old_intro ? $xpath->query('.//h2', $old_intro)->item(0) : null;
    $summary = $old_intro ? $xpath->query('.//p', $old_intro)->item(0) : null;
    $eyebrow = $old_intro ? $xpath->query('.//*[contains(@class,"inline-flex")]', $old_intro)->item(0) : null;
    if (!$shell || !$body || !$story || !$heading) return $html;

    $section->setAttribute('class', 'aes-about-leadership');
    $shell->setAttribute('class', 'aes-about-shell');
    $intro = $doc->createElement('div'); $intro->setAttribute('class', 'aes-about-leadership__intro');
    $watermark = $doc->createElement('img');
    foreach (['class' => 'aes-about-leadership__watermark', 'src' => aes_resolve('@@ASSET@@/assets/aes-watermark.svg'), 'alt' => '', 'aria-hidden' => 'true', 'loading' => 'lazy', 'width' => '460', 'height' => '460'] as $key => $value) $watermark->setAttribute($key, $value);
    $intro->appendChild($watermark);
    $copy = $doc->createElement('div'); $copy->setAttribute('class', 'aes-about-leadership__intro-copy');
    if ($eyebrow) {
        $label = $doc->createElement('span'); $label->setAttribute('class', 'aes-about-leadership__eyebrow');
        $label->appendChild($doc->createTextNode(trim($eyebrow->textContent))); $copy->appendChild($label);
    }
    $heading->setAttribute('class', 'aes-about-leadership__heading'); $copy->appendChild($heading);
    if ($summary) { $summary->setAttribute('class', 'aes-about-leadership__summary'); $copy->appendChild($summary); }
    $intro->appendChild($copy); $shell->replaceChild($intro, $old_intro);

    // Retain the company story and signed quote; remove the obsolete portrait column.
    $quote = $xpath->query('.//blockquote', $story)->item(0);
    if ($quote) $quote->parentNode->removeChild($quote);
    $story->setAttribute('class', 'aes-about-leadership__story');
    $new_body = $doc->createElement('div'); $new_body->setAttribute('class', 'aes-about-leadership__body');
    $new_body->appendChild($story);
    if ($quote) { $quote->setAttribute('class', 'aes-about-leadership__quote'); $new_body->appendChild($quote); }
    $shell->replaceChild($new_body, $body);

    $result = '';
    foreach ($doc->getElementById('aes-about-update-root')->childNodes as $node) $result .= $doc->saveHTML($node);
    return preg_replace('/\bviewbox=/i', 'viewBox=', $result);
}

add_action('init', function () {
    if (get_option('aes_about_leadership_v1')) return;
    $id = intval(get_option('aes_page_ids', [])['about'] ?? 0);
    if (!$id) return;
    $post = get_post($id);
    if (!$post) return;
    $blocks = parse_blocks($post->post_content);
    $changed = false; $found = false;
    foreach ($blocks as &$block) {
        if (($block['blockName'] ?? '') !== 'aes/section' || !empty($block['attrs']['isGlobalHeader']) || !empty($block['attrs']['isGlobalFooter'])) continue;
        $html = rawurldecode($block['attrs']['html'] ?? '');
        $updated = aes_refine_about_leadership($html);
        if (strpos($updated, 'aes-about-leadership') !== false) $found = true;
        if ($updated !== $html) { $block['attrs']['html'] = rawurlencode($updated); $changed = true; }
    }
    unset($block);
    if (!$found) return;
    if ($changed) {
        foreach ($blocks as &$block) {
            foreach (['isGlobalHeader' => 'aes_global_header_html', 'isGlobalFooter' => 'aes_global_footer_html'] as $flag => $option) {
                if (!empty($block['attrs'][$flag]) && get_option($option)) $block['attrs']['html'] = rawurlencode(get_option($option));
            }
        }
        unset($block);
        $result = wp_update_post(['ID' => $id, 'post_content' => wp_slash(serialize_blocks($blocks))], true);
        if (is_wp_error($result)) return;
    }
    update_option('aes_about_leadership_v1', 1, false);
}, 37);
