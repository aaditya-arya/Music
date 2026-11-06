<?php
if (!defined('ABSPATH')) exit;

add_filter('register_post_type_args', function ($args, $type) {
    if ($type === 'aes_job') {
        $args['public'] = true;
        $args['publicly_queryable'] = true;
        $args['exclude_from_search'] = false;
        $args['has_archive'] = false;
        $args['rewrite'] = ['slug' => 'openings', 'with_front' => false];
    }
    return $args;
}, 10, 2);

function aes_openings_url() {
    $id = (int) get_option('aes_openings_page_id');
    return $id && get_post_status($id) === 'publish' ? get_permalink($id) : home_url('/openings/');
}

add_filter('template_include', function ($template) {
    $id = (int) get_option('aes_openings_page_id');
    return $id && is_page($id) ? AES_DIR . '/page-openings.php' : $template;
});

add_action('init', function () {
    if (get_option('aes_openings_routes_v1')) return;
    $page = get_page_by_path('openings');
    $id = $page ? $page->ID : wp_insert_post(['post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Job Openings', 'post_name' => 'openings', 'post_content' => 'Explore current opportunities at Akshar Engineering Services. Find a role that matches your expertise.']);
    if (!$id || is_wp_error($id)) return;
    update_option('aes_openings_page_id', $id, false);
    update_option('aes_openings_routes_v1', 1, false);
    flush_rewrite_rules(false);
}, 30);

