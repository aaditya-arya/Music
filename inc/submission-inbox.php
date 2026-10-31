<?php
if (!defined('ABSPATH')) exit;

function aes_inbox_categories() {
    return ['inquiry' => 'Inquiries', 'verify' => 'Document verification', 'job' => 'Applications', 'training' => 'Training', 'feedback' => 'Feedback', 'complaint' => 'Complaints & appeals', 'other' => 'Other'];
}
function aes_inbox_statuses() {
    return ['new' => 'New', 'in_progress' => 'In progress', 'resolved' => 'Resolved', 'archived' => 'Archived'];
}

/** Query only requested metadata. WP's normal meta cache would also load every file body. */
function aes_inbox_meta($ids, $files = false, $notes = false) {
    global $wpdb;
    if (!$ids) return [];
    $ids = array_map('absint', $ids);
    $keys = ['_aes_details', '_aes_form', '_aes_form_title', '_aes_notification', '_aes_category', '_aes_status', '_aes_seen', '_aes_priority', '_aes_inbox_version', '_aes_inbox_index', '_aes_file_count'];
    if ($files || $notes) $keys[] = '_aes_notes';
    $keys[] = '_aes_files';
    $value = $files ? 'meta_value' : "CASE WHEN meta_key = '_aes_files' THEN LEFT(meta_value, 40) ELSE meta_value END";
    $sql = "SELECT post_id,meta_key,$value AS value FROM {$wpdb->postmeta} WHERE post_id IN (" . implode(',', array_fill(0, count($ids), '%d')) . ') AND meta_key IN (' . implode(',', array_fill(0, count($keys), '%s')) . ')';
    $result = [];
    foreach ($wpdb->get_results($wpdb->prepare($sql, array_merge($ids, $keys))) as $row) {
        $result[(int) $row->post_id][$row->meta_key] = !$files && $row->meta_key === '_aes_files' ? $row->value : maybe_unserialize($row->value);
    }
    return $result;
}

function aes_inbox_put($id, $key, $value) {
    global $wpdb;
    $exists = $wpdb->get_var($wpdb->prepare("SELECT meta_id FROM {$wpdb->postmeta} WHERE post_id=%d AND meta_key=%s LIMIT 1", $id, $key));
    $data = ['meta_value' => maybe_serialize($value)];
    $ok = $exists ? $wpdb->update($wpdb->postmeta, $data, ['post_id' => $id, 'meta_key' => $key]) : $wpdb->insert($wpdb->postmeta, ['post_id' => $id, 'meta_key' => $key] + $data);
    if ($ok === false) throw new RuntimeException('The change could not be saved. Please try again.');
    wp_cache_delete($id, 'post_meta');
}

