<?php
if (!defined('ABSPATH')) exit;
$page_id = get_queried_object_id();
$description = $aes_blog_single ? wp_strip_all_tags(get_the_excerpt($page_id)) : wp_strip_all_tags(get_post_field('post_content', $page_id));
$canonical = get_permalink($page_id);
?><!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="<?php echo esc_attr(wp_trim_words($description, 35)); ?>">
<meta property="og:type" content="<?php echo $aes_blog_single ? 'article' : 'website'; ?>">
<meta property="og:title" content="<?php echo esc_attr(get_the_title($page_id)); ?>">
<meta property="og:url" content="<?php echo esc_url($canonical); ?>">
<?php wp_head(); ?></head>
<body <?php body_class('aes-blog-site'); ?>><?php wp_body_open(); aes_blog_header(); ?>
<main class="aes-blog-main" id="main-content">
<?php if ($aes_blog_single): while (have_posts()): the_post(); ?>
    <article class="aes-blog-article">
        <header class="aes-blog-article__header aes-blog-shell">
            <a class="aes-blog-back" href="<?php echo esc_url(aes_blog_url()); ?>">← All insights</a>
            <p class="aes-blog-eyebrow">Engineering insights</p><h1><?php echo esc_html(get_the_title()); ?></h1>
            <p class="aes-blog-meta"><time datetime="<?php echo esc_attr(get_the_date('c')); ?>"><?php echo esc_html(get_the_date()); ?></time><span aria-hidden="true">·</span><span>Akshar Engineering Services</span></p>
        </header>
        <?php if (has_post_thumbnail()): ?><figure class="aes-blog-feature aes-blog-shell"><?php the_post_thumbnail('large', ['fetchpriority' => 'high', 'decoding' => 'async']); ?></figure><?php elseif ($aes_post_img = get_post_meta(get_the_ID(), 'aes_post_image', true)): $aes_post_src = str_starts_with($aes_post_img, 'http') ? $aes_post_img : get_template_directory_uri() . '/' . ltrim($aes_post_img, '/'); ?><figure class="aes-blog-feature aes-blog-shell"><img src="<?php echo esc_url($aes_post_src); ?>" alt="<?php echo esc_attr(get_the_title()); ?>" fetchpriority="high" decoding="async" /></figure><?php endif; ?>
        <div class="aes-blog-content"><?php the_content(); wp_link_pages(); ?></div>
        <div class="aes-blog-article__end aes-blog-content"><a class="aes-action" href="<?php echo esc_url(aes_blog_url()); ?>">Explore all insights →</a><a class="aes-blog-text-link" href="<?php echo esc_url(aes_page_url('contact-us')); ?>">Discuss your project</a></div>
    </article>
