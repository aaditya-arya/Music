<?php
if (!defined('ABSPATH')) exit;

add_action('wp_ajax_aes_submit', 'aes_submit');
add_action('wp_ajax_nopriv_aes_submit', 'aes_submit');

function aes_submit() {
    if (!check_ajax_referer('aes_submit', 'nonce', false)) {
        wp_send_json_error(['message' => 'This page has expired. Refresh and submit again.'], 403);
    }
    $form = sanitize_key(wp_unslash($_POST['form'] ?? ''));
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
    foreach ($raw as $f) {
        if (!is_array($f)) continue;
        $name = sanitize_key($f['name'] ?? '');
        $value = sanitize_textarea_field((string)($f['value'] ?? ''));
        $label = sanitize_text_field((string)($f['label'] ?? $name));
        if (strlen($value) > 10000) {
            wp_send_json_error(['message' => 'One field is too long.'], 400);
        }
        $map[$name] = $value;
        $clean[] = ['label' => $label, 'value' => $value];
    }
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
    if (!$clean) {
        wp_send_json_error(['message' => 'Complete the form before submitting.'], 400);
    }
    $files = [];
    $total = 0;
    foreach ($_FILES as $f) {
        if (is_array($f['name'] ?? null)) {
            wp_send_json_error(['message' => 'Invalid attachment.'], 400);
        }
        if (($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) continue;
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
            if ($im && in_array($im['mime'], ['image/jpeg', 'image/png'], true)) {
                $mime = $im['mime'];
            }
        }
        if (!$mime) {
            wp_send_json_error(['message' => 'Attachments must be PDF, JPG or PNG files.'], 400);
        }
        $files[] = ['name' => $name, 'mime' => $mime, 'data' => base64_encode($bytes)];
    }
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

// Admin menu for Form Submissions Hub
add_action('admin_menu', function () {
    $count = wp_count_posts('aes_submission');
    $total_count = !empty($count->private) ? (int)$count->private : 0;
    $badge = $total_count > 0 ? ' <span class="update-plugins count-' . $total_count . '"><span class="plugin-count">' . $total_count . '</span></span>' : '';
    add_menu_page(
        'Form Submissions',
        'Form Submissions' . $badge,
        'manage_options',
        'aes-submissions',
        'aes_submissions_admin_screen',
        'dashicons-feedback',
        3.5
    );
});

// AJAX handler to delete a single submission
add_action('wp_ajax_aes_delete_submission', function () {
    if (!current_user_can('manage_options')) {
        wp_send_json_error(['message' => 'Unauthorized.'], 403);
    }
    check_ajax_referer('aes_admin_action', 'nonce');
    $id = absint($_POST['id'] ?? 0);
    if (!$id || get_post_type($id) !== 'aes_submission') {
        wp_send_json_error(['message' => 'Submission not found.'], 404);
    }
    $res = wp_delete_post($id, true);
    if ($res) {
        wp_send_json_success(['message' => 'Submission #' . $id . ' deleted successfully.']);
    } else {
        wp_send_json_error(['message' => 'Failed to delete submission.'], 500);
    }
});

// Single attachment download handler
add_action('admin_post_aes_download', function () {
    if (!current_user_can('manage_options')) {
        wp_die('Not allowed', 403);
    }
    $id = absint($_GET['id'] ?? 0);
    check_admin_referer('aes_download_' . $id);
    if (get_post_type($id) !== 'aes_submission') {
        wp_die('Not found', 404);
    }
    $files = (array)get_post_meta($id, '_aes_files', true);
    $f = $files[absint($_GET['file'] ?? 0)] ?? null;
    if (!$f) {
        wp_die('Not found', 404);
    }
    nocache_headers();
    header('X-Content-Type-Options: nosniff');
    header('Content-Type: ' . $f['mime']);
    header('Content-Disposition: attachment; filename="' . sanitize_file_name($f['name']) . '"');
    echo base64_decode($f['data']);
    exit;
});

// Submissions Dashboard Admin Screen
function aes_submissions_admin_screen() {
    if (!current_user_can('manage_options')) return;

    $posts = get_posts([
        'post_type' => 'aes_submission',
        'post_status' => 'any',
        'numberposts' => -1,
        'orderby' => 'date',
        'order' => 'DESC'
    ]);

    $submissions = [];
    $stats = [
        'total' => count($posts),
        'inquiry' => 0,
        'verify' => 0,
        'job' => 0,
        'training' => 0,
        'other' => 0
    ];

    foreach ($posts as $p) {
        $details = (array)get_post_meta($p->ID, '_aes_details', true);
        $form_key = (string)get_post_meta($p->ID, '_aes_form', true);
        $form_title = (string)get_post_meta($p->ID, '_aes_form_title', true);
        if (!$form_title) {
            $parts = explode(' — ', $p->post_title);
            $form_title = $parts[0] ?? 'Website Form';
        }
        $files = (array)get_post_meta($p->ID, '_aes_files', true);
        $notification = (string)get_post_meta($p->ID, '_aes_notification', true);

        // Classify Category
        $cat = 'other';
        $title_lower = strtolower($form_title . ' ' . $form_key);
        if (str_contains($title_lower, 'inquiry') || str_contains($title_lower, 'rfq') || str_contains($title_lower, 'feedback') || str_contains($title_lower, 'contact')) {
            $cat = 'inquiry';
            $stats['inquiry']++;
        } elseif (str_contains($title_lower, 'verify') || str_contains($title_lower, 'doc') || str_contains($title_lower, 'irn')) {
            $cat = 'verify';
            $stats['verify']++;
        } elseif (str_contains($title_lower, 'job') || str_contains($title_lower, 'career') || str_contains($title_lower, 'application')) {
            $cat = 'job';
            $stats['job']++;
        } elseif (str_contains($title_lower, 'training') || str_contains($title_lower, 'course')) {
            $cat = 'training';
            $stats['training']++;
        } else {
            $stats['other']++;
        }

        // Extract primary submitter fields
        $name = '';
        $email = '';
        $phone = '';
        $company = '';
        $snippet = '';

        foreach ($details as $row) {
            $lbl = strtolower($row['label'] ?? '');
            $val = trim($row['value'] ?? '');
            if (!$val) continue;

            if (!$name && (str_contains($lbl, 'name') || str_contains($lbl, 'candidate') || str_contains($lbl, 'user'))) {
                $name = $val;
            } elseif (!$email && (str_contains($lbl, 'email') || str_contains($lbl, 'e-mail') || str_contains($lbl, 'mail'))) {
                $email = $val;
            } elseif (!$phone && (str_contains($lbl, 'phone') || str_contains($lbl, 'mobile') || str_contains($lbl, 'contact'))) {
                $phone = $val;
            } elseif (!$company && (str_contains($lbl, 'company') || str_contains($lbl, 'organization') || str_contains($lbl, 'position') || str_contains($lbl, 'course'))) {
                $company = $val;
            } elseif (!$snippet && (str_contains($lbl, 'message') || str_contains($lbl, 'detail') || str_contains($lbl, 'note') || str_contains($lbl, 'scope') || str_contains($lbl, 'qualification') || str_contains($lbl, 'report'))) {
                $snippet = $val;
            }
        }

        $formatted_files = [];
        foreach ($files as $idx => $f) {
            $formatted_files[] = [
                'name' => $f['name'] ?? 'attachment',
                'mime' => $f['mime'] ?? 'application/octet-stream',
                'url' => wp_nonce_url(admin_url('admin-post.php?action=aes_download&id=' . $p->ID . '&file=' . $idx), 'aes_download_' . $p->ID)
            ];
        }

        $submissions[] = [
            'id' => $p->ID,
            'date' => get_the_date('M j, Y — g:i A', $p),
            'timestamp' => get_post_time('U', false, $p),
            'form_title' => $form_title,
            'form_key' => $form_key,
            'category' => $cat,
            'name' => $name ?: 'Anonymous / Not provided',
            'email' => $email,
            'phone' => $phone,
            'company' => $company,
            'snippet' => $snippet,
            'details' => $details,
            'files' => $formatted_files,
            'notification' => $notification
        ];
    }

    $admin_nonce = wp_create_nonce('aes_admin_action');
    ?>
    <div class="wrap aes-admin-wrap" style="max-width: 1400px; margin: 20px auto 40px;">
        
        <!-- Header Banner with Glassmorphism -->
        <div class="aes-glass-banner">
            <div class="aes-glass-banner-content">
                <div class="aes-banner-left">
                    <span class="aes-glass-tag">EXECUTIVE QUALITY HUB</span>
                    <h1 class="aes-banner-title">Form Submissions & Inquiries</h1>
                    <p class="aes-banner-subtitle">Centralized live database of inquiries, IRN verifications, career applications, and training registrations across the AES platform.</p>
                </div>
                <div class="aes-banner-actions">
                    <button type="button" onclick="aesExportCSV()" class="btn-glass btn-glass-orange">
                        <span>📥 Export CSV</span>
                    </button>
                    <button type="button" onclick="window.location.reload()" class="btn-glass btn-glass-blue">
                        <span>🔄 Refresh</span>
                    </button>
                </div>
            </div>

            <!-- Stats Metric Cards Grid -->
            <div class="aes-stats-grid">
                <div class="aes-stat-card" data-cat="all" onclick="aesFilterCategory('all')">
                    <span class="aes-stat-label">Total Submissions</span>
                    <div class="aes-stat-value"><?php echo (int)$stats['total']; ?></div>
                    <span class="aes-stat-sub">Across all touchpoints</span>
                </div>
                <div class="aes-stat-card" data-cat="inquiry" onclick="aesFilterCategory('inquiry')">
                    <span class="aes-stat-label">📩 Inquiries & RFQs</span>
                    <div class="aes-stat-value text-orange"><?php echo (int)$stats['inquiry']; ?></div>
                    <span class="aes-stat-sub">Direct scope requests</span>
                </div>
                <div class="aes-stat-card" data-cat="verify" onclick="aesFilterCategory('verify')">
                    <span class="aes-stat-label">🛡️ IRN Verifications</span>
                    <div class="aes-stat-value text-blue"><?php echo (int)$stats['verify']; ?></div>
                    <span class="aes-stat-sub">Document checks</span>
                </div>
                <div class="aes-stat-card" data-cat="job" onclick="aesFilterCategory('job')">
                    <span class="aes-stat-label">💼 Career Applications</span>
                    <div class="aes-stat-value text-emerald"><?php echo (int)$stats['job']; ?></div>
                    <span class="aes-stat-sub">Surveyor & inspector CVs</span>
                </div>
                <div class="aes-stat-card" data-cat="training" onclick="aesFilterCategory('training')">
                    <span class="aes-stat-label">🎓 Training Inquiries</span>
                    <div class="aes-stat-value text-purple"><?php echo (int)$stats['training']; ?></div>
                    <span class="aes-stat-sub">ASNT & QA courses</span>
                </div>
            </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="aes-toolbar-card">
            <div class="aes-toolbar-top">
                <!-- Tab Buttons -->
                <div class="aes-filter-tabs">
                    <button type="button" class="btn-glass-tab active" data-filter="all" onclick="aesFilterCategory('all')">
                        All <span class="aes-tab-count"><?php echo (int)$stats['total']; ?></span>
                    </button>
                    <button type="button" class="btn-glass-tab" data-filter="inquiry" onclick="aesFilterCategory('inquiry')">
                        📩 Inquiries <span class="aes-tab-count"><?php echo (int)$stats['inquiry']; ?></span>
                    </button>
                    <button type="button" class="btn-glass-tab" data-filter="verify" onclick="aesFilterCategory('verify')">
                        🛡️ IRN Verification <span class="aes-tab-count"><?php echo (int)$stats['verify']; ?></span>
                    </button>
                    <button type="button" class="btn-glass-tab" data-filter="job" onclick="aesFilterCategory('job')">
                        💼 Applications <span class="aes-tab-count"><?php echo (int)$stats['job']; ?></span>
                    </button>
                    <button type="button" class="btn-glass-tab" data-filter="training" onclick="aesFilterCategory('training')">
                        🎓 Training <span class="aes-tab-count"><?php echo (int)$stats['training']; ?></span>
                    </button>
                    <?php if ($stats['other'] > 0): ?>
                    <button type="button" class="btn-glass-tab" data-filter="other" onclick="aesFilterCategory('other')">
                        📋 Other <span class="aes-tab-count"><?php echo (int)$stats['other']; ?></span>
                    </button>
                    <?php endif; ?>
                </div>

                <!-- Search Input -->
                <div class="aes-search-wrap">
                    <span class="aes-search-icon">🔍</span>
                    <input type="search" id="aesSubmissionSearch" class="aes-search-input" placeholder="Filter by name, email, phone, reference..." oninput="aesApplyFilters()">
                </div>
            </div>
        </div>

        <!-- Submissions Table Card -->
        <div class="aes-table-card">
            <div class="aes-table-responsive">
                <table class="aes-table" id="aesSubmissionsTable">
                    <thead>
                        <tr>
                            <th style="width: 100px;">Ref ID</th>
                            <th style="width: 160px;">Date & Time</th>
                            <th style="width: 180px;">Form Type</th>
                            <th style="width: 260px;">Submitter Details</th>
                            <th>Key Summary / Scope</th>
                            <th style="width: 120px;">Attachments</th>
                            <th style="width: 140px; text-align: right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="aesSubmissionsBody">
                        <?php if (empty($submissions)): ?>
                        <tr class="aes-empty-row">
                            <td colspan="7" style="text-align:center; padding: 48px 16px;">
                                <div class="aes-empty-state">
                                    <span style="font-size: 40px; display:block; margin-bottom: 12px;">📭</span>
                                    <h3 style="margin:0 0 6px; font-size:18px; font-weight:800; color:#1b3574;">No Submissions Yet</h3>
                                    <p style="margin:0; font-size:13px; color:#64748b;">Incoming form data submitted from any website modal or page will appear here in real-time.</p>
                                </div>
                            </td>
                        </tr>
                        <?php else: ?>
                            <?php foreach ($submissions as $item): ?>
                            <tr class="aes-sub-row" data-id="<?php echo (int)$item['id']; ?>" data-cat="<?php echo esc_attr($item['category']); ?>" data-search="<?php echo esc_attr(strtolower($item['name'] . ' ' . $item['email'] . ' ' . $item['phone'] . ' ' . $item['company'] . ' ' . $item['form_title'] . ' ' . $item['snippet'] . ' AES-' . $item['id'])); ?>">
                                <td>
                                    <span class="aes-ref-badge">AES-<?php echo (int)$item['id']; ?></span>
                                </td>
                                <td>
                                    <span class="aes-date-text"><?php echo esc_html($item['date']); ?></span>
                                </td>
                                <td>
                                    <span class="aes-cat-badge aes-cat-<?php echo esc_attr($item['category']); ?>">
                                        <?php echo esc_html($item['form_title']); ?>
                                    </span>
                                </td>
                                <td>
                                    <div class="aes-contact-cell">
                                        <strong class="aes-contact-name"><?php echo esc_html($item['name']); ?></strong>
                                        <?php if ($item['company']): ?>
                                            <span class="aes-contact-company">🏢 <?php echo esc_html($item['company']); ?></span>
                                        <?php endif; ?>
                                        <div class="aes-contact-links">
                                            <?php if ($item['email']): ?>
                                                <a href="mailto:<?php echo esc_attr($item['email']); ?>" class="aes-mini-link">✉ <?php echo esc_html($item['email']); ?></a>
                                            <?php endif; ?>
                                            <?php if ($item['phone']): ?>
                                                <a href="tel:<?php echo esc_attr($item['phone']); ?>" class="aes-mini-link">☎ <?php echo esc_html($item['phone']); ?></a>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="aes-snippet-cell">
                                        <?php echo esc_html($item['snippet'] ? wp_trim_words($item['snippet'], 16, '...') : 'Full details recorded.'); ?>
                                    </div>
                                </td>
                                <td>
                                    <?php if (!empty($item['files'])): ?>
                                        <div class="aes-files-cell">
                                            <?php foreach ($item['files'] as $f): ?>
                                                <a href="<?php echo esc_url($f['url']); ?>" class="btn-glass btn-glass-file" title="<?php echo esc_attr($f['name']); ?>">
                                                    <span>📎 <?php echo esc_html(wp_trim_words($f['name'], 3, '..')); ?></span>
                                                </a>
                                            <?php endforeach; ?>
                                        </div>
                                    <?php else: ?>
                                        <span class="aes-no-files">—</span>
                                    <?php endif; ?>
                                </td>
                                <td style="text-align: right;">
                                    <div class="aes-actions-cell">
                                        <button type="button" class="btn-glass btn-glass-view" onclick="aesOpenDetailModal(<?php echo (int)$item['id']; ?>)">
                                            <span>👁️ View</span>
                                        </button>
                                        <button type="button" class="btn-glass btn-glass-danger" onclick="aesDeleteSubmission(<?php echo (int)$item['id']; ?>)" title="Delete submission">
                                            <span>🗑️</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Detail Modal Backdrop & Container -->
        <div id="aesDetailModal" class="aes-modal-overlay" style="display:none;" onclick="if(event.target===this)aesCloseDetailModal()">
            <div class="aes-modal-dialog">
                <div class="aes-modal-header">
                    <div>
                        <span id="modalCategoryBadge" class="aes-cat-badge aes-cat-inquiry">Form Details</span>
                        <h2 id="modalTitle" class="aes-modal-title">Submission Details</h2>
                        <span id="modalSubtitle" class="aes-modal-sub">Reference ID & Timestamp</span>
                    </div>
                    <button type="button" class="aes-modal-close" onclick="aesCloseDetailModal()">✕</button>
                </div>

                <div class="aes-modal-body">
                    <!-- Notification Delivery Status -->
                    <div id="modalNoticeBox" class="aes-modal-notice">
                        <strong>Admin Notification:</strong> <span id="modalNoticeText">Saved in WordPress database</span>
                    </div>

                    <!-- Submitted Key-Value Fields -->
                    <h3 style="font-size: 14px; font-weight:800; color:#0b1633; margin: 16px 0 8px;">Submitted Data Fields</h3>
                    <div class="aes-modal-table-wrap">
                        <table class="aes-modal-table">
                            <tbody id="modalFieldsBody">
                            </tbody>
                        </table>
                    </div>

                    <!-- Attachments List -->
                    <div id="modalAttachmentsSection" style="margin-top: 20px;">
                        <h3 style="font-size: 14px; font-weight:800; color:#0b1633; margin: 0 0 8px;">Uploaded Documents & Files</h3>
                        <div id="modalAttachmentsList" class="aes-attachments-grid"></div>
                    </div>
                </div>

                <div class="aes-modal-footer">
                    <button type="button" class="btn-glass btn-glass-copy" onclick="aesCopyModalDetails()">
                        <span>📋 Copy All Text</span>
                    </button>
                    <button type="button" class="btn-glass btn-glass-blue" onclick="aesCloseDetailModal()">
                        <span>Close</span>
                    </button>
                </div>
            </div>
        </div>

    </div>

    <!-- Data Injection for Client-Side Filtering & Export -->
    <script>
        window.AES_SUBMISSIONS = <?php echo wp_json_encode($submissions); ?>;
        window.AES_ADMIN_NONCE = <?php echo wp_json_encode($admin_nonce); ?>;
        window.AES_AJAX_URL = <?php echo wp_json_encode(admin_url('admin-ajax.php')); ?>;
    </script>
    <?php
}