/** Prefer stable field names and schema labels over editable presentation labels. */
function aes_inbox_summary($meta) {
    $form = (string) ($meta['_aes_form'] ?? '');
    $title = (string) ($meta['_aes_form_title'] ?? (aes_data('forms')[$form]['title'] ?? 'Website request'));
    $schema = [];
    foreach (aes_data('forms')[$form]['fields'] ?? [] as $field) $schema[sanitize_key($field['name'])] = $field['label'];
    $summary = ['name' => '', 'email' => '', 'phone' => '', 'company' => '', 'message' => '', 'category' => 'other', 'form_title' => $title];
    $summary['form_title'] = ['inquiryModal'=>'Website inquiry', 'trainingModal'=>'Training registration', 'careersModal'=>'Career application', 'feedbackModal'=>'Client feedback', 'verifyDocModal'=>'Document verification'][$title] ?? $title;
    $message_score = 0;
    $reason = '';
    foreach ((array) ($meta['_aes_details'] ?? []) as $field) {
        if (!is_array($field)) continue;
        $key = sanitize_key($field['name'] ?? '');
        $value = is_scalar($field['value'] ?? null) ? trim((string) $field['value']) : '';
        $label = strtolower($key . ' ' . ($schema[$key] ?? '') . ' ' . ($field['label'] ?? ''));
        if (!$value) continue;
        if ($key === 'reasondropdown') $reason = strtolower($value);
        if ($key === 'selectedreasoninput') { $summary['form_title'] = $value; continue; }
        if (preg_match('/selected reason|request type|human verification|are you human/', $label)) continue;
        if (!$summary['name'] && preg_match('/fullname|candidatename|contactname|inquiryfullname|verifyname|full name|candidate name|client name|contact name|user name|^name\b/', $label)) $summary['name'] = $value;
        if (!$summary['email'] && preg_match('/email|e-mail/', $label) && preg_match('/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i', $value, $match)) $summary['email'] = sanitize_email($match[0]);
        if (!$summary['phone'] && preg_match('/phone|mobile|whatsapp|verifycontact/', $label)) {
            $phone = preg_replace('/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i', '', $value);
            if (preg_match('/\+?[\d][\d\s().\-]{5,}\d/', $phone, $match)) $summary['phone'] = trim($match[0]);
        }
        if (!$summary['company'] && preg_match('/company|organization|organisation/', $label)) $summary['company'] = $value;
        $score = preg_match('/message|scope|summary|requirement|observation/', $label) ? 3 : (preg_match('/note|detail|course|role of interest/', $label) ? 2 : (str_contains($label, 'qualification') ? 1 : 0));
        if ($score > $message_score && !preg_match('/reference|certificate number/', $label)) { $summary['message'] = $value; $message_score = $score; }
    }
    $classification = strtolower($form . ' ' . $title);
    if ($form === 'we-hear-you-0') {
        $summary['category'] = ['inquiry' => 'inquiry', 'feedback' => 'feedback', 'complaint_appeal' => 'complaint', 'doc_verify' => 'verify'][$reason] ?? 'other';
    } elseif (preg_match('/complaint|appeal/', $classification)) $summary['category'] = 'complaint';
    elseif (str_contains($classification, 'feedback')) $summary['category'] = 'feedback';
    elseif (preg_match('/training|course/', $classification)) $summary['category'] = 'training';
    elseif (preg_match('/career|application|job/', $classification)) $summary['category'] = 'job';
    elseif (preg_match('/verify|verification|document|irn/', $classification)) $summary['category'] = 'verify';
    elseif (preg_match('/inquiry|enquiry|contact|rfq/', $classification)) $summary['category'] = 'inquiry';
    return $summary;
}

function aes_inbox_index($id) {
    if (get_post_type($id) !== 'aes_submission') return;
    $meta = aes_inbox_meta([$id])[$id] ?? [];
    $summary = aes_inbox_summary($meta);
    $search = ['AES-' . $id, $summary['form_title']];
    foreach ((array) ($meta['_aes_details'] ?? []) as $field) if (is_array($field) && is_scalar($field['value'] ?? null)) $search[] = (string) $field['value'];
    aes_inbox_put($id, '_aes_category', $summary['category']);
    aes_inbox_put($id, '_aes_search', implode(' ', $search));
    if (!isset($meta['_aes_status'])) aes_inbox_put($id, '_aes_status', 'new');
    if (!isset($meta['_aes_seen'])) aes_inbox_put($id, '_aes_seen', '0');
    if (!isset($meta['_aes_priority'])) aes_inbox_put($id, '_aes_priority', 'normal');
    if (!isset($meta['_aes_inbox_version'])) aes_inbox_put($id, '_aes_inbox_version', '0');
    preg_match('/^a:(\d+):/', (string) ($meta['_aes_files'] ?? ''), $files);
    aes_inbox_put($id, '_aes_file_count', $files[1] ?? '0');
    aes_inbox_put($id, '_aes_inbox_index', '1');
}
add_action('save_post_aes_submission', 'aes_inbox_index');

function aes_inbox_prepare_index() {
    global $wpdb;
    $where = "p.post_type='aes_submission' AND NOT EXISTS (SELECT 1 FROM {$wpdb->postmeta} m WHERE m.post_id=p.ID AND m.meta_key='_aes_inbox_index' AND m.meta_value='1')";
    $ids = $wpdb->get_col("SELECT p.ID FROM {$wpdb->posts} p WHERE $where LIMIT 200");
    foreach ($ids as $id) aes_inbox_index((int) $id);
    return (int) $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} p WHERE $where");
}

