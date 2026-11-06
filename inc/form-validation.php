<?php
if (!defined('ABSPATH')) exit;

function aes_form_rules($form) {
    $rules = [];
    foreach (aes_data('forms')[$form]['fields'] ?? [] as $field) {
        $name = sanitize_key($field['name']);
        $label = $field['label'];
        $kind = $field['type'];
        if ($kind === 'text' && preg_match('/email\s*(?:&|and|\/)\s*phone/i', $label)) $kind = 'contact';
        elseif ($kind === 'text' && preg_match('/\bname\b/i', $label) && !preg_match('/company|organization|manufacturer|vendor/i', $label)) $kind = 'person';
        if ($kind === 'number') $kind = str_contains(strtolower($name . $label), 'experience') ? 'experience' : 'challenge';
        $rules[$name] = ['label' => $label, 'kind' => $kind, 'required' => !empty($field['required'])];
    }
    return $rules;
}

/** Read allowed choices and required uploads from the saved, admin-editable form. */
function aes_form_constraints($form) {
    static $cache = [];
    if (isset($cache[$form])) return $cache[$form];
    $layout = $form === 'careers-apply' ? 'careers' : preg_replace('/-\d+$/', '', $form);
    if ($form === 'contact-us-inquiry') $layout = 'contact-us';
    $ids = (array) get_option('aes_page_ids', []);
    $post_id = (int) ($ids[$layout] ?? 0);
    $html = '';
    $collect = function ($blocks) use (&$collect, &$html) {
        foreach ($blocks as $block) {
            $html .= isset($block['attrs']['html']) ? rawurldecode($block['attrs']['html']) : ($block['innerHTML'] ?? '');
            if (!empty($block['innerBlocks'])) $collect($block['innerBlocks']);
        }
    };
    if ($post_id) $collect(parse_blocks(get_post_field('post_content', $post_id)));
    if (!str_contains($html, 'data-aes-form="' . $form . '"')) $html .= aes_get_resolved_template_html($layout, $post_id);
    $html = str_replace('@@JOB_OPTIONS@@', aes_job_options(), $html);
    $doc = new DOMDocument();
    $previous = libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="UTF-8">' . $html);
    libxml_clear_errors(); libxml_use_internal_errors($previous);
    $xpath = new DOMXPath($doc);
    $node = $xpath->query('//form[@data-aes-form="' . $form . '"]')->item(0);
    $constraints = ['choices' => [], 'required_files' => []];
    if ($node) foreach ($xpath->query('.//input|.//select', $node) as $input) {
        $name = sanitize_key($input->getAttribute('name') ?: $input->getAttribute('id'));
        if ($input->nodeName === 'select') {
            foreach ($input->getElementsByTagName('option') as $option) {
                $value = $option->hasAttribute('value') ? $option->getAttribute('value') : $option->textContent;
                if ($value !== '') $constraints['choices'][$name][] = trim($value);
            }
        }
        if ($input->getAttribute('type') === 'file' && $input->hasAttribute('required')) $constraints['required_files'][] = $name;
    }
    if ($form === 'we-hear-you-0') {
        $config = [];
        $root = $xpath->query('//*[@data-support-config]')->item(0);
        if ($root) $config = json_decode($root->getAttribute('data-support-config'), true) ?: [];
        foreach (aes_data('support-requests') as $key => $reason) foreach ($reason['fields'] as $field) {
            if ($field['type'] !== 'select') continue;
            $saved = array_values(array_filter($config[$key]['fields'] ?? [], fn($item) => ($item['id'] ?? '') === $field['id']));
            $constraints['choices'][sanitize_key($field['id'])] = $saved[0]['options'] ?? $field['options'];
        }
    }
    return $cache[$form] = $constraints;
}

