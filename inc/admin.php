<?php
if (!defined('ABSPATH')) exit;
add_action('admin_menu',function(){add_menu_page('AES Website','AES Website','manage_options','aes-cms','aes_admin_screen','dashicons-admin-site-alt3',3);});
add_action('admin_notices',function(){if(current_user_can('manage_options')&&!get_option('aes_page_ids')) echo '<div class="notice notice-info"><p>Akshar Engineering CMS is active. Open <a href="'.esc_url(admin_url('admin.php?page=aes-cms')).'">AES Website</a> to import your original pages.</p></div>';});

function aes_controls($defs,$values) {
    echo '<div class="aes-controls"><p><input type="search" class="widefat aes-filter" placeholder="Find text, image or link…"></p><input type="hidden" name="aes_values_json" class="aes-json" value="">';
    $groups=[]; foreach($defs as $k=>$d) $groups[$d['group']][$k]=$d;
    foreach($groups as $group=>$items){
        echo '<details class="aes-group"><summary>'.esc_html($group).' <small>('.count($items).' fields)</small></summary>';
        foreach($items as $k=>$d){
            $v=array_key_exists($k,$values)?$values[$k]:$d['default'];
            echo '<div class="aes-row"><label for="aes-'.esc_attr($k).'"><strong>'.esc_html($d['label']).'</strong></label>';
            echo '<textarea id="aes-'.esc_attr($k).'" data-key="'.esc_attr($k).'" class="widefat aes-value" rows="'.($d['type']==='text'&&strlen($v)>100?3:1).'">'.esc_textarea($v).'</textarea>';
            if(in_array($d['type'],['image','url'],true)) echo '<button type="button" class="button aes-media">Choose from Media Library</button> <span class="description">Use a full URL, or keep the supplied automatic page/asset reference.</span>';
            echo '</div>';
        } echo '</details>';
    } echo '</div>';
}