<?php endwhile; else:
    $query_text = sanitize_text_field(wp_unslash($_GET['blog_search'] ?? ''));
    $topic = absint($_GET['blog_topic'] ?? 0); $paged = max(1, absint($_GET['blog_page'] ?? 1));
    $posts = new WP_Query(['post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => 9, 'paged' => $paged, 's' => $query_text, 'cat' => $topic, 'post__not_in' => aes_blog_sample_posts(), 'ignore_sticky_posts' => true, 'orderby' => ['date' => 'DESC', 'ID' => 'DESC']]);
    $topics = get_categories(['hide_empty' => true]);
?>
    <section class="aes-blog-hero">
        <div class="aes-blog-hero__visual" aria-hidden="true"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/service_design_calc.jpg'); ?>" alt="" fetchpriority="high" width="1376" height="768"></div>
        <div class="aes-blog-shell"><nav class="aes-blog-breadcrumb" aria-label="Breadcrumb"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a><span aria-hidden="true">/</span><span>Blog</span></nav><div class="aes-blog-hero__copy"><p class="aes-blog-eyebrow">The AES journal</p><h1><?php echo esc_html(get_the_title($page_id)); ?></h1><div class="aes-blog-introduction"><?php echo apply_filters('the_content', get_post_field('post_content', $page_id)); ?></div><a class="aes-blog-text-link" href="#latest-insights">Explore the articles ↓</a></div></div>
    </section>
    <section class="aes-blog-shell aes-blog-library" id="latest-insights" aria-labelledby="aes-blog-library-title">
        <div class="aes-blog-section-title"><div><p class="aes-blog-eyebrow">Ideas, experience & perspective</p><h2 id="aes-blog-library-title">Latest insights</h2></div><p>Inspection. Quality. Safer tomorrow.</p></div>
        <form class="aes-blog-filters" method="get" action="<?php echo esc_url(aes_blog_url()); ?>" role="search" aria-label="Search blog articles">
            <div><label for="aes-blog-search">Find an article</label><input id="aes-blog-search" name="blog_search" type="search" value="<?php echo esc_attr($query_text); ?>" placeholder="Search inspection, quality or a topic"></div>
            <div><label for="aes-blog-topic">Topic</label><select id="aes-blog-topic" name="blog_topic"><option value="0">All topics</option><?php foreach ($topics as $category): ?><option value="<?php echo intval($category->term_id); ?>" <?php selected($topic, $category->term_id); ?>><?php echo esc_html($category->name); ?></option><?php endforeach; ?></select></div>
            <button class="aes-action" type="submit">Search articles</button>
            <?php if ($query_text || $topic): ?><a class="aes-blog-text-link" href="<?php echo esc_url(aes_blog_url()); ?>#latest-insights">Clear filters</a><?php endif; ?>
        </form>
        <?php if ($posts->have_posts()): ?>
            <p class="aes-blog-result-count"><?php echo intval($posts->found_posts); ?> <?php echo $posts->found_posts === 1 ? 'article' : 'articles'; ?><?php if ($query_text): ?> matching “<?php echo esc_html($query_text); ?>”<?php endif; ?></p>
            <div class="aes-blog-grid">
            <?php while ($posts->have_posts()): $posts->the_post(); $categories = get_the_category(); ?>
                <article class="aes-blog-card"><a href="<?php the_permalink(); ?>">
                    <div class="aes-blog-card__image"><?php if (has_post_thumbnail()): the_post_thumbnail('medium_large', ['loading' => 'lazy', 'decoding' => 'async']); elseif ($aes_card_img = get_post_meta(get_the_ID(), 'aes_post_image', true)): $aes_card_src = str_starts_with($aes_card_img, 'http') ? $aes_card_img : get_template_directory_uri() . '/' . ltrim($aes_card_img, '/'); echo '<img src="' . esc_url($aes_card_src) . '" alt="' . esc_attr(get_the_title()) . '" loading="lazy" decoding="async" />'; else: ?><img class="aes-blog-card__monogram" src="<?php echo esc_url(get_template_directory_uri() . '/assets/aes-watermark.svg'); ?>" alt="" width="460" height="460" loading="lazy"><?php endif; ?></div>
                    <div class="aes-blog-card__copy"><div class="aes-blog-card__meta"><span class="aes-blog-eyebrow"><?php echo esc_html($categories[0]->name ?? 'Engineering insight'); ?></span><span><?php echo max(1, intval(ceil(str_word_count(wp_strip_all_tags(get_the_content())) / 200))); ?> min read</span></div><h2><?php echo esc_html(get_the_title()); ?></h2><p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 28)); ?></p><span class="aes-blog-card__bottom"><time datetime="<?php echo esc_attr(get_the_date('c')); ?>"><?php echo esc_html(get_the_date()); ?></time><span>Read article <span aria-hidden="true">↗</span></span></span></div>
                </a></article>
            <?php endwhile; wp_reset_postdata(); ?>
            </div>
            <?php if ($posts->max_num_pages > 1): ?><nav class="aes-blog-pagination" aria-label="Blog pages"><?php echo wp_kses_post(paginate_links(['base' => str_replace('999999999', '%#%', add_query_arg('blog_page', 999999999, aes_blog_url())), 'format' => '', 'current' => $paged, 'total' => $posts->max_num_pages, 'add_args' => ['blog_search' => $query_text, 'blog_topic' => $topic], 'prev_text' => '← Previous', 'next_text' => 'Next →'])); ?></nav><?php endif; ?>
        <?php else: ?>
            <div class="aes-blog-empty"><span class="aes-blog-eyebrow"><?php echo $query_text || $topic ? 'Try another search' : 'The next perspective starts here'; ?></span><h3><?php echo $query_text || $topic ? 'No articles match these filters.' : 'New insights are on their way.'; ?></h3><p><?php echo $query_text || $topic ? 'Try a broader phrase or choose another topic.' : 'Our engineering articles will appear here as they are published. In the meantime, explore how AES supports your project.'; ?></p><a class="aes-action" href="<?php echo esc_url($query_text || $topic ? aes_blog_url() . '#latest-insights' : aes_page_url('services')); ?>"><?php echo $query_text || $topic ? 'View all articles' : 'Explore our services'; ?> →</a></div>
        <?php endif; ?>
    </section>
<?php endif; ?>
</main>
<?php echo aes_resolve(aes_policy_footer_links(aes_refine_footer_markup(get_option('aes_global_footer_html', '')))); wp_footer(); ?>
</body></html>