function aes_inbox_require_access($ajax = true) {
    if (!current_user_can('manage_options')) {
        if ($ajax) wp_send_json_error(['message' => 'You do not have access to form submissions.'], 403);
        wp_die('You do not have access to form submissions.', 403);
    }
    if ($ajax && !check_ajax_referer('aes_inbox', 'nonce', false)) wp_send_json_error(['message' => 'Your session has expired. Refresh the inbox and try again.'], 403);
}

function aes_inbox_filters($raw) {
    foreach (['category', 'status', 'scope', 'unread', 'q', 'from', 'to', 'page', 'per_page', 'sort'] as $key) {
        if (isset($raw[$key]) && !is_scalar($raw[$key])) return new WP_Error('aes_filter', 'Invalid filter value. Reset your filters and try again.');
    }
    $filters = [
        'category' => sanitize_key($raw['category'] ?? 'all'), 'status' => sanitize_key($raw['status'] ?? 'all'),
        'scope' => sanitize_key($raw['scope'] ?? 'inbox'), 'unread' => !empty($raw['unread']),
        'q' => mb_substr(sanitize_text_field($raw['q'] ?? ''), 0, 200),
        'from' => sanitize_text_field($raw['from'] ?? ''), 'to' => sanitize_text_field($raw['to'] ?? ''),
        'page' => max(1, absint($raw['page'] ?? 1)), 'per_page' => in_array(absint($raw['per_page'] ?? 20), [20, 50, 100], true) ? absint($raw['per_page'] ?? 20) : 20,
        'sort' => ($raw['sort'] ?? '') === 'oldest' ? 'ASC' : 'DESC',
    ];
    if (!in_array($filters['category'], array_merge(['all'], array_keys(aes_inbox_categories())), true) || !in_array($filters['status'], array_merge(['all', 'open'], array_keys(aes_inbox_statuses())), true) || !in_array($filters['scope'], ['inbox', 'trash'], true)) return new WP_Error('aes_filter', 'Choose a valid request type, status and inbox view.');
    foreach (['from', 'to'] as $key) {
        if (!$filters[$key]) continue;
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $filters[$key]);
        if (!$date || $date->format('Y-m-d') !== $filters[$key]) return new WP_Error('aes_date', 'Enter a valid date.');
    }
    if ($filters['from'] && $filters['to'] && $filters['from'] > $filters['to']) return new WP_Error('aes_date', 'The start date must come before the end date.');
    return $filters;
}

function aes_inbox_query($filters, $page = null, $size = null) {
    $meta = ['relation' => 'AND'];
    if ($filters['category'] !== 'all') $meta[] = ['key' => '_aes_category', 'value' => $filters['category']];
    if ($filters['status'] !== 'all') $meta[] = ['key' => '_aes_status', 'value' => $filters['status'] === 'open' ? ['new', 'in_progress'] : $filters['status'], 'compare' => $filters['status'] === 'open' ? 'IN' : '='];
    if ($filters['unread']) $meta[] = ['key' => '_aes_seen', 'value' => '0'];
    if ($filters['q'] !== '') $meta[] = ['key' => '_aes_search', 'value' => $filters['q'], 'compare' => 'LIKE'];
    $args = ['post_type' => 'aes_submission', 'post_status' => $filters['scope'] === 'trash' ? 'trash' : ['private', 'publish', 'draft', 'pending'], 'posts_per_page' => $size ?? $filters['per_page'], 'paged' => $page ?? $filters['page'], 'orderby' => ['date' => $filters['sort'], 'ID' => $filters['sort']], 'fields' => 'ids', 'cache_results' => false, 'update_post_meta_cache' => false, 'update_post_term_cache' => false, 'meta_query' => $meta];
    if ($filters['from'] || $filters['to']) {
        $date = ['column' => 'post_date', 'inclusive' => true];
        if ($filters['from']) $date['after'] = $filters['from'] . ' 00:00:00';
        if ($filters['to']) $date['before'] = $filters['to'] . ' 23:59:59';
        $args['date_query'] = [$date];
    }
    if (!empty($filters['ids'])) $args['post__in'] = $filters['ids'];
    return new WP_Query($args);
}

