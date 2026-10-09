<?php
/**
 * The template for displaying all pages
 *
 * @package Akshar_Engineering
 */

get_header();
?>

<main id="primary" class="site-main w-full min-h-screen">
    <?php
    while (have_posts()) :
        the_post();
        ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <div class="entry-content">
                <?php the_content(); ?>
            </div>
        </article>
        <?php
    endwhile;
    ?>
</main>

<?php
get_footer();