function aes_validate_fields($form, $map, $math_token = '') {
    $errors = [];
    $constraints = aes_form_constraints($form);
    foreach (aes_form_rules($form) as $name => $rule) {
        $value = trim($map[$name] ?? '');
        $label = trim($rule['label'], " *\t\n\r");
        if ($rule['kind'] === 'file') continue;
        if ($rule['required'] && $value === '') { $errors[$name] = 'Please complete: ' . $label . '.'; continue; }
        if ($value === '') continue;
        $message = '';
        if ($rule['kind'] === 'person' && (!preg_match('/^[\p{L}\p{M}][\p{L}\p{M} .\x{2019}\x{0027}-]*$/u', $value) || preg_match_all('/\p{L}/u', $value) < 2)) $message = 'Use letters, spaces, apostrophes or hyphens for your name; numbers are not allowed.';
        if ($rule['kind'] === 'tel' && !preg_match('/^\+?[0-9]{10,15}$/', preg_replace('/[\s().-]/', '', $value))) $message = 'Enter a phone number with 10–15 digits, optionally starting with +. Letters are not allowed.';
        if ($rule['kind'] === 'email' && (!is_email($value) || !preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $value))) $message = 'Enter a valid email address, for example name@company.com.';
        if ($rule['kind'] === 'contact') {
            preg_match('/[^\s\/]+@[^\s\/]+\.[^\s\/]+/', $value, $match);
            $rest = trim(str_replace($match[0] ?? '', '', $value), " \t/|,;");
            if (empty($match[0]) || !is_email($match[0]) || !preg_match('/^\+?[0-9]{10,15}$/', preg_replace('/[\s().-]/', '', $rest))) $message = 'Include both a valid email address and a phone number. Phone numbers cannot contain letters.';
        }
        if ($rule['kind'] === 'experience' && (!preg_match('/^\d+(?:\.\d{1,2})?$/', $value) || (float) $value < 0 || (float) $value > 50)) $message = 'Enter experience between 0 and 50 years; decimals are allowed.';
        if ($rule['kind'] === 'challenge' && (!ctype_digit($value) || !wp_verify_nonce($math_token, 'aes_math_' . $form . '_' . (int) $value))) $message = 'The human-verification answer is incorrect. Please try again.';
        if ($rule['kind'] === 'date') {
            $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value);
            if (!$date || $date->format('Y-m-d') !== $value || $value > current_time('Y-m-d')) $message = 'Enter a valid date that is not in the future.';
        }
        if (isset($constraints['choices'][$name]) && !($name === 'candidaterole' && !empty($map['jobid'])) && !in_array($value, $constraints['choices'][$name], true)) $message = 'Choose a valid option for ' . $label . '.';
        if (mb_strlen($value) > ($rule['kind'] === 'email' ? 254 : (in_array($rule['kind'], ['person', 'tel'], true) ? 100 : 5000))) $message = $label . ' is too long.';
        if ($message) $errors[$name] = $message;
    }
    if (!empty($map['jobid'])) {
        $job = get_post(absint($map['jobid']));
        if (!$job || $job->post_type !== 'aes_job' || $job->post_status !== 'publish') $errors['jobid'] = 'This opening is no longer accepting applications. Choose another published role.';
        elseif (($map['candidaterole'] ?? '') !== html_entity_decode($job->post_title, ENT_QUOTES | ENT_HTML5, 'UTF-8')) $errors['candidaterole'] = 'The selected role does not match this application.';
    }
    return $errors;
}

add_action('wp_enqueue_scripts', function () {
    $config = [];
    foreach (aes_data('forms') as $form => $_) {
        $rules = aes_form_rules($form);
        $config[$form] = ['rules' => $rules];
        foreach ($rules as $name => $rule) if ($rule['kind'] === 'challenge') {
            $a = random_int(2, 9); $b = random_int(2, 9);
            $config[$form]['challenge'] = ['name' => $name, 'question' => 'Human verification: ' . $a . ' + ' . $b . ' =', 'token' => wp_create_nonce('aes_math_' . $form . '_' . ($a + $b))];
        }
    }
    wp_localize_script('aes-forms', 'AES_VALIDATION', $config);
}, 20);