function aes_inbox_stats() {
    global $wpdb;
    $rows = $wpdb->get_results("SELECT p.post_status,COALESCE(c.meta_value,'other') AS category,COALESCE(s.meta_value,'new') AS state,COALESCE(r.meta_value,'0') AS seen,COUNT(*) AS total FROM {$wpdb->posts} p LEFT JOIN {$wpdb->postmeta} c ON c.post_id=p.ID AND c.meta_key='_aes_category' LEFT JOIN {$wpdb->postmeta} s ON s.post_id=p.ID AND s.meta_key='_aes_status' LEFT JOIN {$wpdb->postmeta} r ON r.post_id=p.ID AND r.meta_key='_aes_seen' WHERE p.post_type='aes_submission' AND p.post_status IN ('private','publish','draft','pending','trash') GROUP BY p.post_status,c.meta_value,s.meta_value,r.meta_value");
    $stats = ['total' => 0, 'unread' => 0, 'open' => 0, 'resolved' => 0, 'trash' => 0, 'categories' => array_fill_keys(array_keys(aes_inbox_categories()), 0), 'trash_categories' => array_fill_keys(array_keys(aes_inbox_categories()), 0)];
    foreach ($rows as $row) {
        $count = (int) $row->total;
        if ($row->post_status === 'trash') { $stats['trash'] += $count; $stats['trash_categories'][$row->category] = ($stats['trash_categories'][$row->category] ?? 0) + $count; continue; }
        $stats['total'] += $count;
        if ($row->seen !== '1') $stats['unread'] += $count;
        if (in_array($row->state, ['new', 'in_progress'], true)) $stats['open'] += $count;
        if ($row->state === 'resolved') $stats['resolved'] += $count;
        $stats['categories'][$row->category] = ($stats['categories'][$row->category] ?? 0) + $count;
    }
    return $stats;
}

function aes_inbox_item($id, $meta, $detail = false) {
    $post = get_post($id);
    $summary = aes_inbox_summary($meta);
    $item = $summary + [
        'id' => (int) $id, 'reference' => 'AES-' . $id,
        'date' => get_the_date('M j, Y', $post), 'time' => get_the_date('g:i a', $post), 'iso' => get_post_time('c', true, $post),
        'status' => $meta['_aes_status'] ?? 'new', 'unread' => ($meta['_aes_seen'] ?? '0') !== '1',
        'priority' => $meta['_aes_priority'] ?? 'normal', 'version' => (int) ($meta['_aes_inbox_version'] ?? 0),
        'trashed' => $post->post_status === 'trash', 'file_count' => (int) ($meta['_aes_file_count'] ?? 0),
    ];
    if ($detail) {
        $item['details'] = array_values(array_filter((array) ($meta['_aes_details'] ?? []), 'is_array'));
        $item['notes'] = array_values((array) ($meta['_aes_notes'] ?? []));
        $item['notification'] = (string) ($meta['_aes_notification'] ?? 'Saved in WordPress');
        $item['files'] = [];
        foreach ((array) ($meta['_aes_files'] ?? []) as $index => $file) {
            if (!is_array($file) || !isset($file['name'], $file['data'])) continue;
            $item['files'][] = ['name' => sanitize_file_name($file['name']), 'size' => max(0, (int) (strlen($file['data']) * 3 / 4) - substr_count(substr($file['data'], -2), '=')), 'url' => add_query_arg('_wpnonce', wp_create_nonce('aes_download_' . $id), admin_url('admin-post.php?action=aes_download&id=' . $id . '&file=' . $index))];
        }
    }
    return $item;
}

add_action('admin_menu', function () {
    add_menu_page('Form Submissions', 'Form Submissions', 'manage_options', 'aes-submissions', 'aes_submissions_admin_screen', 'dashicons-feedback', 3.5);
});