function aes_job_icon($kind) {
    $paths = [
        'experience' => '<circle cx="12" cy="7" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3M8 16l4 3 4-3M12 19v2"/>',
        'location' => '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
        'type' => '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M8 7v14M16 7v14"/>',
        'arrow' => '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    ];
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' . ($paths[$kind] ?? $paths['arrow']) . '</svg>';
}

function aes_job_department($job) {
    $details = (array) get_post_meta($job->ID, '_aes_job', true);
    if (!empty($details['department'])) return $details['department'];
    if (preg_match('/Welding|CSWIP|AWS/i', $job->post_title)) return 'Welding Engineering';
    if (preg_match('/NDT|ASNT/i', $job->post_title)) return 'Non-Destructive Testing';
    if (preg_match('/Expediting|Vendor/i', $job->post_title)) return 'Supply Chain & Vendor Surveillance';
    return 'Inspection & Quality Assurance';
}

function aes_job_metadata($details) {
    $html = '<ul class="aes-job-meta" aria-label="Role information">';
    foreach (['experience' => 'Experience', 'location' => 'Location', 'type' => 'Employment type'] as $key => $label) {
        if (empty($details[$key])) continue;
        $html .= '<li>' . aes_job_icon($key) . '<span><span class="screen-reader-text">' . esc_html($label) . ': </span>' . esc_html($details[$key]) . '</span></li>';
    }
    return $html . '</ul>';
}

function aes_render_openings($filters = false) {
    $jobs = get_posts(['post_type' => 'aes_job', 'post_status' => 'publish', 'numberposts' => -1, 'orderby' => 'title', 'order' => 'ASC']);
    $groups = [];
    foreach ($jobs as $job) $groups[aes_job_department($job)][] = $job;
    ksort($groups, SORT_NATURAL | SORT_FLAG_CASE);
    $html = '<div class="aes-openings-directory" data-openings-directory>';
    if (!$filters) $html .= '<p class="aes-openings-all"><a class="aes-inline-link" href="' . esc_url(aes_openings_url()) . '">Explore all openings ' . aes_job_icon('arrow') . '</a></p>';
    if ($filters && $jobs) {
        $html .= '<form class="aes-openings-filters" role="search" aria-label="Find a job" data-openings-filters><div><label for="opening-search">Find your role</label><input id="opening-search" type="search" placeholder="Job title, skill or location" data-opening-search></div><div><label for="opening-department">Department</label><select id="opening-department" data-opening-department><option value="">All departments</option>';
        foreach (array_keys($groups) as $group) $html .= '<option>' . esc_html($group) . '</option>';
        $html .= '</select></div><button type="reset" class="aes-action">Clear filters</button></form><p class="aes-openings-count" role="status" data-opening-count>' . count($jobs) . ' open roles</p>';
    }
    foreach ($groups as $department => $items) {
        $html .= '<section class="aes-opening-group" data-opening-group><div class="aes-opening-group__heading"><h3>' . esc_html($department) . '</h3><span data-group-count>' . count($items) . ' ' . (count($items) === 1 ? 'job' : 'jobs') . '</span></div><div class="aes-opening-group__grid">';
        foreach ($items as $job) {
            $details = (array) get_post_meta($job->ID, '_aes_job', true);
            $title = html_entity_decode($job->post_title, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $search = strtolower($title . ' ' . implode(' ', array_filter($details, 'is_scalar')));
            $url = get_permalink($job);
            $html .= '<article class="aes-opening-card" data-aes-job-card="' . intval($job->ID) . '" data-opening-search-text="' . esc_attr($search) . '" data-department="' . esc_attr($department) . '"><div><h4><a href="' . esc_url($url) . '">' . esc_html($title) . '</a></h4>' . aes_job_metadata($details) . '</div><a class="aes-action aes-opening-apply" href="' . esc_url($url) . '" aria-label="Apply for ' . esc_attr($title) . '">Apply ' . aes_job_icon('arrow') . '</a></article>';
        }
        $html .= '</div></section>';
    }
    if (!$jobs) $html .= '<p class="aes-openings-empty">There are no open roles right now. You can still send a general application through Careers.</p>';
    $html .= '<p class="aes-openings-empty" data-opening-empty hidden>No roles match your search. Try another keyword or clear the filters.</p></div>';
    return $html;
}

function aes_job_application($job) {
    $source = file_get_contents(AES_DIR . '/templates/partials/career-application-form.html');
    $ids = (array) get_option('aes_page_ids', []);
    $find_form = function ($blocks) use (&$find_form) {
        foreach ($blocks as $block) {
            $html = rawurldecode($block['attrs']['html'] ?? '');
            if (preg_match('/<form\b[^>]*\bid=["\']careerApplyForm["\'][^>]*>.*?<\/form>/s', $html, $match)) return $match[0];
            if (!empty($block['innerBlocks'])) { $nested = $find_form($block['innerBlocks']); if ($nested) return $nested; }
        }
        return '';
    };
    $saved = $find_form(parse_blocks(get_post_field('post_content', (int) ($ids['careers'] ?? 0))));
    if ($saved) $source = $saved;
    $form = aes_prepare_career_form($source);
    $form = str_replace(['@@AJAX@@', '@@JOB_OPTIONS@@'], [esc_url(admin_url('admin-ajax.php')), aes_job_options()], $form);
    $doc = new DOMDocument(); $previous = libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="UTF-8">' . $form); libxml_clear_errors(); libxml_use_internal_errors($previous);
    $xpath = new DOMXPath($doc); $root = $doc->getElementsByTagName('form')->item(0);
    $select = $xpath->query('//*[@id="appPosition"]')->item(0);
    $title = html_entity_decode($job->post_title, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    if ($select) {
        while ($select->firstChild) $select->removeChild($select->firstChild);
        $option = $doc->createElement('option'); $option->appendChild($doc->createTextNode($title)); $option->setAttribute('value', $title); $option->setAttribute('selected', 'selected'); $select->appendChild($option);
    }
    $id = $doc->createElement('input'); $id->setAttribute('type', 'hidden'); $id->setAttribute('name', 'jobId'); $id->setAttribute('value', $job->ID); $root->appendChild($id);
    return $doc->saveHTML($root);
}

function aes_job_detail_section($heading, $text, $fallback = '') {
    $text = trim($text ?: $fallback);
    $html = '<section class="aes-role-section"><h2>' . esc_html($heading) . '</h2>';
    if (!$text) return $html . '<p>Not specified for this opening.</p></section>';
    $html .= '<ul>';
    foreach (preg_split('/\r\n|\r|\n/', $text) as $line) if (trim($line)) $html .= '<li>' . esc_html(trim($line, " \t-•")) . '</li>';
    return $html . '</ul></section>';
}

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('aes-jobs', get_template_directory_uri() . '/assets/jobs.css', ['aes-public-pages'], filemtime(AES_DIR . '/assets/jobs.css'));
    wp_enqueue_script('aes-openings', get_template_directory_uri() . '/assets/openings.js', ['aes-site'], filemtime(AES_DIR . '/assets/openings.js'), true);
});
