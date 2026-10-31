<?php
if (!defined('ABSPATH')) exit;

function aes_site_settings() {
    return wp_parse_args((array) get_option('aes_site_settings', []), [
        'intro_enabled' => 1, 'intro_seconds' => 5, 'brochure_url' => '',
        'intro_name' => 'Akshar Engineering', 'intro_caption' => 'Services Pvt. Ltd.',
        'intro_promise' => 'TRUSTED INSPECTION - SAFER TOMORROW', 'intro_logo' => '',
    ]);
}

/** Only fields rendered outside the visual blocks belong in the supplemental editor. */
function aes_page_supplemental_fields($post_id) {
    $key = get_post_meta($post_id, '_aes_layout', true);
    if (!$key || !isset(aes_data('manifest')[$key])) return [];
    $file = aes_get_template_file($key);
    if (!$file) return [];
    preg_match_all('/@@JSFIELD:([a-zA-Z0-9_-]+)@@/', file_get_contents($file), $matches);
    $defs = aes_fields($key);
    $result = [];
    foreach (array_unique(array_merge(['description'], $matches[1])) as $name) {
        if (!isset($defs[$name])) continue;
        $result[$name] = $defs[$name];
        if (preg_match('/\.(?:jpg|jpeg|png|webp|svg)$/i', $defs[$name]['default'])) $result[$name]['type'] = 'image';
    }
    return $result;
}

// Native REST metadata participates in the page Save, preview and revision workflow.
add_action('init', function () {
    register_post_meta('page', '_aes_values', [
        'type' => 'object', 'single' => true, 'revisions_enabled' => true,
        'show_in_rest' => ['schema' => ['type' => 'object', 'context' => ['edit'], 'additionalProperties' => ['type' => 'string']]],
        'auth_callback' => function ($allowed, $key, $post_id) { return current_user_can('edit_post', (int) $post_id); },
        'sanitize_callback' => function ($value) {
            $out = [];
            foreach ((array) $value as $key => $item) if (is_scalar($item)) $out[$key] = sanitize_textarea_field((string) $item);
            return $out;
        },
    ]);
});

add_action('admin_post_aes_site_settings', function () {
    if (!current_user_can('manage_options')) wp_die('Not allowed', 403);
    check_admin_referer('aes_site_settings');
    $settings = aes_site_settings();
    $settings['intro_enabled'] = empty($_POST['intro_enabled']) ? 0 : 1;
    $settings['intro_seconds'] = max(1, min(10, absint($_POST['intro_seconds'] ?? 5)));
    foreach (['intro_name', 'intro_caption', 'intro_promise'] as $key) $settings[$key] = sanitize_text_field(wp_unslash($_POST[$key] ?? ''));
    foreach (['brochure_url', 'intro_logo'] as $key) {
        $raw = trim(wp_unslash($_POST[$key] ?? ''));
        $url = esc_url_raw($raw, ['http', 'https']);
        if ($raw !== '' && (!$url || !preg_match('~^https?://[^/]+/~', $url))) wp_die('Enter a complete HTTP or HTTPS URL. No settings were changed.', 400);
        if ($key === 'brochure_url' && $url && strtolower(pathinfo(parse_url($url, PHP_URL_PATH) ?: '', PATHINFO_EXTENSION)) !== 'pdf') wp_die('The brochure must be a PDF file. No settings were changed.', 400);
        $settings[$key] = $url;
    }
    update_option('aes_site_settings', $settings, false);
    wp_safe_redirect(admin_url('admin.php?page=aes-cms&saved=1#site-behavior')); exit;
});

function aes_site_controls_form() {
    $settings = aes_site_settings();
    ?>
    <section class="aes-dashboard-panel" id="site-behavior">
      <h2>Welcome screen and company brochure</h2>
      <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <?php wp_nonce_field('aes_site_settings'); ?><input type="hidden" name="action" value="aes_site_settings">
        <p><label><input type="checkbox" name="intro_enabled" value="1" <?php checked($settings['intro_enabled'], 1); ?>> Show the welcome screen to first-time visitors</label></p>
        <p><label>Welcome screen duration (1-10 seconds) <input type="number" min="1" max="10" name="intro_seconds" value="<?php echo esc_attr($settings['intro_seconds']); ?>"></label></p>
        <?php foreach (['intro_name' => 'Company name', 'intro_caption' => 'Company caption', 'intro_promise' => 'Welcome tagline'] as $key => $label): ?>
          <p><label><?php echo esc_html($label); ?><input class="widefat" type="text" name="<?php echo esc_attr($key); ?>" value="<?php echo esc_attr($settings[$key]); ?>"></label></p>
        <?php endforeach; ?>
        <p><label>Welcome logo URL <input class="widefat" type="url" name="intro_logo" value="<?php echo esc_attr($settings['intro_logo']); ?>"></label><button type="button" class="button aes-setting-media" data-field="intro_logo" data-media-type="image">Choose logo</button></p>
        <p><label>Company brochure PDF URL <input class="widefat" type="url" name="brochure_url" value="<?php echo esc_attr($settings['brochure_url']); ?>"></label><button type="button" class="button aes-setting-media" data-field="brochure_url" data-media-type="application/pdf">Choose PDF</button></p>
        <p class="description">Blank logo/PDF URLs retain the bundled files. Reduced-motion visitors skip the welcome animation. Manage the homepage videos in the Home page's numbered playlist.</p>
        <?php submit_button('Save website settings', 'secondary'); ?>
      </form>
    </section>
    <?php
}