function aes_inbox_list() {
    aes_inbox_require_access();
    $remaining = aes_inbox_prepare_index();
    if ($remaining) wp_send_json_success(['indexing' => true, 'remaining' => $remaining]);
    $filters = aes_inbox_filters(wp_unslash($_GET));
    if (is_wp_error($filters)) wp_send_json_error(['message' => $filters->get_error_message()], 400);
    $query = aes_inbox_query($filters);
    if ($query->max_num_pages && $filters['page'] > $query->max_num_pages) { $filters['page'] = $query->max_num_pages; $query = aes_inbox_query($filters); }
    $meta = aes_inbox_meta($query->posts);
    $items = [];
    foreach ($query->posts as $id) $items[] = aes_inbox_item($id, $meta[$id] ?? []);
    wp_send_json_success(['items' => $items, 'total' => (int) $query->found_posts, 'pages' => max(1, (int) $query->max_num_pages), 'page' => $filters['page'], 'stats' => aes_inbox_stats()]);
}
add_action('wp_ajax_aes_inbox_list', 'aes_inbox_list');
add_action('wp_ajax_nopriv_aes_inbox_list', 'aes_inbox_list');

function aes_inbox_detail() {
    aes_inbox_require_access();
    $id = absint($_GET['id'] ?? 0);
    if (!$id || get_post_type($id) !== 'aes_submission') wp_send_json_error(['message' => 'This submission no longer exists. Refresh the inbox.'], 404);
    $meta = aes_inbox_meta([$id], true)[$id] ?? [];
    wp_send_json_success(aes_inbox_item($id, $meta, true));
}
add_action('wp_ajax_aes_inbox_detail', 'aes_inbox_detail');
add_action('wp_ajax_nopriv_aes_inbox_detail', 'aes_inbox_detail');

