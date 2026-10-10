<?php
if (!defined('ABSPATH')) exit;

/** Use the contact page as the canonical source for the corporate address. */
function aes_contact_address() {
    $id = get_option('aes_page_ids', [])['contact-us'] ?? 0;
    $post = get_post($id);
    if ($post) {
        foreach (parse_blocks($post->post_content) as $block) {
            $html = rawurldecode($block['attrs']['html'] ?? '');
            if (preg_match('/<address\b[^>]*class="aes-contact-address"[^>]*>(.*?)<\/address>/s', $html, $match)) return trim(html_entity_decode(wp_strip_all_tags($match[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        }
    }
    $values = (array) get_post_meta($id, '_aes_values', true);
    return $values['c_addr_text'] ?? aes_fields('contact-us')['c_addr_text']['default'];
}

/** Keep the saved footer structure while removing decorative emoji and pointers. */
function aes_refine_footer_markup($html) {
    if (!$html || !class_exists('DOMDocument')) return $html;
    static $cache = [];
    $address = aes_contact_address();
    $key = md5($html . $address);
    if (isset($cache[$key])) return $cache[$key];
    $doc = new DOMDocument('1.0', 'UTF-8');
    $previous = libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="UTF-8"><div id="aes-footer-root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors();
    libxml_use_internal_errors($previous);
    $xpath = new DOMXPath($doc);
    $add_class = function ($node, $class) {
        $classes = preg_split('/\s+/', trim($node->getAttribute('class')));
        if (!in_array($class, $classes, true)) $node->setAttribute('class', trim($node->getAttribute('class') . ' ' . $class));
    };
    foreach ($xpath->query('//footer/div[1]') as $node) $add_class($node, 'aes-footer-inner');
    $roles = ['aes-footer-brand', 'aes-footer-portals', 'aes-footer-links', 'aes-footer-contact'];
    foreach ($xpath->query('//footer//*[contains(concat(" ", normalize-space(@class), " "), " footer-grid ")]/div') as $i => $node) {
        if (isset($roles[$i])) $add_class($node, $roles[$i]);
    }
    foreach (iterator_to_array($xpath->query('//footer//p')) as $node) {
        if (preg_match('/ISO\/I(?:EC|ES)\s*170/i', $node->textContent)) $node->parentNode->removeChild($node);
    }
    $address_node = $xpath->query('//footer//*[contains(@class,"aes-footer-contact")]//p')->item(0);
    if ($address_node) $address_node->nodeValue = $address;
    foreach ($xpath->query('//footer//text()') as $node) {
        if (stripos($node->nodeValue, 'flipbook') !== false) $node->nodeValue = 'Read or download our company profile';
        if (preg_match('/ISO\/I(?:EC|ES)\s*170/i', $node->nodeValue)) $node->nodeValue = preg_replace('/\s*[•·]?\s*ISO\/I(?:EC|ES)\s*170[^\r\n]*/u', '', $node->nodeValue);
    }
    // Removing the whole icon holder also removes its empty square and spacing.
    foreach ($xpath->query('//footer//*[self::span or self::div][not(*)]') as $node) {
        if (preg_match('/^[\s\x{FE0F}\x{200D}\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}›→➜]+$/u', $node->textContent)) {
            $node->parentNode->removeChild($node);
        }
    }
    foreach ($xpath->query('//footer//text()[not(ancestor::script) and not(ancestor::style)]') as $node) {
        $node->nodeValue = preg_replace('/[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{FE0F}\x{200D}›→➜]/u', '', $node->nodeValue);
    }
    foreach ($xpath->query('//footer//a[@aria-label][.//*[local-name()="svg"]]') as $node) {
        if (!preg_match('/\baes-social-link\b/', $node->getAttribute('class'))) {
            $node->setAttribute('class', trim($node->getAttribute('class') . ' aes-social-link'));
        }
    }
    $root = $doc->getElementById('aes-footer-root');
    $clean = '';
    foreach ($root->childNodes as $child) $clean .= $doc->saveHTML($child);
    // HTML parsing lowercases SVG's case-sensitive viewBox attribute.
    $clean = preg_replace('/\bviewbox=/i', 'viewBox=', $clean);
    return $cache[$key] = $clean;
}

add_filter('pre_update_option_aes_global_footer_html', 'aes_refine_footer_markup');

/** Update only the requested section; preserve all other WordPress page edits. */
add_action('init', function () {
    if (get_option('aes_presentation_orange_v1')) return;
    $footer = aes_refine_footer_markup(get_option('aes_global_footer_html', ''));
    if ($footer) update_option('aes_global_footer_html', $footer, false);
    $ids = get_option('aes_page_ids', []);
    $home_id = intval($ids['home'] ?? get_option('page_on_front'));
    $home = get_post($home_id);
    if (!$home) return;
    $blocks = parse_blocks($home->post_content);
    $replacement = aes_resolve(file_get_contents(AES_DIR . '/templates/partials/work-with-us.html'));
    $changed = false;
    foreach ($blocks as &$block) {
        if (($block['blockName'] ?? '') !== 'aes/section') continue;
        $attrs = &$block['attrs'];
        $html = rawurldecode($attrs['html'] ?? '');
        if (preg_match('/\bid=["\']work-with-us["\']/i', $html)) {
            $attrs['html'] = rawurlencode($replacement);
            $attrs['title'] = 'Work With Us';
            $changed = true;
        }
        // The save hook reads these shared blocks; keep their canonical values.
        if (!empty($attrs['isGlobalFooter']) && $footer) $attrs['html'] = rawurlencode($footer);
        if (!empty($attrs['isGlobalHeader'])) {
            $header = get_option('aes_global_header_html', '');
            if ($header) $attrs['html'] = rawurlencode($header);
        }
        unset($attrs);
    }
    unset($block);
    if ($changed) {
        $result = wp_update_post(['ID' => $home_id, 'post_content' => wp_slash(serialize_blocks($blocks))], true);
        if (is_wp_error($result)) return;
    }
    update_option('aes_presentation_orange_v1', 1, false);
}, 30);

/** Add the careers visual without replacing editable copy or other home blocks. */
add_action('init', function () {
    if (get_option('aes_careers_visual_v1')) return;
    $ids = get_option('aes_page_ids', []);
    $home = get_post(intval($ids['home'] ?? get_option('page_on_front')));
    if (!$home) return;
    $partial = file_get_contents(AES_DIR . '/templates/partials/work-with-us.html');
    if (!preg_match('/<div class="aes-careers-invitation__visual".*?<\/div>/s', $partial, $match)) return;
    $visual = aes_resolve($match[0]);
    $footer = aes_refine_footer_markup(get_option('aes_global_footer_html', ''));
    if ($footer) update_option('aes_global_footer_html', $footer, false);
    $blocks = parse_blocks($home->post_content);
    $changed = false;
    foreach ($blocks as &$block) {
        if (($block['blockName'] ?? '') !== 'aes/section') continue;
        $attrs = &$block['attrs'];
        $html = rawurldecode($attrs['html'] ?? '');
        if (preg_match('/\bid=["\']work-with-us["\']/i', $html) && strpos($html, 'aes-careers-invitation__visual') === false) {
            $html = preg_replace_callback('/<section\b[^>]*\bid=["\']work-with-us["\'][^>]*>/i', function ($match) use ($visual) {
                return $match[0] . "\n" . $visual;
            }, $html, 1);
            $attrs['html'] = rawurlencode($html);
            $changed = true;
        }
        if (!empty($attrs['isGlobalFooter']) && $footer) $attrs['html'] = rawurlencode($footer);
        if (!empty($attrs['isGlobalHeader']) && get_option('aes_global_header_html')) $attrs['html'] = rawurlencode(get_option('aes_global_header_html'));
        unset($attrs);
    }
    unset($block);
    if ($changed) {
        $result = wp_update_post(['ID' => $home->ID, 'post_content' => wp_slash(serialize_blocks($blocks))], true);
        if (is_wp_error($result)) return;
    }
    update_option('aes_careers_visual_v1', 1, false);
}, 31);

// Editors on other pages receive the current shared footer rather than an old copy.
add_filter('rest_prepare_page', function ($response, $post, $request) {
    if ($request->get_param('context') !== 'edit') return $response;
    $data = $response->get_data();
    if (empty($data['content']['raw'])) return $response;
    $footer = get_option('aes_global_footer_html', '');
    if (!$footer) return $response;
    $blocks = parse_blocks($data['content']['raw']);
    foreach ($blocks as &$block) {
        if (($block['blockName'] ?? '') === 'aes/section' && !empty($block['attrs']['isGlobalFooter'])) {
            $block['attrs']['html'] = rawurlencode($footer);
        }
    }
    unset($block);
    $data['content']['raw'] = serialize_blocks($blocks);
    $response->set_data($data);
    return $response;
}, 15, 3);
