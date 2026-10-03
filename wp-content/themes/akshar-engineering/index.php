<?php
if (!defined('ABSPATH')) exit;
$key=aes_current_key(); $known=isset(aes_data('manifest')[$key]);
$data=$known ? aes_data($key) : [];
?><!doctype html><html <?php language_attributes(); ?> class="scroll-smooth"><head>
<meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width,initial-scale=1">
<?php if($known): $v=(array)get_post_meta(get_queried_object_id(),'_aes_values',true); ?>
<meta name="description" content="<?php echo esc_attr($v['description']??$data['fields']['description']['default']); ?>">
<?php endif; wp_head(); if($known) echo aes_resolve($data['styles']); ?>
</head><body <?php body_class($data['body_class']??'bg-white text-slate-800'); ?>><?php wp_body_open(); ?>
<?php if($known) echo aes_render($key); else { ?>
<header class="bg-white border-b p-6"><a href="<?php echo esc_url(home_url('/')); ?>" class="text-brand-blue font-bold"><?php bloginfo('name'); ?></a><a class="ml-6" href="<?php echo esc_url(aes_page_url('services')); ?>">Services</a><a class="ml-6" href="<?php echo esc_url(aes_page_url('we-hear-you')); ?>">Contact</a></header>
<main class="aes-generic"><?php if(have_posts()): while(have_posts()):the_post(); ?><article><h1><?php if(is_singular()) the_title(); else { ?><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a><?php } ?></h1><?php the_content(); ?></article><?php endwhile; the_posts_pagination(); else: ?><h1>Page not found</h1><p>Use the navigation to return to the website.</p><?php endif; ?></main>
<?php } wp_footer(); ?></body></html>
