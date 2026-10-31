<?php
if (!defined('ABSPATH')) exit;

function aes_is_home_page($post_id) {
    return get_post_meta($post_id, '_aes_layout', true) === 'home' || (int) $post_id === (int) get_option('page_on_front');
}

function aes_validate_hero_playlist($items) {
    if (!is_array($items)) return new WP_Error('aes_video_list', 'The video playlist must be a list.');
    $result = [];
    foreach ($items as $index => $item) {
        $value = is_array($item) ? ($item['url'] ?? '') : $item;
        $url = is_string($value) ? esc_url_raw(trim($value), ['http', 'https']) : '';
        $extension = strtolower(pathinfo(parse_url($url, PHP_URL_PATH) ?: '', PATHINFO_EXTENSION));
        if (!$url || !preg_match('~^https?://[^/]+/~i', $url) || !in_array($extension, ['mp4', 'webm', 'ogv', 'ogg', 'm4v'], true)) {
            return new WP_Error('aes_video_url', 'Video ' . ($index + 1) . ' needs a full MP4, WebM, OGV or M4V file URL.');
        }
        $result[] = ['id' => sanitize_key(is_array($item) ? ($item['id'] ?? '') : '') ?: 'video-' . ($index + 1), 'url' => $url];
    }
    return $result;
}

function aes_default_hero_playlist() {
    $base = get_template_directory_uri() . '/video/';
    return [['id' => 'wind', 'url' => $base . 'wind_turbine.mp4'], ['id' => 'solar', 'url' => $base . 'solar_plant.mp4']];
}

function aes_get_hero_playlist($post_id = 0) {
    $post_id = $post_id ?: (get_the_ID() ?: (int) get_option('page_on_front'));
    if ($post_id && metadata_exists('post', $post_id, '_aes_hero_video_playlist')) {
        $saved = aes_validate_hero_playlist(get_post_meta($post_id, '_aes_hero_video_playlist', true));
        return is_wp_error($saved) ? [] : $saved;
    }
    $defaults = aes_default_hero_playlist();
    $legacy = get_option('aes_hero_video_url', null);
    if ($legacy === '' || $legacy === 'none') return [];
    if ($legacy !== null && aes_resolve($legacy) !== $defaults[0]['url']) return [['id' => 'legacy', 'url' => aes_resolve($legacy)]];
    return $defaults;
}

function aes_save_hero_playlist($post_id, $items) {
    $items = aes_validate_hero_playlist($items);
    if (is_wp_error($items)) return $items;
    update_post_meta($post_id, '_aes_hero_video_playlist', $items);
    $first = $items[0]['url'] ?? '';
    // An isolated draft has its own playlist; it cannot change the live home page.
    if ((int) $post_id === (int) get_option('page_on_front')) update_option('aes_hero_video_url', $first, false);
    $values = get_post_meta($post_id, '_aes_values', true);
    $values = is_array($values) ? $values : [];
    $values['f182'] = $first;
    update_post_meta($post_id, '_aes_values', $values);
    clean_post_cache($post_id);
    return $items;
}

function aes_save_hero_video_setting($post_id, $url) {
    $url = trim($url);
    $items = $url === '' ? [] : aes_get_hero_playlist($post_id);
    if ($url !== '') $items[0] = ['id' => $items[0]['id'] ?? 'video-1', 'url' => $url];
    $saved = aes_save_hero_playlist($post_id, $items);
    return is_wp_error($saved) ? $saved : ($saved[0]['url'] ?? '');
}

