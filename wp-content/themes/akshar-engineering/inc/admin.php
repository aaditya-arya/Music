<?php
if (!defined('ABSPATH')) exit;
add_action('admin_menu',function(){add_menu_page('AES Website','AES Website','manage_options','aes-cms','aes_admin_screen','dashicons-admin-site-alt3',3);});
add_action('admin_notices',function(){if(current_user_can('manage_options')&&!get_option('aes_page_ids')) echo '<div class="notice notice-info"><p>Akshar Engineering CMS is active. Open <a href="'.esc_url(admin_url('admin.php?page=aes-cms')).'">AES Website</a> to import your original pages.</p></div>';});
function aes_controls($defs,$values) {
    echo '<div class="aes-controls"><p><input type="search" class="widefat aes-filter" placeholder="Find text, image or link…"></p><input type="hidden" name="aes_values_json" class="aes-json" value="">';
    $groups=[]; foreach($defs as $k=>$d) $groups[$d['group']][$k]=$d;
    foreach($groups as $group=>$items){
        echo '<details class="aes-group"><summary>'.esc_html($group).' <small>('.count($items).' fields)</small></summary>';
        foreach($items as $k=>$d){$v=array_key_exists($k,$values)?$values[$k]:$d['default'];
            echo '<div class="aes-row"><label for="aes-'.esc_attr($k).'"><strong>'.esc_html($d['label']).'</strong></label>';
            echo '<textarea id="aes-'.esc_attr($k).'" data-key="'.esc_attr($k).'" class="widefat aes-value" rows="'.($d['type']==='text'&&strlen($v)>100?3:1).'">'.esc_textarea($v).'</textarea>';
            if(in_array($d['type'],['image','url'],true)) echo '<button type="button" class="button aes-media">Choose from Media Library</button> <span class="description">Use a full URL, or keep the supplied automatic page/asset reference.</span>';
            echo '</div>';
        } echo '</details>';
    } echo '</div>';
}
function aes_admin_screen(){
    if(!current_user_can('manage_options')) return;
    echo '<div class="wrap"><h1>Akshar Engineering Website</h1><p>Edit content while retaining the original website layout.</p>';
    if(isset($_GET['ready']))echo '<div class="notice notice-success inline"><p>Pages imported. Home is now the front page.</p></div>';
    if(isset($_GET['saved']))echo '<div class="notice notice-success inline"><p>Shared content saved.</p></div>';
    echo '<h2>1. Import the existing website</h2><p>This creates the 22 supplied pages and six supplied job listings. It keeps existing pages and uses the imported Home as the front page. Re-running does not overwrite edits.</p><form method="post" action="'.esc_url(admin_url('admin-post.php')).'">';
    wp_nonce_field('aes_setup');echo '<input type="hidden" name="action" value="aes_setup">';submit_button('Import AES pages', 'primary', 'submit', false);echo '</form>';
    echo '<h2>2. Edit pages and jobs</h2><p>Open a page below, expand a content section, change its fields and click <strong>Update</strong>. Use <strong>AES Jobs</strong> to add, edit or unpublish vacancies. Incoming forms appear under <strong>AES Submissions</strong>.</p><ul>';
    foreach(get_option('aes_page_ids',[]) as $k=>$id) if(get_post($id))echo '<li><a href="'.esc_url(get_edit_post_link($id)).'">'.esc_html(get_the_title($id)).'</a> · <a target="_blank" rel="noopener" href="'.esc_url(get_permalink($id)).'">View</a></li>';
    echo '</ul><h2>3. Shared header, footer and contact content</h2><p>Changes to identical shared text or links apply across the imported pages. Phone text, telephone links and email links are separate fields; update each matching field.</p><form method="post" action="'.esc_url(admin_url('admin-post.php')).'">';
    wp_nonce_field('aes_shared');echo '<input type="hidden" name="action" value="aes_shared">';aes_controls(aes_data('shared'),get_option('aes_shared_values',[]));submit_button('Save shared content');echo '</form>';
    echo '<h2>4. Email notifications</h2><p>Submissions are saved even when email is disabled. Keep notifications disabled during local testing. Configure and test SMTP on your hosting before enabling them.</p><form method="post" action="'.esc_url(admin_url('admin-post.php')).'">';wp_nonce_field('aes_email');echo '<input type="hidden" name="action" value="aes_email"><label><input type="checkbox" name="enabled" value="1" '.checked(get_option('aes_email_enabled',0),1,false).'> Email the site administrator when a new submission is saved</label>';submit_button('Save notification setting');echo '</form></div>';
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
add_filter('use_block_editor_for_post',function($use,$post){return get_post_meta($post->ID,'_aes_layout',true)?false:$use;},10,2);
add_action('add_meta_boxes',function(){
    global $post;
    if($post&&$post->post_type==='page'&&get_post_meta($post->ID,'_aes_layout',true)){
        remove_post_type_support('page','editor');
        add_meta_box('aes-content','AES Page Content','aes_page_box','page','normal','high');
    }
    add_meta_box('aes-job','Job details',function($p){wp_nonce_field('aes_job','aes_job_nonce');$d=(array)get_post_meta($p->ID,'_aes_job',true);foreach(['type'=>'Employment / assignment type','location'=>'Location','experience'=>'Experience','skills'=>'Key skills'] as $k=>$label)echo '<p><label>'.esc_html($label).'<input class="widefat" name="aes_job['.esc_attr($k).']" value="'.esc_attr($d[$k]??'').'"></label></p>';},'aes_job','normal','high');
});
function aes_page_box($p){wp_nonce_field('aes_page','aes_page_nonce');echo '<p>Expand a section to edit its text, images and links. Layout and animations are preserved. Click Update to save. Shared navigation and footer content are under AES Website.</p>'; $v=get_post_meta($p->ID,'_aes_values',true);aes_controls(aes_fields(get_post_meta($p->ID,'_aes_layout',true)),is_array($v)?$v:[]);}
add_action('save_post',function($id){
    if(wp_is_post_revision($id)||wp_is_post_autosave($id)||!current_user_can('edit_post',$id))return;
    if(isset($_POST['aes_page_nonce'])&&wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['aes_page_nonce'])),'aes_page')){
        $raw=json_decode(wp_unslash($_POST['aes_values_json']??''),true);$key=get_post_meta($id,'_aes_layout',true);
        if(is_array($raw)&&isset(aes_data('manifest')[$key]))update_post_meta($id,'_aes_values',aes_clean_values(aes_fields($key),$raw));
    }
    if(isset($_POST['aes_job_nonce'])&&wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['aes_job_nonce'])),'aes_job')){
        $d=[];foreach(['type','location','experience','skills'] as $k)$d[$k]=sanitize_text_field(wp_unslash($_POST['aes_job'][$k]??''));update_post_meta($id,'_aes_job',$d);
    }
});
add_action('admin_enqueue_scripts',function(){
    $screen=get_current_screen(); if(!$screen||!($screen->id==='toplevel_page_aes-cms'||in_array($screen->post_type,['page','aes_job'],true)))return;
    wp_enqueue_media(); wp_enqueue_script('aes-admin',get_template_directory_uri().'/assets/admin-cms.js',['jquery'], '2.0',true);
    wp_enqueue_style('aes-admin',get_template_directory_uri().'/assets/admin-cms.css',[],'2.0');
});
