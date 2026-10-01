<?php
/**
 * Single Service Post Template
 *
 * @package Akshar_Theme
 */

get_header();
?>

<main id="main-content">
  <?php while (have_posts()) : the_post(); ?>
    <section class="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20">
        <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
          <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-brand-orange transition-colors">Home</a>
          <span>/</span>
          <a href="<?php echo esc_url(home_url('/services')); ?>" class="hover:text-brand-orange transition-colors">Services</a>
          <span>/</span>
          <span class="text-brand-orange"><?php the_title(); ?></span>
        </nav>

        <div class="max-w-3xl">
          <span class="inline-block bg-brand-orange/10 text-brand-orange text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-brand-orange/20 mb-4">
            Specialized Engineering Discipline
          </span>
          <h1 class="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight mb-4 leading-tight">
            <?php the_title(); ?>
          </h1>
        </div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-20">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div class="lg:col-span-2 space-y-8">
            <?php if (has_post_thumbnail()) : ?>
              <div class="rounded-3xl overflow-hidden shadow-lg h-72 sm:h-96 w-full">
                <?php the_post_thumbnail('full', array('class' => 'w-full h-full object-cover')); ?>
              </div>
            <?php endif; ?>

            <div class="prose max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
              <?php the_content(); ?>
            </div>
          </div>

          <!-- Sidebar Box -->
          <div class="space-y-6">
            <div class="bg-gradient-to-br from-brand-navy to-brand-dark text-white p-8 rounded-3xl shadow-xl space-y-6">
              <h3 class="text-xl font-bold">Request Immediate Inspection</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Deploy certified inspectors across India or international hubs within 24 to 48 hours.
              </p>
              <button onclick="openModal('inquiryModal')" class="btn-premium-orange w-full text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs">
                Request Scope Quote &rarr;
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  <?php endwhile; ?>
</main>

<?php
get_footer();
