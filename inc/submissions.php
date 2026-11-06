<?php
if (!defined('ABSPATH')) exit;

add_action('wp_ajax_aes_submit', 'aes_submit');
add_action('wp_ajax_nopriv_aes_submit', 'aes_submit');

function aes_submit() {
    if (!check_ajax_referer('aes_submit', 'nonce', false)) {
        wp_send_json_error(['message' => 'This page has expired. Refresh and submit again.'], 403);
    }
    $form = sanitize_key(wp_unslash($_POST['form'] ?? ''));
    $form = ['inquirydesk' => 'contact-us-0', 'trainingregistration' => 'contact-us-1', 'certificateverification' => 'contact-us-2'][$form] ?? $form;
    $schema = aes_data('forms')[$form] ?? null;
    if (!$schema) {
        wp_send_json_error(['message' => 'Unknown form.'], 400);
    }
    if (!empty($_POST['website'])) {
        wp_send_json_error(['message' => 'Submission rejected.'], 400);
    }
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $rate = 'aes_rate_' . hash_hmac('sha256', $ip, wp_salt());
    $count = (int)get_transient($rate);
    if ($count >= 10) {
        wp_send_json_error(['message' => 'Too many submissions. Please try again in 15 minutes.'], 429);
    }
    $raw = json_decode(wp_unslash($_POST['fields'] ?? ''), true);
    if (!is_array($raw) || count($raw) > 60 || strlen(wp_unslash($_POST['fields'] ?? '')) > 60000) {
        wp_send_json_error(['message' => 'Invalid form data.'], 400);
    }
    $clean = [];
    $map = [];
    $email = '';
    $rules = aes_form_rules($form);
    foreach ($raw as $f) {
        if (!is_array($f) || !is_scalar($f['name'] ?? null) || !is_scalar($f['value'] ?? null)) wp_send_json_error(['message' => 'Invalid field data.'], 400);
        $name = sanitize_key($f['name'] ?? '');
        if ((!isset($rules[$name]) && $name !== 'jobid') || isset($map[$name])) wp_send_json_error(['message' => 'Unexpected or duplicate form field. Refresh the page and try again.'], 400);
        $value = trim(sanitize_textarea_field((string)($f['value'] ?? '')));
        $label = $name === 'jobid' ? 'Job reference' : $rules[$name]['label'];
        if (strlen($value) > 10000) {
            wp_send_json_error(['message' => 'One field is too long.'], 400);
        }
        $map[$name] = $value;
        if (($rules[$name]['kind'] ?? '') !== 'challenge' && ($rules[$name]['kind'] ?? '') !== 'hidden') $clean[] = ['name' => $name, 'label' => $label, 'value' => $value];
    }
    $errors = aes_validate_fields($form, $map, sanitize_text_field(wp_unslash($_POST['math_token'] ?? '')));
    if ($errors) wp_send_json_error(['message' => reset($errors), 'fields' => $errors], 400);
    foreach ($schema['fields'] as $d) {
        $v = $map[sanitize_key($d['name'])] ?? '';
        if ($d['required'] && $d['type'] !== 'file' && trim($v) === '') {
            wp_send_json_error(['message' => 'Please complete: ' . $d['label']], 400);
        }
        if ($d['type'] === 'email' && $v !== '') {
            if (!is_email($v)) {
                wp_send_json_error(['message' => 'Please enter a valid email address.'], 400);
            }
            $email = sanitize_email($v);
        }
    }
    if ($form === 'we-hear-you-0') {
        $reason = $map['reasondropdown'] ?? '';
        $required_by_reason = [
            'inquiry' => ['primaryService' => 'Primary service'],
            'feedback' => ['feedbackRating' => 'Overall service rating'],
            'complaint_appeal' => ['complaintReference' => 'Job / report reference', 'manufacturerName' => 'Manufacturer / vendor'],
            'doc_verify' => ['certificateNumber' => 'Document / certificate number', 'documentType' => 'Document type'],
        ];
        if (!isset($required_by_reason[$reason])) wp_send_json_error(['message' => 'Select a valid request type.'], 400);
        foreach ($required_by_reason[$reason] as $name => $label) {
            if (trim($map[sanitize_key($name)] ?? '') === '') wp_send_json_error(['message' => 'Please complete: ' . $label], 400);
        }
    }
    if (!$clean) {
        wp_send_json_error(['message' => 'Complete the form before submitting.'], 400);
    }
    $files = [];
    $total = 0;
    $uploaded = [];
    foreach ($_FILES as $field_name => $f) {
        if (is_array($f['name'] ?? null)) {
            wp_send_json_error(['message' => 'Invalid attachment.'], 400);
        }
        if (($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) continue;
        $field_name = sanitize_key($field_name);
        if (($rules[$field_name]['kind'] ?? '') !== 'file') wp_send_json_error(['message' => 'Unexpected attachment field. Refresh and try again.'], 400);
        if ($f['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($f['tmp_name'])) {
            wp_send_json_error(['message' => 'Attachment upload failed.'], 400);
        }
        $total += (int)$f['size'];
        if ($f['size'] > 2 * 1024 * 1024 || $total > 5 * 1024 * 1024) {
            wp_send_json_error(['message' => 'Each attachment must be under 2 MB; total under 5 MB.'], 400);
        }
        $name = sanitize_file_name($f['name']);
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        $bytes = file_get_contents($f['tmp_name']);
        $mime = '';
        if ($ext === 'pdf' && str_starts_with($bytes, '%PDF-')) {
            $mime = 'application/pdf';
        } elseif (in_array($ext, ['jpg', 'jpeg', 'png'], true)) {
            $im = @getimagesize($f['tmp_name']);
            if ($im && $im['mime'] === ($ext === 'png' ? 'image/png' : 'image/jpeg')) {
                $mime = $im['mime'];
            }
        }
        if (!$mime) {
            wp_send_json_error(['message' => 'Attachments must be PDF, JPG or PNG files.'], 400);
        }
        $uploaded[] = $field_name;
        $files[] = ['name' => $name, 'mime' => $mime, 'field' => $field_name, 'label' => $rules[$field_name]['label'], 'data' => base64_encode($bytes)];
    }
    foreach (aes_form_constraints($form)['required_files'] as $required_file) if (!in_array($required_file, $uploaded, true)) wp_send_json_error(['message' => 'Please attach: ' . ($rules[$required_file]['label'] ?? 'the required document')], 400);
    $id = wp_insert_post([
        'post_type' => 'aes_submission',
        'post_status' => 'private',
        'post_title' => $schema['title'] . ' — ' . current_time('Y-m-d H:i:s'),
        'meta_input' => [
            '_aes_details' => $clean,
            '_aes_form' => $form,
            '_aes_form_title' => $schema['title'] ?? 'General Form',
            '_aes_files' => $files,
            '_aes_ip' => $ip
        ]
    ], true);
    if (is_wp_error($id) || !$id) {
        wp_send_json_error(['message' => 'Your submission could not be saved. Please try again.'], 500);
    }
    set_transient($rate, $count + 1, 15 * MINUTE_IN_SECONDS);
    if (get_option('aes_email_enabled')) {
        $ok = wp_mail(get_option('admin_email'), 'New AES website submission #' . $id, "A new submission is saved in your WordPress dashboard.\n" . admin_url('admin.php?page=aes-submissions'));
        update_post_meta($id, '_aes_notification', $ok ? 'Accepted by mail system (delivery not confirmed)' : 'Mail system rejected notification');
    } else {
        update_post_meta($id, '_aes_notification', 'Disabled — submission saved in WordPress');
    }
    wp_send_json_success(['message' => 'Your submission has been saved. Reference: AES-' . $id . '.']);
}

// The admin inbox uses paginated queries and loads private attachments on demand.
require AES_DIR . '/inc/submission-inbox.php';