function aes_admin_screen() {
    if (!current_user_can('manage_options')) return;
    $pages = array_filter((array) get_option('aes_page_ids', []), 'get_post');
    $jobs = wp_count_posts('aes_job');
    $requests = wp_count_posts('aes_submission');
    ?>
    <div class="wrap aes-admin-wrap aes-website-dashboard">
        <div class="aes-glass-banner">
            <span class="aes-glass-tag">WEBSITE MANAGEMENT</span>
            <h1 class="aes-banner-title">Akshar Engineering Website</h1>
            <p class="aes-banner-subtitle">Keep the website current. Edit page content, manage opportunities and review incoming requests from one place.</p>
            <div class="aes-dashboard-shortcuts">
                <a class="btn-glass btn-glass-orange" href="<?php echo esc_url(home_url('/')); ?>" target="_blank" rel="noopener">Preview website</a>
                <a class="btn-glass" href="<?php echo esc_url(admin_url('admin.php?page=aes-submissions')); ?>">Requests <strong><?php echo intval($requests->private ?? 0); ?></strong></a>
                <a class="btn-glass" href="<?php echo esc_url(admin_url('edit.php?post_type=aes_job')); ?>">Job listings <strong><?php echo intval($jobs->publish ?? 0); ?></strong></a>
                <a class="btn-glass" href="<?php echo esc_url(admin_url('edit.php')); ?>">Blog articles</a>
            </div>
        </div>
        <?php if (isset($_GET['ready']) || isset($_GET['saved'])): ?><div class="notice notice-success inline"><p><?php echo isset($_GET['ready']) ? 'Pages imported successfully.' : 'Settings saved.'; ?></p></div><?php endif; ?>
        <div class="aes-dashboard-grid">
            <section class="aes-dashboard-panel">
                <h2>Edit website pages <span class="aes-dashboard-count"><?php echo count($pages); ?></span></h2>
                <label for="aesPageSearch">Find a page</label><input type="search" id="aesPageSearch" class="widefat" placeholder="Search Home, Careers or an inspection service">
                <div class="aes-page-list">
                <?php foreach ($pages as $key => $id): ?>
                    <div class="aes-page-row" data-page-search="<?php echo esc_attr(strtolower(get_the_title($id) . ' ' . $key)); ?>">
                        <div><a href="<?php echo esc_url(get_edit_post_link($id)); ?>"><strong><?php echo esc_html(get_the_title($id)); ?></strong></a><small><?php echo str_starts_with($key, 'service-') ? 'Service detail' : 'Main page'; ?></small></div>
                        <div class="aes-page-actions"><a class="button" href="<?php echo esc_url(get_edit_post_link($id)); ?>">Edit</a><a href="<?php echo esc_url(get_permalink($id)); ?>" target="_blank" rel="noopener" aria-label="<?php echo esc_attr('Preview ' . get_the_title($id)); ?>">Preview</a></div>
                    </div>
                <?php endforeach; ?>
                <p id="aesPageSearchEmpty" hidden>No matching pages. Try another name.</p>
                </div>
            </section>
            <div>
                <section class="aes-dashboard-panel aes-editing-guide">
                    <h2>Make an update</h2>
                    <ol><li>Open a page and click the text or image you want to change.</li><li>Use the card toolbar to duplicate, move or remove a card. Select a Services card to change its category and search keywords.</li><li>For We Hear You, select the main block and open <strong>Request form copy</strong> in the block sidebar to edit each request type.</li><li>Click <strong>Save / Update</strong>, then preview the page.</li></ol>
                    <p>Header and footer edits are shared across all pages. Jobs are managed in <a href="<?php echo esc_url(admin_url('edit.php?post_type=aes_job')); ?>">AES Jobs</a>. Homepage video changes stay in WordPress until you choose another video.</p>
                    <p class="aes-dashboard-note">Advanced template tools can replace page edits. Use them only when intentionally restoring the theme's starting content.</p>
                </section>
                <section class="aes-dashboard-panel">
                    <h2>Email notifications</h2><p>Requests are always saved in Form Submissions. Email is currently <strong><?php echo get_option('aes_email_enabled') ? 'enabled' : 'disabled'; ?></strong>.</p>
                    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                        <?php wp_nonce_field('aes_email'); ?><input type="hidden" name="action" value="aes_email">
                        <label><input type="checkbox" name="enabled" value="1" <?php checked(get_option('aes_email_enabled', 0), 1); ?>> Notify the site administrator about new requests</label>
                        <p class="description">Keep this off during local testing. Configure your hosting email service before enabling it.</p>
                        <?php submit_button('Save notifications', 'secondary'); ?>
                    </form>
                </section>
            </div>
        </div>
        <section class="aes-dashboard-panel" id="policy-documents">
            <h2>Policy documents</h2><p>Four draft starter pages are ready for your approved content. Replace the prompts and publish when complete; the footer links then appear automatically. To use a PDF or another page, enter its full URL below. Leave the URL blank to use the WordPress page.</p>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('aes_policies'); ?><input type="hidden" name="action" value="aes_policies">
                <div class="aes-policy-grid">
                <?php $policy_ids = (array) get_option('aes_policy_page_ids', []); $urls = (array) get_option('aes_policy_urls', []);
                foreach (aes_policy_definitions() as $key => $definition): $id = intval($policy_ids[$key] ?? 0); ?>
                    <div class="aes-policy-setting"><label for="policy-<?php echo esc_attr($key); ?>"><?php echo esc_html($definition['title']); ?></label>
                        <?php if ($id && get_post($id)): ?><p><a href="<?php echo esc_url(get_edit_post_link($id)); ?>">Edit starter page</a> <span class="aes-dashboard-count"><?php echo esc_html(get_post_status($id)); ?></span></p><?php endif; ?>
                        <input type="url" class="widefat" id="policy-<?php echo esc_attr($key); ?>" name="policy_url[<?php echo esc_attr($key); ?>]" value="<?php echo esc_attr($urls[$key] ?? ''); ?>" placeholder="https://example.com/policy.pdf" aria-describedby="policy-url-help">
                    </div>
                <?php endforeach; ?>
                </div><p id="policy-url-help" class="description">An override URL takes priority over the starter page. Unpublished drafts without an override stay hidden from the footer.</p>
                <?php submit_button('Save document links', 'secondary'); ?>
            </form>
        </section>
        <?php aes_site_controls_form(); ?>
        <details class="aes-dashboard-panel aes-dashboard-advanced"><summary>Advanced setup</summary><p>Import any missing starter pages and job listings. Existing pages are retained.</p>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>"><?php wp_nonce_field('aes_setup'); ?><input type="hidden" name="action" value="aes_setup"><?php submit_button('Import missing AES pages', 'secondary', 'submit', false); ?></form>
        </details>
    </div>
    <?php
}

