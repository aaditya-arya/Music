<?php
if (!defined('ABSPATH')) exit;

function aes_policy_definitions() {
    return [
        'privacy-policy' => ['title' => 'Privacy Policy', 'topics' => ['Who manages this website and how to contact them', 'Information collected through inquiries, applications and uploaded documents', 'Why information is used, who can access it and how long it is retained', 'Cookies, analytics and any external services actually used', 'How visitors can ask questions or request changes to their information']],
        'terms-of-service' => ['title' => 'Terms of Service', 'topics' => ['Who provides the services and how clients can contact the company', 'How a scope, quotation and assignment are agreed', 'Client responsibilities and information needed for an assignment', 'How inspection reports and other deliverables may be used', 'Applicable commercial terms and how concerns are handled']],
        'impartiality-charter' => ['title' => 'Impartiality Charter', 'topics' => ['The company\'s approved commitment to impartial inspection', 'How conflicts of interest are identified and managed', 'Responsibilities, oversight and review of impartiality', 'How clients can raise an impartiality concern']],
        'quality-policy' => ['title' => 'Quality Policy', 'topics' => ['The company\'s approved quality commitments', 'Service competence, consistency and responsibilities', 'How feedback and continuous improvement are addressed', 'Approval, review date and the responsible contact']],
    ];
}

// Editorial starter pages are drafts; incomplete policies never appear as live documents.
add_action('init', function () {
    if (get_option('aes_policy_starters_v1')) return;
    $ids = (array) get_option('aes_policy_page_ids', []);
    foreach (aes_policy_definitions() as $key => $definition) {
        if (!empty($ids[$key]) && get_post($ids[$key])) continue;
        $existing = get_page_by_path($key);
        if ($existing) { $ids[$key] = $existing->ID; continue; }
        $content = '<!-- wp:paragraph --><p><strong>EDITORIAL STARTER — replace this guidance before publishing.</strong> This draft is a place to add the company-approved ' . esc_html(strtolower($definition['title'])) . '. It is not a statement of current policy.</p><!-- /wp:paragraph -->';
        $content .= '<!-- wp:heading --><h2 class="wp-block-heading">Content to add</h2><!-- /wp:heading -->';
        foreach ($definition['topics'] as $topic) {
            $content .= '<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">' . esc_html($topic) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>[Replace with the approved company wording.]</p><!-- /wp:paragraph -->';
        }
        $content .= '<!-- wp:heading --><h2 class="wp-block-heading">Before publishing</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Replace every placeholder, confirm the details with the responsible person, add an effective date and contact details, and remove these editorial instructions. Preview the page, then publish it. The footer link appears automatically once the page is published. You may instead set a PDF or external URL in AES Website → Policy documents.</p><!-- /wp:paragraph -->';
        $id = wp_insert_post(['post_type' => 'page', 'post_status' => 'draft', 'post_title' => $definition['title'], 'post_name' => $key, 'post_content' => $content], true);
        if (is_wp_error($id)) return;
        $ids[$key] = $id;
        update_option('aes_policy_page_ids', $ids, false);
    }
    update_option('aes_policy_starters_v1', 1, false);
}, 40);

function aes_policy_url($key) {
    $urls = (array) get_option('aes_policy_urls', []);
    if (!empty($urls[$key])) return esc_url_raw($urls[$key], ['http', 'https']);
    $ids = (array) get_option('aes_policy_page_ids', []);
    $id = intval($ids[$key] ?? 0);
    return $id && get_post_status($id) === 'publish' ? get_permalink($id) : '';
}

function aes_policy_footer_links($html) {
    foreach (aes_policy_definitions() as $key => $definition) {
        $html = preg_replace_callback('/<a\b[^>]*>\s*' . preg_quote($definition['title'], '/') . '\s*<\/a>/i', function ($match) use ($key) {
            $url = aes_policy_url($key);
            if (!$url) return '';
            $link = preg_replace('/\s+onclick=(?:"[^"]*"|\'[^\']*\')/i', '', $match[0]);
            $link = preg_replace('/\bhref=(?:"[^"]*"|\'[^\']*\')/i', 'href="' . esc_url($url) . '"', $link);
            return $link;
        }, $html);
    }
    // Separators have no purpose when their adjacent document links are unpublished.
    return preg_replace('/<span\b[^>]*>\s*[·•]\s*<\/span>/u', '', $html);
}

add_action('admin_post_aes_policies', function () {
    if (!current_user_can('manage_options')) wp_die('Not allowed', 403);
    check_admin_referer('aes_policies');
    $urls = [];
    foreach (aes_policy_definitions() as $key => $definition) {
        $urls[$key] = esc_url_raw(wp_unslash($_POST['policy_url'][$key] ?? ''), ['http', 'https']);
    }
    update_option('aes_policy_urls', $urls, false);
    wp_safe_redirect(admin_url('admin.php?page=aes-cms&saved=1#policy-documents'));
    exit;
});
