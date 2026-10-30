<?php
if (!defined('ABSPATH')) exit;
$key=aes_current_key(); $known=isset(aes_data('manifest')[$key]);
$data=$known ? aes_data($key) : [];
?><!doctype html><html <?php language_attributes(); ?> class="scroll-smooth"><head>
<meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="index, follow, max-image-preview:large">
<?php
$v = $known ? (array)get_post_meta(get_queried_object_id(), '_aes_values', true) : [];
$page_desc = $v['description'] ?? ($data['fields']['description']['default'] ?? 'Akshar Engineering Services Pvt. Ltd. — Third Party Inspection, Quality Surveillance, and Technical Assurance powerhouse.');
$page_url = aes_page_url($key ?: 'home');
$page_title = wp_get_document_title();
$og_image = esc_url(get_template_directory_uri() . '/assets/hero_inspection.jpg');
?>
<meta name="description" content="<?php echo esc_attr($page_desc); ?>">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Akshar Engineering Services Pvt. Ltd.">
<meta property="og:title" content="<?php echo esc_attr($page_title); ?>">
<meta property="og:description" content="<?php echo esc_attr($page_desc); ?>">
<meta property="og:url" content="<?php echo esc_url($page_url); ?>">
<meta property="og:image" content="<?php echo esc_url($og_image); ?>">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?php echo esc_attr($page_title); ?>">
<meta name="twitter:description" content="<?php echo esc_attr($page_desc); ?>">
<meta name="twitter:image" content="<?php echo esc_url($og_image); ?>">
<?php if($known) echo aes_resolve($data['styles']); wp_head(); ?>
</head><body <?php body_class($data['body_class']??'bg-white text-slate-800'); ?>><?php wp_body_open(); ?>
<?php if($known) echo aes_render($key); else { ?>
<?php $shared_header = get_option('aes_global_header_html', ''); if ($shared_header) echo aes_resolve($shared_header); else { ?>
<header class="bg-white border-b p-6"><a href="<?php echo esc_url(home_url('/')); ?>" class="text-brand-blue font-bold"><?php bloginfo('name'); ?></a><a class="ml-6" href="<?php echo esc_url(aes_page_url('services')); ?>">Services</a><a class="ml-6" href="<?php echo esc_url(aes_page_url('we-hear-you')); ?>">Contact</a></header><?php } ?>
<main class="aes-generic"><?php if(have_posts()): while(have_posts()):the_post(); ?><article><h1><?php if(is_singular()) the_title(); else { ?><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a><?php } ?></h1><?php the_content(); ?></article><?php endwhile; the_posts_pagination(); else: ?><h1>Page not found</h1><p>Use the navigation to return to the website.</p><?php endif; ?></main>
<?php echo aes_resolve(aes_policy_footer_links(aes_refine_footer_markup(get_option('aes_global_footer_html', '')))); } wp_footer(); ?></body></html>
