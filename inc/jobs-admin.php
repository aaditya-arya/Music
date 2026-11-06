<?php
if (!defined('ABSPATH')) exit;

// Jobs use a single native form so their metadata is visible and saved together
// with the title, description and publishing status. Pages retain their builder.
add_filter('use_block_editor_for_post_type', function ($use_block_editor, $post_type) {
    return $post_type === 'aes_job' ? false : $use_block_editor;
}, 10, 2);

/** Keep every entry point connected to WordPress's existing job records. */
function aes_job_admin_links() {
    $type = get_post_type_object('aes_job');
    if (!$type || !current_user_can($type->cap->edit_posts)) return [];
    $links = ['manage' => admin_url('edit.php?post_type=aes_job')];
    if (current_user_can($type->cap->create_posts)) $links['add'] = admin_url('post-new.php?post_type=aes_job');
    return $links;
}

function aes_job_editor_fields() {
    return ['type' => 'Employment / assignment type', 'location' => 'Location', 'experience' => 'Experience', 'skills' => 'Key skills (short summary)', 'department' => 'Department / job group', 'responsibilities' => 'Key responsibilities (one per line)', 'requirements' => 'Requirements (one per line)', 'qualifications' => 'Required skills & qualifications (one per line)', 'preferred' => 'Preferred skills / good to have (one per line)'];
}

function aes_job_editor_items() {
    if (!aes_job_admin_links()) return [];
    return array_map(function ($job) {
        $details = (array) get_post_meta($job->ID, '_aes_job', true);
        $status = get_post_status_object($job->post_status);
        return [
            'id' => $job->ID,
            'title' => html_entity_decode($job->post_title, ENT_QUOTES | ENT_HTML5, 'UTF-8'),
            'status' => $status ? $status->label : $job->post_status,
            'location' => $details['location'] ?? '',
            'type' => $details['type'] ?? '',
            'editUrl' => get_edit_post_link($job->ID, 'raw'),
        ];
    }, get_posts(['post_type' => 'aes_job', 'post_status' => ['publish', 'draft', 'pending', 'future', 'private'], 'numberposts' => -1, 'orderby' => 'date', 'order' => 'ASC']));
}

add_action('admin_menu', function () {
    $type = get_post_type_object('aes_job');
    if (!$type) return;
    add_submenu_page('aes-cms', 'Manage jobs', 'Manage jobs', $type->cap->edit_posts, 'edit.php?post_type=aes_job');
    add_submenu_page('aes-cms', 'Add job', 'Add job', $type->cap->create_posts, 'post-new.php?post_type=aes_job');
});

add_filter('manage_aes_job_posts_columns', function ($columns) {
    $date = $columns['date'] ?? 'Date';
    unset($columns['date']);
    $columns['aes_job_type'] = 'Employment type';
    $columns['aes_job_location'] = 'Location';
    $columns['aes_job_experience'] = 'Experience';
    $columns['date'] = $date;
    return $columns;
});

add_action('manage_aes_job_posts_custom_column', function ($column, $post_id) {
    $fields = ['aes_job_type' => 'type', 'aes_job_location' => 'location', 'aes_job_experience' => 'experience'];
    if (!isset($fields[$column])) return;
    $details = (array) get_post_meta($post_id, '_aes_job', true);
    echo esc_html($details[$fields[$column]] ?? '—');
}, 10, 2);

add_action('admin_notices', function () {
    $screen = get_current_screen();
    $post_id = isset($_GET['post']) ? absint($_GET['post']) : 0;
    if ($screen && $screen->base === 'post' && $screen->post_type === 'page' && in_array(get_post_meta($post_id, '_aes_layout', true), ['careers', 'join-us'], true)) {
        $links = aes_job_admin_links();
        if ($links) {
            echo '<div class="notice notice-info aes-careers-jobs-notice"><p><strong>Careers job openings</strong> — Add new roles or edit and remove existing jobs here in WordPress admin.</p><p><a class="button button-primary" href="' . esc_url($links['manage']) . '" target="_blank" rel="noopener noreferrer">Manage / remove jobs</a> ';
            if (isset($links['add'])) echo '<a class="button" href="' . esc_url($links['add']) . '" target="_blank" rel="noopener noreferrer">Add new job</a>';
            echo '</p></div>';
        }
    }
    if (!$screen || $screen->post_type !== 'aes_job' || !aes_job_admin_links()) return;
    echo '<div class="notice notice-info"><p><strong>Careers job openings:</strong> Enter the job title and description, then fill in employment type, location, experience and key skills under <strong>Job details</strong>. Publish to show a role on Careers, Join Us and the application form. Save as Draft to hide it, or move it to Trash to remove it. You can restore jobs from Trash.</p></div>';
});

add_filter('enter_title_here', function ($placeholder, $post) {
    return $post->post_type === 'aes_job' ? 'Job title (for example, QA/QC Engineer)' : $placeholder;
}, 10, 2);