function aes_inbox_mutate() {
    aes_inbox_require_access();
    global $wpdb;
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') wp_send_json_error(['message' => 'Use POST to update a request.'], 405);
    foreach (['ids', 'versions', 'operation', 'status', 'priority', 'note'] as $key) {
        if (isset($_POST[$key]) && !is_scalar($_POST[$key])) wp_send_json_error(['message' => 'Invalid request data.'], 400);
    }
    $ids = json_decode(wp_unslash($_POST['ids'] ?? '[]'), true);
    $versions = json_decode(wp_unslash($_POST['versions'] ?? '{}'), true);
    $operation = sanitize_key($_POST['operation'] ?? '');
    $status = sanitize_key($_POST['status'] ?? '');
    $priority = sanitize_key($_POST['priority'] ?? 'normal');
    $note = sanitize_textarea_field(wp_unslash($_POST['note'] ?? ''));
    if (!is_array($ids) || !$ids || count($ids) > 100 || !is_array($versions)) wp_send_json_error(['message' => 'Select between 1 and 100 submissions.'], 400);
    foreach ($ids as $id) if (!is_scalar($id) || !ctype_digit((string) $id) || (int) $id < 1 || !isset($versions[$id]) || !is_scalar($versions[$id]) || !ctype_digit((string) $versions[$id])) wp_send_json_error(['message' => 'Invalid record or version. Refresh the inbox.'], 400);
    $ids = array_values(array_unique(array_map('absint', $ids))); sort($ids);
    if (!in_array($operation, ['save', 'status', 'read', 'unread', 'trash', 'restore', 'delete'], true) || (in_array($operation, ['save', 'status'], true) && !isset(aes_inbox_statuses()[$status])) || !in_array($priority, ['normal', 'high'], true) || mb_strlen($note) > 4000 || ($note !== '' && count($ids) !== 1)) wp_send_json_error(['message' => 'Choose a valid action. Internal notes are limited to 4,000 characters.'], 400);
    $wpdb->query('START TRANSACTION');
    try {
        foreach ($ids as $id) {
            $post = $wpdb->get_row($wpdb->prepare("SELECT ID,post_status,post_type FROM {$wpdb->posts} WHERE ID=%d FOR UPDATE", $id));
            if (!$post || $post->post_type !== 'aes_submission') throw new RuntimeException('A selected submission no longer exists. Refresh the inbox.', 404);
            $meta = aes_inbox_meta([$id])[$id] ?? [];
            if (!array_key_exists($id, $versions) || (int) $versions[$id] !== (int) ($meta['_aes_inbox_version'] ?? 0)) throw new RuntimeException('A selected request changed in another window. Refresh it before saving; your note has been kept.', 409);
            if (in_array($operation, ['restore', 'delete'], true) !== ($post->post_status === 'trash')) throw new RuntimeException('The request is in a different view. Refresh before changing it.', 409);
            if ($operation === 'trash' && defined('EMPTY_TRASH_DAYS') && EMPTY_TRASH_DAYS === 0) throw new RuntimeException('Trash is disabled in this WordPress installation. No records were changed.', 409);
        }
        foreach ($ids as $id) {
            $meta = aes_inbox_meta([$id], false, $note !== '')[$id] ?? [];
            if ($operation === 'delete') { if (!wp_delete_post($id, true)) throw new RuntimeException('The record could not be deleted.'); continue; }
            if ($operation === 'trash' && !wp_trash_post($id)) throw new RuntimeException('The record could not be moved to Trash.');
            if ($operation === 'restore' && !wp_untrash_post($id)) throw new RuntimeException('The record could not be restored.');
            if (in_array($operation, ['save', 'status'], true)) aes_inbox_put($id, '_aes_status', $status);
            if ($operation === 'save') aes_inbox_put($id, '_aes_priority', $priority);
            if (in_array($operation, ['read', 'unread'], true)) aes_inbox_put($id, '_aes_seen', $operation === 'read' ? '1' : '0');
            if ($note !== '') {
                $notes = (array) ($meta['_aes_notes'] ?? []);
                $notes[] = ['text' => $note, 'author' => wp_get_current_user()->display_name, 'user_id' => get_current_user_id(), 'date' => gmdate('c')];
                aes_inbox_put($id, '_aes_notes', $notes);
            }
            aes_inbox_put($id, '_aes_inbox_version', (string) ((int) ($meta['_aes_inbox_version'] ?? 0) + 1));
            clean_post_cache($id);
        }
        $wpdb->query('COMMIT');
    } catch (Throwable $error) {
        $wpdb->query('ROLLBACK');
        foreach ($ids as $id) clean_post_cache($id);
        $code = in_array($error->getCode(), [404, 409], true) ? $error->getCode() : 500;
        wp_send_json_error(['message' => $error->getMessage()], $code);
    }
    wp_send_json_success(['message' => count($ids) . (count($ids) === 1 ? ' request updated.' : ' requests updated.')]);
}
add_action('wp_ajax_aes_inbox_mutate', 'aes_inbox_mutate');
add_action('wp_ajax_nopriv_aes_inbox_mutate', 'aes_inbox_mutate');
add_filter('wp_untrash_post_status', function ($status, $id) { return get_post_type($id) === 'aes_submission' ? 'private' : $status; }, 10, 2);
add_action('wp_ajax_aes_delete_submission', function () {
    aes_inbox_require_access(false);
    wp_send_json_error(['message' => 'Refresh Form Submissions to use the recoverable Trash action. Nothing has been deleted.'], 409);
});