/** Empty lists remove both player and buffer. No frontend fallback can restore them. */
function aes_apply_hero_video($html, $is_hero = false, $post_id = 0, $playlist = null) {
    if (!$is_hero && strpos($html, 'heroVideo') === false) return $html;
    $items = $playlist === null ? aes_get_hero_playlist($post_id) : aes_validate_hero_playlist($playlist);
    if (is_wp_error($items)) $items = [];
    $pattern = '/<video\b[^>]*\bid=["\']heroVideo(?:Buffer)?["\'][^>]*>.*?<\/video>/is';
    if (!$items) return preg_replace($pattern, '', $html);
    $urls = array_column($items, 'url');
    $seen_primary = false;
    $html = preg_replace_callback($pattern, function ($match) use ($urls, &$seen_primary) {
        $processor = new WP_HTML_Tag_Processor($match[0]);
        $processor->next_tag('video');
        $buffer = $processor->get_attribute('id') === 'heroVideoBuffer';
        if ($buffer && count($urls) < 2) return '';
        if (!$buffer) $seen_primary = true;
        foreach (['src', 'data-playlist', 'data-aes-playlist', 'loop'] as $name) $processor->remove_attribute($name);
        if (!$buffer) {
            $processor->set_attribute('data-aes-playlist', wp_json_encode($urls));
            if (count($urls) === 1) $processor->set_attribute('loop', true);
        }
        $url = $urls[$buffer ? 1 : 0];
        $type = wp_check_filetype(parse_url($url, PHP_URL_PATH) ?: '')['type'] ?: 'video/mp4';
        $source = '<source src="' . esc_url($url) . '" type="' . esc_attr($type) . '" />';
        return preg_replace_callback('/(<video\b[^>]*>).*?(<\/video>)/is', function ($parts) use ($source) { return $parts[1] . $source . $parts[2]; }, $processor->get_updated_html());
    }, $html);
    if (!$seen_primary && $is_hero) {
        $video = '<video id="heroVideo" class="w-full h-full object-cover aes-hero-video-active" autoplay muted playsinline data-aes-playlist="' . esc_attr(wp_json_encode($urls)) . '"' . (count($urls) === 1 ? ' loop' : '') . '><source src="' . esc_url($urls[0]) . '" /></video>';
        $html = preg_replace_callback('/<div\b[^>]*class=["\'][^"\']*absolute inset-0[^"\']*["\'][^>]*>/i', function ($open) use ($video) { return $open[0] . $video; }, $html, 1);
    }
    return $html;
}

add_filter('rest_prepare_page', function ($response, $post, $request) {
    if ($request->get_param('context') !== 'edit') return $response;
    $data = $response->get_data();
    if (!isset($data['content']['raw'])) return $response;
    $blocks = parse_blocks($data['content']['raw']);
    foreach ($blocks as &$block) {
        if (($block['blockName'] ?? '') !== 'aes/section') continue;
        $attrs = $block['attrs'] ?? [];
        if (!empty($attrs['isGlobalHeader'])) {
            $header = get_option('aes_global_header_html', '');
            if ($header) $block['attrs']['html'] = rawurlencode($header);
        }
        if (!aes_is_home_page($post->ID) || ($attrs['sectionId'] ?? '') !== 'home-sec-1') continue;
        $items = !empty($attrs['heroPlaylistManaged']) ? ($attrs['heroPlaylist'] ?? []) : aes_get_hero_playlist($post->ID);
        $block['attrs']['html'] = rawurlencode(aes_apply_hero_video(rawurldecode($attrs['html'] ?? ''), true, $post->ID, $items));
    }
    unset($block);
    $data['content']['raw'] = serialize_blocks($blocks);
    $response->set_data($data);
    return $response;
}, 10, 3);

add_filter('rest_pre_insert_page', function ($prepared, $request) {
    if (!isset($prepared->post_content)) return $prepared;
    foreach (parse_blocks($prepared->post_content) as $block) {
        $attrs = $block['attrs'] ?? [];
        if (($block['blockName'] ?? '') !== 'aes/section' || empty($attrs['heroPlaylistManaged'])) continue;
        $valid = aes_validate_hero_playlist($attrs['heroPlaylist'] ?? []);
        if (is_wp_error($valid)) { $valid->add_data(['status' => 400]); return $valid; }
    }
    return $prepared;
}, 10, 2);

// REST saves metadata after post content; keep the legacy first-video field consistent.
add_action('rest_after_insert_page', function ($post) {
    if (!aes_is_home_page($post->ID)) return;
    foreach (parse_blocks($post->post_content) as $block) {
        $attrs = $block['attrs'] ?? [];
        if (($attrs['sectionId'] ?? '') === 'home-sec-1' && !empty($attrs['heroPlaylistManaged'])) {
            aes_save_hero_playlist($post->ID, $attrs['heroPlaylist'] ?? []);
            break;
        }
    }
});
