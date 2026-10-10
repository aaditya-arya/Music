<?php
if (!defined('ABSPATH')) exit;

/** Preserve the application controls while grouping them into a clearer form. */
function aes_prepare_career_form($html) {
    if (strpos($html, 'aes-designed-form') !== false) return $html;
    $doc = new DOMDocument('1.0', 'UTF-8');
    $previous = libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="UTF-8">' . $html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors(); libxml_use_internal_errors($previous);
    $form = $doc->getElementsByTagName('form')->item(0);
    if (!$form) return $html;
    $xpath = new DOMXPath($doc);
    $fields = [];
    foreach ($xpath->query('.//label/..', $form) as $wrapper) {
        $control = $xpath->query('.//input|.//select|.//textarea', $wrapper)->item(0);
        if (!$control) continue;
        $id = $control->getAttribute('id') ?: $control->getAttribute('name');
        $control->setAttribute('id', $id);
        $label = $xpath->query('./label', $wrapper)->item(0);
        $label->setAttribute('for', $id);
        $control->removeAttribute('class'); $label->removeAttribute('class');
        if ($control->getAttribute('type') === 'file') {
            $control->setAttribute('accept', '.pdf,.jpg,.jpeg,.png');
            $wrapper->setAttribute('class', 'aes-upload-field');
            foreach ($xpath->query('.//span', $wrapper) as $hint) $hint->nodeValue = 'PDF, JPG or PNG · Up to 2 MB';
        }
        $fields[$id] = $wrapper->cloneNode(true);
    }
    $submit = $xpath->query('.//button[@type="submit"]', $form)->item(0);
    if ($submit) $submit = $submit->cloneNode(true);
    $form->setAttribute('class', 'aes-designed-form');
    $groups = [
        ['About you', ['candidateName', 'candidateEmail', 'candidatePhone', 'candidateLocation']],
        ['Your expertise', ['candidateExperience', 'eduQualification', 'profQualification', 'candidateStream']],
        ['Your documents', ['attachment_cv', 'attachment_cert', 'candidateSummary']],
    ];
    while ($form->firstChild) $form->removeChild($form->firstChild);
    $role = $doc->createElement('div');
    $label = $doc->createElement('label', 'Role of interest'); $label->setAttribute('for', 'appPosition');
    $select = $doc->createElement('select'); $select->setAttribute('name', 'candidateRole'); $select->setAttribute('id', 'appPosition');
    $select->setAttribute('data-aes-label', 'Role of interest'); $select->appendChild($doc->createTextNode('@@JOB_OPTIONS@@'));
    $role->appendChild($label); $role->appendChild($select); $form->appendChild($role);
    foreach ($groups as $index => $group) {
        $fieldset = $doc->createElement('fieldset');
        $legend = $doc->createElement('legend');
        $step = $doc->createElement('span', '0' . ($index + 1)); $legend->appendChild($step);
        $legend->appendChild($doc->createTextNode(' ' . $group[0])); $fieldset->appendChild($legend);
        $grid = $doc->createElement('div'); $grid->setAttribute('class', 'aes-field-grid');
        foreach ($group[1] as $id) {
            if (empty($fields[$id])) continue;
            $grid->appendChild($fields[$id]); unset($fields[$id]);
        }
        if ($index === 2) foreach ($fields as $field) $grid->appendChild($field);
        $fieldset->appendChild($grid); $form->appendChild($fieldset);
    }
    foreach (['candidateName' => 'name', 'candidateEmail' => 'email', 'candidatePhone' => 'tel', 'candidateLocation' => 'address-level2'] as $id => $value) {
        $control = $xpath->query('.//*[@id="' . $id . '"]', $form)->item(0);
        if ($control) $control->setAttribute('autocomplete', $value);
    }
    if ($submit) {
        $submit->setAttribute('class', 'btn-premium-orange aes-action');
        $submit->nodeValue = 'Submit application';
        $row = $doc->createElement('div'); $row->setAttribute('class', 'aes-form-submit');
        $row->appendChild($doc->createElement('p', 'Share your details for review by the AES talent team.'));
        $row->appendChild($submit); $form->appendChild($row);
    }
    return $doc->saveHTML($form);
}

function aes_prepare_public_markup($html, $key) {
    if ($key !== 'careers') return $html;
    $html = aes_simplify_career_culture($html);
    return preg_replace_callback('/<form\b[^>]*id="careerApplyForm"[^>]*>.*?<\/form>/s', function ($match) {
        return aes_prepare_career_form($match[0]);
    }, $html);
}

/** Replace these two authorized page designs once, retaining existing application fields. */
add_action('init', function () {
    if (get_option('aes_public_pages_v1')) return;
    $ids = (array) get_option('aes_page_ids', []);
    $footer = aes_refine_footer_markup(get_option('aes_global_footer_html', ''));
    if ($footer) update_option('aes_global_footer_html', $footer, false);
    foreach (['contact-us', 'careers'] as $key) {
        $post = get_post($ids[$key] ?? 0);
        if (!$post) continue;
        $old = parse_blocks($post->post_content);
        $template = aes_get_resolved_template_html($key, $post->ID);
        if ($key === 'careers') {
            foreach ($old as $block) {
                $html = rawurldecode($block['attrs']['html'] ?? '');
                if (preg_match('/<form\b[^>]*id="careerApplyForm"[^>]*>.*?<\/form>/s', $html, $match)) {
                    $form = aes_prepare_career_form($match[0]);
                    $template = preg_replace_callback('/<form\b[^>]*id="careerApplyForm"[^>]*>.*?<\/form>/s', function () use ($form) { return $form; }, $template);
                    break;
                }
            }
        }
        $sections = aes_split_template_parts($template)['sections'];
        $replacement = [];
        foreach ($old as $block) if (!empty($block['attrs']['isGlobalHeader'])) $replacement[] = $block;
        foreach ($sections as $i => $html) {
            $replacement[] = ['blockName' => 'aes/section', 'attrs' => ['sectionId' => $key . '-sec-' . ($i + 1), 'title' => aes_detect_section_title($html, $i + 1), 'html' => rawurlencode($html)], 'innerBlocks' => [], 'innerHTML' => '', 'innerContent' => []];
        }
        foreach ($old as $block) if (!empty($block['attrs']['isGlobalFooter'])) {
            if ($footer) $block['attrs']['html'] = rawurlencode($footer);
            $replacement[] = $block;
        }
        foreach ($replacement as &$block) if (!empty($block['attrs']['isGlobalHeader']) && get_option('aes_global_header_html')) $block['attrs']['html'] = rawurlencode(get_option('aes_global_header_html'));
        unset($block);
        $result = wp_update_post(['ID' => $post->ID, 'post_content' => wp_slash(serialize_blocks($replacement))], true);
        if (is_wp_error($result)) return;
    }
    update_option('aes_public_pages_v1', 1, false);
}, 33);