function aes_inbox_csv_cell($value) {
    $value = (string) $value;
    return preg_match('/^[\s\x00-\x1f]*[=+\-@]|^[\t\r]/u', $value) ? "'" . $value : $value;
}
function aes_inbox_export() {
    aes_inbox_require_access(false);
    check_admin_referer('aes_inbox_export');
    if (aes_inbox_prepare_index()) wp_die('Existing submissions are still being prepared. Open Form Submissions and try the export again when loading finishes.', 409);
    $filters = aes_inbox_filters(wp_unslash($_GET));
    if (is_wp_error($filters)) wp_die(esc_html($filters->get_error_message()), 400);
    if (!empty($_GET['ids'])) {
        if (!is_scalar($_GET['ids'])) wp_die('Invalid record selection.', 400);
        $filters['ids'] = array_values(array_filter(array_map('absint', explode(',', sanitize_text_field(wp_unslash($_GET['ids']))))));
        if (!$filters['ids'] || count($filters['ids']) > 100) wp_die('Choose 1 to 100 records to export.', 400);
    }
    nocache_headers();
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="aes-submissions-' . gmdate('Y-m-d') . '.csv"');
    header('X-Content-Type-Options: nosniff');
    $out = fopen('php://output', 'w'); fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, ['Reference', 'Date (' . wp_timezone_string() . ')', 'Request type', 'Status', 'Priority', 'Read', 'Name', 'Email', 'Phone', 'Company', 'Full message', 'All submitted fields', 'Attachment count'], ',', '"', '');
    $page = 1;
    do {
        $query = aes_inbox_query($filters, $page, 200);
        $meta = aes_inbox_meta($query->posts);
        foreach ($query->posts as $id) {
            $item = aes_inbox_item($id, $meta[$id] ?? []);
            $fields = [];
            foreach ((array) ($meta[$id]['_aes_details'] ?? []) as $field) if (is_array($field)) $fields[] = ($field['label'] ?? $field['name'] ?? 'Field') . ': ' . ($field['value'] ?? '');
            fputcsv($out, array_map('aes_inbox_csv_cell', [$item['reference'], $item['date'] . ' ' . $item['time'], aes_inbox_categories()[$item['category']] ?? 'Other', aes_inbox_statuses()[$item['status']] ?? 'New', $item['priority'], $item['unread'] ? 'Unread' : 'Read', $item['name'], $item['email'], $item['phone'], $item['company'], $item['message'], implode("\n", $fields), $item['file_count']]), ',', '"', '');
        }
        $page++;
    } while ($page <= $query->max_num_pages);
    fclose($out); exit;
}
add_action('admin_post_aes_inbox_export', 'aes_inbox_export');
add_action('admin_post_nopriv_aes_inbox_export', 'aes_inbox_export');

function aes_inbox_download() {
    aes_inbox_require_access(false);
    $id = absint($_GET['id'] ?? 0); check_admin_referer('aes_download_' . $id);
    if (get_post_type($id) !== 'aes_submission') wp_die('Not found', 404);
    $meta = aes_inbox_meta([$id], true)[$id] ?? [];
    $file = $meta['_aes_files'][absint($_GET['file'] ?? 0)] ?? null;
    $bytes = is_array($file) ? base64_decode($file['data'] ?? '', true) : false;
    if ($bytes === false || !isset($file['name'])) wp_die('Attachment not found', 404);
    nocache_headers(); header('X-Content-Type-Options: nosniff');
    header('Content-Type: ' . (in_array($file['mime'] ?? '', ['application/pdf', 'image/jpeg', 'image/png'], true) ? $file['mime'] : 'application/octet-stream'));
    header('Content-Disposition: attachment; filename="' . sanitize_file_name($file['name']) . '"');
    header('Content-Length: ' . strlen($bytes)); echo $bytes; exit;
}
add_action('admin_post_aes_download', 'aes_inbox_download');
add_action('admin_post_nopriv_aes_download', 'aes_inbox_download');

add_action('admin_enqueue_scripts', function () {
    if (get_current_screen()->id !== 'toplevel_page_aes-submissions') return;
    wp_enqueue_style('aes-inbox-fonts', get_template_directory_uri() . '/assets/fonts.css', [], filemtime(AES_DIR . '/assets/fonts.css'));
    wp_enqueue_style('aes-inbox', get_template_directory_uri() . '/assets/submission-inbox.css', ['aes-admin'], filemtime(AES_DIR . '/assets/submission-inbox.css'));
    wp_enqueue_script('aes-inbox', get_template_directory_uri() . '/assets/submission-inbox.js', [], filemtime(AES_DIR . '/assets/submission-inbox.js'), true);
    wp_localize_script('aes-inbox', 'AES_INBOX', ['ajax' => admin_url('admin-ajax.php'), 'nonce' => wp_create_nonce('aes_inbox'), 'exportUrl' => add_query_arg('_wpnonce', wp_create_nonce('aes_inbox_export'), admin_url('admin-post.php?action=aes_inbox_export')), 'categories' => aes_inbox_categories(), 'statuses' => aes_inbox_statuses(), 'timezone' => wp_timezone_string()]);
});

function aes_submissions_admin_screen() {
    if (!current_user_can('manage_options')) return;
    require AES_DIR . '/templates/admin-submission-inbox.php';
}
