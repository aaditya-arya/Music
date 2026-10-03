<?php
if (!defined('ABSPATH')) exit;
define('AES_DIR', get_template_directory());
function aes_data($name) {
    static $cache = [];
    if (!isset($cache[$name])) $cache[$name] = json_decode(file_get_contents(AES_DIR . '/data/' . $name . '.json'), true) ?: [];
    return $cache[$name];
}
add_action('after_setup_theme', function () {
    add_theme_support('title-tag'); add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form','gallery','caption','style','script']);
});
function aes_page_url($key) {
    if ($key === 'home') return home_url('/');
    if ($key === 'admin') return admin_url();
    $ids = get_option('aes_page_ids', []);
    return !empty($ids[$key]) && get_post_status($ids[$key]) === 'publish' ? get_permalink($ids[$key]) : home_url('/' . $key . '/');
}
function aes_resolve($value) {
    $value = str_replace('@@ASSET@@', untrailingslashit(get_template_directory_uri()), $value);
    return preg_replace_callback('/@@PAGE:([a-zA-Z0-9_-]+)@@/', function ($m) { return aes_page_url($m[1]); }, $value);
}
function aes_current_key() { 
    $meta = get_post_meta(get_queried_object_id(), '_aes_layout', true);
    if ($meta && isset(aes_data('manifest')[$meta])) return $meta;
    $post = get_queried_object();
    if ($post && !empty($post->post_name) && isset(aes_data('manifest')[$post->post_name])) {
        return $post->post_name;
    }
    if (is_front_page()) return 'home';

    $path = trim(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH), '/');
    $slug = basename($path);
    if ($slug && isset(aes_data('manifest')[$slug])) {
        return $slug;
    }
    if ($path && isset(aes_data('manifest')[$path])) {
        return $path;
    }
    return '';
}
add_action('template_redirect', function () {
    $key = aes_current_key();
    if ($key && isset(aes_data('manifest')[$key]) && is_404()) {
        global $wp_query;
        $wp_query->is_404 = false;
        status_header(200);
    }
});
function aes_fields($key) { $data = aes_data($key); return $data['fields'] ?? []; }
function aes_render($key) {
    if (!isset(aes_data('manifest')[$key])) return '';
    $html = file_get_contents(AES_DIR . '/templates/' . $key . '.html');
    $page = get_post_meta(get_queried_object_id(), '_aes_values', true); $page = is_array($page) ? $page : [];
    $shared = get_option('aes_shared_values', []);
    $defs = array_merge(aes_fields($key), aes_data('shared')); $values = array_merge($page, $shared);
    $html = preg_replace_callback('/@@JSFIELD:([a-zA-Z0-9_-]+)@@/', function ($m) use ($defs, $values) {
        $v = $values[$m[1]] ?? ($defs[$m[1]]['default'] ?? '');
        return wp_json_encode(aes_resolve($v), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    }, $html);
    $html = preg_replace_callback('/@@FIELD:([a-zA-Z0-9_-]+)@@/', function ($m) use ($defs, $values) {
        if (!isset($defs[$m[1]])) return '';
        $d = $defs[$m[1]]; $v = array_key_exists($m[1], $values) ? $values[$m[1]] : $d['default'];
        $v = aes_resolve($v);
        return in_array($d['type'], ['url','image'], true) ? esc_url($v) : esc_html($v);
    }, $html);
    $html = str_replace(['@@JOBS@@','@@JOB_OPTIONS@@','@@AJAX@@'], [aes_job_cards(),aes_job_options(),esc_url(admin_url('admin-ajax.php'))], $html);
    return aes_resolve($html);
}
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('aes-utilities', get_template_directory_uri().'/assets/compiled.css', [], '2.0');
    wp_enqueue_style('aes-site', get_template_directory_uri().'/assets/site.css', ['aes-utilities'], '2.0');
    wp_enqueue_style('aes-fonts', 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap', [], null);
    wp_enqueue_script('aes-site', get_template_directory_uri().'/assets/site.js', [], '2.0', true);
    wp_localize_script('aes-site', 'AES', ['theme'=>get_template_directory_uri(),'ajax'=>admin_url('admin-ajax.php'),'nonce'=>wp_create_nonce('aes_submit')]);
    wp_enqueue_script('aes-flipbook', get_template_directory_uri().'/assets/flipbook-reader.js', ['aes-site'], '2.0', true);
    wp_enqueue_script('aes-forms', get_template_directory_uri().'/assets/forms.js', ['aes-site'], '2.0', true);
    wp_add_inline_style('aes-site', '#wpadminbar{position:fixed!important;top:0!important}.admin-bar > header{top:32px}.aes-form-status{padding:12px;margin-top:12px;font-size:14px}.aes-form-status[data-error="true"]{color:#b91c1c}.aes-form-status[data-error="false"]{color:#166534}.aes-trap{position:absolute!important;left:-9999px!important}.aes-generic{max-width:1100px;margin:auto;padding:60px 24px}.aes-generic h1{font-size:40px;font-weight:800}.aes-generic p{margin:16px 0}@media(max-width:782px){.admin-bar > header{top:46px}}');
});
require AES_DIR.'/inc/admin.php';
require AES_DIR.'/inc/submissions.php';
function aes_register_types() {
    register_post_type('aes_job', ['labels'=>['name'=>'AES Jobs','singular_name'=>'Job','add_new_item'=>'Add job'],'public'=>false,'show_ui'=>true,'show_in_rest'=>true,'supports'=>['title','editor','revisions'],'menu_icon'=>'dashicons-businessperson']);
    register_post_type('aes_submission', ['labels'=>['name'=>'AES Submissions','singular_name'=>'Submission'],'public'=>false,'publicly_queryable'=>false,'show_ui'=>true,'show_in_rest'=>false,'supports'=>['title'],'menu_icon'=>'dashicons-email-alt','capabilities'=>['edit_post'=>'manage_options','read_post'=>'manage_options','delete_post'=>'manage_options','edit_posts'=>'manage_options','edit_others_posts'=>'manage_options','publish_posts'=>'manage_options','read_private_posts'=>'manage_options','delete_posts'=>'manage_options','delete_private_posts'=>'manage_options','delete_published_posts'=>'manage_options','delete_others_posts'=>'manage_options','edit_private_posts'=>'manage_options','edit_published_posts'=>'manage_options','create_posts'=>'do_not_allow'],'map_meta_cap'=>false]);
}
add_action('init', function () {
    aes_register_types();
    $ids = get_option('aes_page_ids', []);
    $manifest = aes_data('manifest');
    $needs_sync = false;
    foreach ($manifest as $key => $d) {
        if (empty($ids[$key]) || !get_post($ids[$key])) {
            $needs_sync = true;
            break;
        }
    }
    if ($needs_sync) {
        aes_setup_pages();
    }
});
function aes_job_cards() {
    $jobs=get_posts(['post_type'=>'aes_job','post_status'=>'publish','numberposts'=>-1,'orderby'=>'date','order'=>'ASC']);
    if (!$jobs) return '<p>No vacancies are currently published. You can submit a general application below.</p>';
    $html='';
    foreach ($jobs as $job) {
        $d=(array)get_post_meta($job->ID,'_aes_job',true);
        $html.='<article class="bouncy-card bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between"><div><div class="flex items-center justify-between gap-2 mb-4"><span class="bg-orange-100 text-brand-orange text-[11px] font-extrabold px-3 py-1 rounded-full">'.esc_html($d['type']??'').'</span><span class="text-xs text-slate-400">'.esc_html($d['location']??'').'</span></div><h3 class="text-lg font-black text-brand-dark mb-2">'.esc_html($job->post_title).'</h3><div class="text-xs text-slate-600 leading-relaxed mb-4">'.wp_kses_post(wpautop($job->post_content)).'</div><p class="text-xs text-slate-500"><strong>Experience:</strong> '.esc_html($d['experience']??'').'</p><p class="text-xs text-slate-500"><strong>Key skills:</strong> '.esc_html($d['skills']??'').'</p></div><div class="mt-6 pt-4 border-t border-slate-100"><button type="button" data-aes-role="'.esc_attr($job->post_title).'" class="bouncy-btn w-full btn-premium-orange py-3 rounded-xl text-xs font-bold uppercase">Apply for this role →</button></div></article>';
    } return $html;
}
function aes_job_options() {
    $html='<option value="">Select a role</option>';
    foreach(get_posts(['post_type'=>'aes_job','numberposts'=>-1,'post_status'=>'publish']) as $j) $html.='<option>'.esc_html($j->post_title).'</option>';
    return $html.'<option>General application / Other</option>';
}
function aes_setup_pages() {
    $ids=get_option('aes_page_ids',[]);
    foreach(aes_data('manifest') as $key=>$d) {
        if (!empty($ids[$key]) && get_post($ids[$key])) continue;
        $existing=get_posts(['post_type'=>'page','post_status'=>'any','meta_key'=>'_aes_layout','meta_value'=>$key,'numberposts'=>1]);
        if($existing){$ids[$key]=$existing[0]->ID;continue;}
        $id=wp_insert_post(['post_type'=>'page','post_status'=>'publish','post_title'=>$d['title'],'post_name'=>$key,'meta_input'=>['_aes_layout'=>$key]],true);
        if(is_wp_error($id)) return $id;
        $ids[$key]=$id;
    }
    update_option('aes_page_ids',$ids,false);
    update_option('show_on_front','page'); update_option('page_on_front',$ids['home']);
    if(!get_option('aes_jobs_seeded')) {
        foreach(aes_data('jobs') as $d) wp_insert_post(['post_type'=>'aes_job','post_status'=>'publish','post_title'=>$d['title'],'post_content'=>$d['description'],'meta_input'=>['_aes_job'=>['type'=>$d['type'],'location'=>$d['location'],'experience'=>$d['experience'],'skills'=>$d['skills']]]]);
        update_option('aes_jobs_seeded',1,false);
    }
    return $ids;
}
add_action('admin_post_aes_setup',function(){
    if(!current_user_can('manage_options')) wp_die('Not allowed',403);
    check_admin_referer('aes_setup'); $r=aes_setup_pages();
    if(is_wp_error($r)) wp_die(esc_html($r->get_error_message()));
    wp_safe_redirect(admin_url('admin.php?page=aes-cms&ready=1'));exit;
});