function aes_clean_values($defs,$raw){
    $out=[];foreach($defs as $k=>$d){if(!array_key_exists($k,$raw)||!is_scalar($raw[$k]))continue;
        $v=(string)$raw[$k];
        if(in_array($d['type'],['url','image'],true)){
            if(preg_match('/^@@(?:ASSET@@\/|PAGE:[a-zA-Z0-9_-]+@@)/',$v)) $v=sanitize_text_field($v);
            else $v=esc_url_raw($v);
        }else $v=sanitize_textarea_field($v);
        $out[$k]=$v;
    }return $out;
}

add_action('admin_post_aes_shared',function(){
    if(!current_user_can('manage_options'))wp_die('Not allowed',403);check_admin_referer('aes_shared');
    $raw=json_decode(wp_unslash($_POST['aes_values_json']??''),true);if(!is_array($raw))wp_die('Invalid content payload.');
    update_option('aes_shared_values',aes_clean_values(aes_data('shared'),$raw),false);wp_safe_redirect(admin_url('admin.php?page=aes-cms&saved=1'));exit;
});

add_action('admin_post_aes_email',function(){if(!current_user_can('manage_options'))wp_die('Not allowed',403);check_admin_referer('aes_email');update_option('aes_email_enabled',empty($_POST['enabled'])?0:1);wp_safe_redirect(admin_url('admin.php?page=aes-cms&saved=1'));exit;});

add_action('add_meta_boxes',function(){
    add_meta_box('aes-job','Job details',function($p){wp_nonce_field('aes_job','aes_job_nonce');$d=(array)get_post_meta($p->ID,'_aes_job',true);foreach(['type'=>'Employment / assignment type','location'=>'Location','experience'=>'Experience','skills'=>'Key skills'] as $k=>$label)echo '<p><label>'.esc_html($label).'<input class="widefat" name="aes_job['.esc_attr($k).']" value="'.esc_attr($d[$k]??'').'"></label></p>';},'aes_job','normal','high');
});

add_action('save_post',function($id){
    if(wp_is_post_revision($id)||wp_is_post_autosave($id)||!current_user_can('edit_post',$id))return;
    if(isset($_POST['aes_job_nonce'])&&wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['aes_job_nonce'])),'aes_job')){
        $d=[];foreach(['type','location','experience','skills'] as $k)$d[$k]=sanitize_text_field(wp_unslash($_POST['aes_job'][$k]??''));update_post_meta($id,'_aes_job',$d);
    }
});

add_action('admin_enqueue_scripts',function(){
    $screen=get_current_screen(); if(!$screen||!($screen->id==='toplevel_page_aes-cms'||$screen->id==='toplevel_page_aes-submissions'||in_array($screen->post_type,['aes_job','aes_submission','page'],true)))return;
    wp_enqueue_media(); wp_enqueue_script('aes-admin',get_template_directory_uri().'/assets/admin-cms.js',['jquery'], filemtime(AES_DIR . '/assets/admin-cms.js'),true);
    wp_enqueue_style('aes-admin',get_template_directory_uri().'/assets/admin-cms.css',[],filemtime(AES_DIR . '/assets/admin-cms.css'));
});
