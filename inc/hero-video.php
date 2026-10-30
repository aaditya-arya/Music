<?php
if (!defined('ABSPATH')) exit;

function aes_is_home_page($post_id) {
    return get_post_meta($post_id, '_aes_layout', true) === 'home'
        || (int) $post_id === (int) get_option('page_on_front');
}

/** A missing setting uses the template; an empty setting intentionally removes video. */
function aes_apply_hero_video($html, $is_hero = false) {
    $url = get_option('aes_hero_video_url', null);
    if ($url === null || (!$is_hero && strpos($html, 'heroVideo') === false)) return $html;
    $url = $url === 'none' ? '' : aes_resolve($url);
    $pattern = '/<video\b[^>]*\bid=["\']heroVideo["\'][^>]*>.*?<\/video>/is';
    if ($url === '') return preg_replace($pattern, '', $html);

    $file = wp_check_filetype(parse_url($url, PHP_URL_PATH) ?: '');
    $type = $file['type'] ?: 'video/mp4';
    $source = '<source src="' . esc_url($url) . '" type="' . esc_attr($type) . '" />';
    if (preg_match($pattern, $html)) {
        return preg_replace_callback($pattern, function ($match) use ($source) {
            // Remove competing sources and a video-level src so browsers cannot pick the old URL.
            $video = preg_replace('/\s+src=["\'][^"\']*["\']/i', '', $match[0]);
            $video = preg_replace('/<source\b[^>]*\/?\s*>/i', '', $video);
            return preg_replace_callback('/<video\b[^>]*>/i', function ($open) use ($source) {
                return $open[0] . $source;
            }, $video, 1);
        }, $html, 1);
    }
    if (!$is_hero) return $html;
    // Restore video even when an older editor save removed its entire element.
    $video = '<video id="heroVideo" class="w-full h-full object-cover" autoplay muted playsinline>' . $source . '</video>';
    return preg_replace_callback('/<div\b[^>]*class=["\'][^"\']*absolute inset-0[^"\']*["\'][^>]*>/i', function ($open) use ($video) {
        return $open[0] . $video;
    }, $html, 1);
}

function aes_save_hero_video_setting($post_id, $url) {
    $url = esc_url_raw(trim($url));
    update_option('aes_hero_video_url', $url, false);
    $values = get_post_meta($post_id, '_aes_values', true);
    $values = is_array($values) ? $values : [];
    $values['f182'] = $url;
    update_post_meta($post_id, '_aes_values', $values);
    clean_post_cache($post_id);
    return $url;
}

// The editor receives the same saved video as the frontend, including after a stale page save.
add_filter('rest_prepare_page', function ($response, $post, $request) {
    if ($request->get_param('context') !== 'edit' || !aes_is_home_page($post->ID)) return $response;
    $data = $response->get_data();
    if (!isset($data['content']['raw'])) return $response;
    $blocks = parse_blocks($data['content']['raw']);
    foreach ($blocks as &$block) {
        if (($block['blockName'] ?? '') !== 'aes/section') continue;
        $attrs = $block['attrs'] ?? [];
        if (($attrs['sectionId'] ?? '') !== 'home-sec-1') continue;
        $block['attrs']['html'] = rawurlencode(aes_apply_hero_video(rawurldecode($attrs['html'] ?? ''), true));
    }
    unset($block);
    $data['content']['raw'] = serialize_blocks($blocks);
    $response->set_data($data);
    return $response;
}, 10, 3);
