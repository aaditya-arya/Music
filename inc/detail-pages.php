<?php
if (!defined('ABSPATH')) exit;

/** An editable, semantic process diagram; each service has its own example workflow. */
function aes_service_process_map($key) {
    $flows = [
        'service-tpi' => ['Review the scope', 'Verify materials', 'Witness key tests', 'Report & release'],
        'service-vendor-assessment' => ['Define audit criteria', 'Assess the supplier', 'Review findings', 'Track improvements'],
        'service-project-shutdown-qa' => ['Plan the turnaround', 'Inspect critical assets', 'Verify repairs', 'Document handover'],
        'service-qa-qc-documentation' => ['Agree the document list', 'Collect quality records', 'Verify traceability', 'Compile the dossier'],
        'service-pre-shipment-inspection' => ['Review the order', 'Inspect finished goods', 'Verify packing', 'Issue the report'],
        'service-welding-engineering' => ['Review the weld plan', 'Qualify procedures', 'Monitor weld quality', 'Verify test records'],
        'service-ndt-inspection' => ['Select test methods', 'Prepare & calibrate', 'Examine the component', 'Evaluate & report'],
        'service-expediting' => ['Set project milestones', 'Check production progress', 'Resolve delivery risks', 'Report the status'],
        'service-design-examination' => ['Review design inputs', 'Check calculations', 'Assess code compliance', 'Record the findings'],
        'service-international-sourcing' => ['Define requirements', 'Assess source capability', 'Verify order quality', 'Support dispatch'],
        'service-performance-hydro-tests' => ['Review the test plan', 'Verify test readiness', 'Witness performance', 'Record the results'],
        'service-process-qualification' => ['Define process criteria', 'Review procedures', 'Witness qualification', 'Verify the evidence'],
        'service-api-tank-inspection' => ['Review tank records', 'Inspect tank integrity', 'Evaluate the findings', 'Recommend next steps'],
        'service-owners-engineer' => ['Align project goals', 'Review engineering', 'Monitor execution', 'Verify handover'],
        'service-process-piping' => ['Review piping plans', 'Verify fabrication', 'Witness pressure tests', 'Review final records'],
        'service-training' => ['Identify skill needs', 'Learn the principles', 'Practise the methods', 'Assess understanding'],
    ];
    $titles = $flows[$key] ?? ['Agree the scope', 'Review the evidence', 'Verify the work', 'Report the findings'];
    $descriptions = $key === 'service-training'
        ? ['Align the programme with your team and its technical responsibilities.', 'Build understanding through guided explanations and code examples.', 'Apply the learning in practical exercises and demonstrations.', 'Review progress, record results and identify the next learning steps.']
        : ['Agree requirements, applicable codes and the checks needed for the assignment.', 'Check relevant documents, materials and preparation against the agreed scope.', 'Carry out the planned checks and record observations with supporting evidence.', 'Present findings, flag any deviations and define the actions needed for closure.'];
    $icons = [
        '<path d="M9 5H5v16h14V5h-4M9 3h6v4H9zM8 12h8M8 16h5"/>',
        '<path d="m12 3 9 5-9 5-9-5 9-5ZM3 8v9l9 5 9-5V8M12 13v9"/>',
        '<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 6 6M7 10l2 2 4-4"/>',
        '<path d="M14 2H5v20h14V7l-5-5ZM14 2v5h5M8 12h8M8 16h5"/>',
    ];
    $html = '<ol class="aes-process-map" aria-label="Typical service workflow">';
    foreach ($titles as $index => $title) {
        $html .= '<li class="aes-process-step"><div class="aes-process-step__node"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $icons[$index] . '</svg><span class="aes-process-step__number">0' . ($index + 1) . '</span></div><h3>' . esc_html($title) . '</h3><p>' . esc_html($descriptions[$index]) . '</p></li>';
    }
    return $html . '</ol>';
}

