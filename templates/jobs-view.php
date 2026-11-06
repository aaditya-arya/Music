<?php
if (!defined('ABSPATH')) exit;
$details = $aes_role ? (array) get_post_meta($aes_role->ID, '_aes_job', true) : [];
?><!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="<?php echo esc_attr($aes_role ? wp_strip_all_tags($aes_role->post_content) : 'Find your next engineering opportunity at Akshar Engineering Services.'); ?>"><?php wp_head(); ?></head>
<body <?php body_class('aes-jobs-site'); ?>><?php wp_body_open(); aes_blog_header(); ?>
<main class="aes-jobs-main" id="main-content">
  <div class="aes-jobs-shell">
    <nav class="aes-jobs-breadcrumb" aria-label="Breadcrumb"><a href="<?php echo esc_url(aes_page_url('careers')); ?>">Careers</a><span aria-hidden="true">/</span><?php if ($aes_role): ?><a href="<?php echo esc_url(aes_openings_url()); ?>">All openings</a><span aria-hidden="true">/</span><span><?php echo esc_html(html_entity_decode($aes_role->post_title, ENT_QUOTES | ENT_HTML5, 'UTF-8')); ?></span><?php else: ?><span>All openings</span><?php endif; ?></nav>
    <?php if (!$aes_role): ?>
      <header class="aes-openings-hero"><span class="aes-eyebrow">Careers at AES</span><h1>Find your next<br><em>engineering opportunity.</em></h1><div><?php while (have_posts()): the_post(); the_content(); endwhile; ?></div></header>
      <?php echo aes_render_openings(true); ?>
    <?php else: ?>
      <header class="aes-role-hero"><div><span class="aes-eyebrow"><?php echo esc_html(aes_job_department($aes_role)); ?></span><h1><?php echo esc_html(html_entity_decode($aes_role->post_title, ENT_QUOTES | ENT_HTML5, 'UTF-8')); ?></h1><?php echo aes_job_metadata($details); ?></div><a class="aes-action" href="#job-application">Apply for this role <?php echo aes_job_icon('arrow'); ?></a></header>
      <div class="aes-role-layout"><article class="aes-role-description">
        <section class="aes-role-section"><h2>About the role</h2><?php echo wp_kses_post(wpautop($aes_role->post_content)); ?></section>
        <?php if (!empty($details['responsibilities'])) echo aes_job_detail_section('Key responsibilities', $details['responsibilities']); ?>
        <?php echo aes_job_detail_section('Requirements', $details['requirements'] ?? '', !empty($details['experience']) ? 'Experience: ' . $details['experience'] : 'Relevant engineering or inspection experience.'); ?>
        <?php echo aes_job_detail_section('Required Skills & Qualifications', $details['qualifications'] ?? '', $details['skills'] ?? ''); ?>
        <?php echo aes_job_detail_section('Preferred Skills (Good to Have)', $details['preferred'] ?? ''); ?>
      </article><aside class="aes-role-summary" aria-label="Application guidance"><span class="aes-eyebrow">Your next step</span><h2>Bring your expertise.</h2><p>Read the requirements, then share your experience and supporting documents with the AES talent team.</p><a class="aes-action" href="#job-application">Start application <?php echo aes_job_icon('arrow'); ?></a><a class="aes-inline-link" href="<?php echo esc_url(aes_openings_url()); ?>">View all openings</a></aside></div>
      <section class="aes-role-application" id="job-application"><div><span class="aes-eyebrow">Apply to AES</span><h2>Your application</h2><p>Applying for <strong><?php echo esc_html(html_entity_decode($aes_role->post_title, ENT_QUOTES | ENT_HTML5, 'UTF-8')); ?></strong>. Fields marked * are required.</p></div><div class="aes-form-panel"><?php echo aes_job_application($aes_role); ?></div></section>
    <?php endif; ?>
  </div>
</main>
<?php echo aes_resolve(aes_policy_footer_links(aes_refine_footer_markup(get_option('aes_global_footer_html', '')))); wp_footer(); ?>
</body></html>
