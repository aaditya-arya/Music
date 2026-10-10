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