/** Refine only a detail page's hero/main block, keeping the saved copy and image. */
function aes_refine_detail_block($html, $key) {
    $service = strpos($key, 'service-') === 0;
    if ((!$service && $key !== 'about') || !preg_match('/<(?:h1|main)\b/i', $html)) return $html;
    $doc = new DOMDocument('1.0', 'UTF-8');
    $previous = libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="UTF-8"><div id="aes-detail-root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors();
    libxml_use_internal_errors($previous);
    $xpath = new DOMXPath($doc);
    $root = $doc->getElementById('aes-detail-root');
    if (!$root) return $html;
    $class = function ($node, $value) { $node->setAttribute('class', trim($node->getAttribute('class') . ' ' . $value)); };
    $heading = $xpath->query('.//h1', $root)->item(0);
    if ($heading && !$xpath->query('.//*[contains(@class,"aes-detail-hero")]', $root)->length) {
        $section = $heading;
        while ($section && $section->nodeName !== 'section') $section = $section->parentNode;
        $grid = $heading;
        while ($grid instanceof DOMElement && strpos($grid->getAttribute('class'), 'lg:grid-cols-12') === false) $grid = $grid->parentNode;
        if ($section && $grid instanceof DOMElement) {
            $columns = $xpath->query('./div', $grid);
            $copy = $columns->item(0);
            $image = $columns->length > 1 ? $xpath->query('.//img', $columns->item(1))->item(0) : null;
            $breadcrumb = $xpath->query('.//nav', $section)->item(0);
            if ($copy && $image) {
                // Remove the small badge and photo caption; the page title carries the hierarchy.
                $badge = $service ? $xpath->query('./span', $copy)->item(0) : $xpath->query('./div[1]/span', $copy)->item(0);
                if ($badge) $badge->parentNode->removeChild($badge);
                foreach (iterator_to_array($xpath->query('.//a', $copy)) as $link) {
                    if (strpos($link->getAttribute('href'), 'we-hear-you') !== false || strpos($link->textContent, 'We Hear You Support Hub') !== false) $link->parentNode->removeChild($link);
                }
                foreach (iterator_to_array($xpath->query('.//*[contains(@class,"heading-line-track")]', $copy)) as $line) $line->parentNode->removeChild($line);
                $hero = $doc->createElement('div');
                $hero->setAttribute('class', 'aes-detail-hero');
                $photo = $doc->createElement('div');
                $photo->setAttribute('class', 'aes-detail-hero__visual');
                $image->setAttribute('class', 'aes-detail-hero__photo');
                $image->setAttribute('fetchpriority', 'high');
                $image->setAttribute('decoding', 'async');
                $photo->appendChild($image);
                $hero->appendChild($photo);
                $inner = $doc->createElement('div');
                $inner->setAttribute('class', 'aes-detail-hero__inner');
                if ($breadcrumb) { $breadcrumb->setAttribute('class', 'aes-detail-hero__breadcrumb'); $inner->appendChild($breadcrumb); }
                $copy->setAttribute('class', 'aes-detail-hero__copy');
                $inner->appendChild($copy);
                $hero->appendChild($inner);
                $grid->parentNode->removeChild($grid);
                if ($service) {
                    while ($section->firstChild) $section->removeChild($section->firstChild);
                    $section->setAttribute('class', 'aes-detail-banner');
                } else {
                    $class($section, 'aes-about-detail');
                }
                $section->insertBefore($hero, $section->firstChild);
            }
        }
    }
    if ($service) {
        foreach ($xpath->query('.//main', $root) as $main) {
            if (strpos($main->getAttribute('class'), 'aes-service-content') !== false) continue;
            $class($main, 'aes-service-content');
            foreach (iterator_to_array($xpath->query('.//*[@id="inquirySection"]', $main)) as $sidebar) $sidebar->parentNode->removeChild($sidebar);
            $layout = $xpath->query('./div', $main)->item(0);
            if ($layout) $layout->setAttribute('class', 'aes-service-layout');
            $content = $layout ? $xpath->query('./div', $layout)->item(0) : null;
            if ($content) $content->setAttribute('class', 'aes-service-sections');
            $overview = $xpath->query('.//section', $main)->item(0);
            if ($overview && !$xpath->query('.//*[contains(@class,"aes-process-map")]', $overview)->length) {
                $class($overview, 'aes-technical-overview');
                $map = new DOMDocument('1.0', 'UTF-8');
                $previous = libxml_use_internal_errors(true);
                $map->loadHTML('<?xml encoding="UTF-8">' . aes_service_process_map($key), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
                libxml_clear_errors(); libxml_use_internal_errors($previous);
                $node = $doc->importNode($map->getElementsByTagName('ol')->item(0), true);
                $intro = $xpath->query('./div[contains(@class,"prose")]', $overview)->item(0);
                $overview->insertBefore($node, $intro);
            }
        }
    }
    $result = '';
    foreach ($root->childNodes as $child) $result .= $doc->saveHTML($child);
    return preg_replace('/\bviewbox=/i', 'viewBox=', $result);
}

/** Save the refinements once, preserving every unrelated block and shared option. */
add_action('init', function () {
    if (get_option('aes_detail_pages_v1')) return;
    foreach ((array) get_option('aes_page_ids', []) as $key => $id) {
        if ($key !== 'about' && strpos($key, 'service-') !== 0) continue;
        $post = get_post($id);
        if (!$post) continue;
        $blocks = parse_blocks($post->post_content);
        $changed = false;
        foreach ($blocks as &$block) {
            if (($block['blockName'] ?? '') !== 'aes/section' || !empty($block['attrs']['isGlobalHeader']) || !empty($block['attrs']['isGlobalFooter'])) continue;
            $html = rawurldecode($block['attrs']['html'] ?? '');
            $refined = aes_refine_detail_block($html, $key);
            if ($refined !== $html) { $block['attrs']['html'] = rawurlencode($refined); $changed = true; }
        }
        unset($block);
        if ($changed) {
            // A page save must never restore an old copy of a shared header/footer.
            foreach ($blocks as &$block) {
                foreach (['isGlobalHeader' => 'aes_global_header_html', 'isGlobalFooter' => 'aes_global_footer_html'] as $flag => $option) {
                    if (!empty($block['attrs'][$flag]) && get_option($option)) $block['attrs']['html'] = rawurlencode(get_option($option));
                }
            }
            unset($block);
            $result = wp_update_post(['ID' => $id, 'post_content' => wp_slash(serialize_blocks($blocks))], true);
            if (is_wp_error($result)) return;
        }
    }
    update_option('aes_detail_pages_v1', 1, false);
}, 32);
