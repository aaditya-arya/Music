<?php
if (!defined('ABSPATH')) exit;

/** Install the authorized Services redesign once; later visual edits remain authoritative. */
add_action('init', function () {
    if (get_option('aes_services_directory_v1')) return;
    $ids = (array) get_option('aes_page_ids', []);
    if (empty($ids['services'])) return;
    $post = get_post($ids['services']);
    if (!$post) return;
    $parts = aes_split_template_parts(aes_get_resolved_template_html('services', $post->ID));
    if (count($parts['sections']) !== 1 || strpos($parts['sections'][0], 'aes-services-page') === false) return;
    $old = parse_blocks($post->post_content);
    $replacement = [];
    $header = get_option('aes_global_header_html', '') ?: $parts['header'];
    $footer = get_option('aes_global_footer_html', '') ?: $parts['footer'];
    foreach ($old as $block) if (!empty($block['attrs']['isGlobalHeader'])) {
        $block['attrs']['html'] = rawurlencode($header);
        $replacement[] = $block;
    }
    if (!$replacement && $header) $replacement[] = [
        'blockName' => 'aes/section', 'attrs' => ['sectionId' => 'global-header', 'title' => 'Header', 'isGlobalHeader' => true, 'html' => rawurlencode($header)],
        'innerBlocks' => [], 'innerHTML' => '', 'innerContent' => []
    ];
    $replacement[] = [
        'blockName' => 'aes/section', 'attrs' => ['sectionId' => 'services-directory', 'title' => 'Services — B2B portfolio', 'html' => rawurlencode($parts['sections'][0])],
        'innerBlocks' => [], 'innerHTML' => '', 'innerContent' => []
    ];
    $replacement[] = [
        'blockName' => 'aes/section', 'attrs' => ['sectionId' => 'global-footer', 'title' => 'Footer', 'isGlobalFooter' => true, 'html' => rawurlencode($footer)],
        'innerBlocks' => [], 'innerHTML' => '', 'innerContent' => []
    ];
    $result = wp_update_post(['ID' => $post->ID, 'post_content' => wp_slash(serialize_blocks($replacement))], true);
    if (!is_wp_error($result)) update_option('aes_services_directory_v1', 1, false);
}, 34);

/** Apply the requested headline once, keeping the rest of the saved page intact. */
add_action('init', function () {
    if (get_option('aes_services_tagline_v1')) return;
    $ids = (array) get_option('aes_page_ids', []);
    $post = get_post(intval($ids['services'] ?? 0));
    if (!$post) return;
    $blocks = parse_blocks($post->post_content);
    $changed = false;
    foreach ($blocks as &$block) {
        if (($block['blockName'] ?? '') !== 'aes/section') continue;
        if (!empty($block['attrs']['isGlobalHeader']) || !empty($block['attrs']['isGlobalFooter'])) continue;
        $html = rawurldecode($block['attrs']['html'] ?? '');
        $updated = preg_replace('/(<h1\b[^>]*\bid=["\']services-heading["\'][^>]*>).*?(<\/h1>)/s', '$1Trusted inspection for safer tomorrow$2', $html, 1, $count);
        if ($count && $updated !== $html) {
            $block['attrs']['html'] = rawurlencode($updated);
            $changed = true;
        }
    }
    unset($block);
    if ($changed) {
        // Page saves sync shared blocks; pass their current values through unchanged.
        foreach ($blocks as &$block) {
            foreach (['isGlobalHeader' => 'aes_global_header_html', 'isGlobalFooter' => 'aes_global_footer_html'] as $flag => $option) {
                if (!empty($block['attrs'][$flag]) && get_option($option)) $block['attrs']['html'] = rawurlencode(get_option($option));
            }
        }
        unset($block);
        $result = wp_update_post(['ID' => $post->ID, 'post_content' => wp_slash(serialize_blocks($blocks))], true);
        if (is_wp_error($result)) return;
    }
    $values = (array) get_post_meta($post->ID, '_aes_values', true);
    $values['f186'] = 'Trusted inspection for safer tomorrow';
    update_post_meta($post->ID, '_aes_values', $values);
    update_option('aes_services_tagline_v1', 1, false);
}, 36);
