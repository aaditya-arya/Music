<?php
if (!defined('ABSPATH')) exit;
add_action('wp_ajax_aes_submit','aes_submit');add_action('wp_ajax_nopriv_aes_submit','aes_submit');
function aes_submit(){
    if(!check_ajax_referer('aes_submit','nonce',false))wp_send_json_error(['message'=>'This page has expired. Refresh and submit again.'],403);
    $form=sanitize_key(wp_unslash($_POST['form']??''));$schema=aes_data('forms')[$form]??null;
    if(!$schema)wp_send_json_error(['message'=>'Unknown form.'],400);
    if(!empty($_POST['website']))wp_send_json_error(['message'=>'Submission rejected.'],400);
    $ip=$_SERVER['REMOTE_ADDR']??'unknown';$rate='aes_rate_'.hash_hmac('sha256',$ip,wp_salt());$count=(int)get_transient($rate);
    if($count>=10)wp_send_json_error(['message'=>'Too many submissions. Please try again in 15 minutes.'],429);
    $raw=json_decode(wp_unslash($_POST['fields']??''),true);
    if(!is_array($raw)||count($raw)>60||strlen(wp_unslash($_POST['fields']??''))>60000)wp_send_json_error(['message'=>'Invalid form data.'],400);
    $clean=[];$map=[];$email='';
    foreach($raw as $f){if(!is_array($f))continue;$name=sanitize_key($f['name']??'');$value=sanitize_textarea_field((string)($f['value']??''));$label=sanitize_text_field((string)($f['label']??$name));
        if(strlen($value)>10000)wp_send_json_error(['message'=>'One field is too long.'],400);
        $map[$name]=$value;$clean[]=['label'=>$label,'value'=>$value];
    }
    foreach($schema['fields'] as $d){$v=$map[sanitize_key($d['name'])]??'';
        if($d['required']&&$d['type']!=='file'&&trim($v)==='')wp_send_json_error(['message'=>'Please complete: '.$d['label']],400);
        if($d['type']==='email'&&$v!==''){if(!is_email($v))wp_send_json_error(['message'=>'Please enter a valid email address.'],400);$email=sanitize_email($v);}
    }
    if(!$clean)wp_send_json_error(['message'=>'Complete the form before submitting.'],400);
    $files=[];$total=0;
    foreach($_FILES as $f){
        if(is_array($f['name']??null))wp_send_json_error(['message'=>'Invalid attachment.'],400);
        if(($f['error']??UPLOAD_ERR_NO_FILE)===UPLOAD_ERR_NO_FILE)continue;
        if($f['error']!==UPLOAD_ERR_OK||!is_uploaded_file($f['tmp_name']))wp_send_json_error(['message'=>'Attachment upload failed.'],400);
        $total+=(int)$f['size'];if($f['size']>2*1024*1024||$total>5*1024*1024)wp_send_json_error(['message'=>'Each attachment must be under 2 MB; total under 5 MB.'],400);
        $name=sanitize_file_name($f['name']);$ext=strtolower(pathinfo($name,PATHINFO_EXTENSION));$bytes=file_get_contents($f['tmp_name']);$mime='';
        if($ext==='pdf'&&str_starts_with($bytes,'%PDF-'))$mime='application/pdf';
        elseif(in_array($ext,['jpg','jpeg','png'],true)){$im=@getimagesize($f['tmp_name']);if($im&&in_array($im['mime'],['image/jpeg','image/png'],true))$mime=$im['mime'];}
        if(!$mime)wp_send_json_error(['message'=>'Attachments must be PDF, JPG or PNG files.'],400);
        $files[]=['name'=>$name,'mime'=>$mime,'data'=>base64_encode($bytes)];
    }
    $id=wp_insert_post(['post_type'=>'aes_submission','post_status'=>'private','post_title'=>$schema['title'].' — '.current_time('Y-m-d H:i:s'),'meta_input'=>['_aes_details'=>$clean,'_aes_form'=>$form,'_aes_files'=>$files]],true);
    if(is_wp_error($id)||!$id)wp_send_json_error(['message'=>'Your submission could not be saved. Please try again.'],500);
    set_transient($rate,$count+1,15*MINUTE_IN_SECONDS);
    if(get_option('aes_email_enabled')){
        $ok=wp_mail(get_option('admin_email'),'New AES website submission #'.$id,'A new submission is saved in your WordPress dashboard.\n'.admin_url('post.php?post='.$id.'&action=edit'));
        update_post_meta($id,'_aes_notification',$ok?'Accepted by mail system (delivery not confirmed)':'Mail system rejected notification');
    }else update_post_meta($id,'_aes_notification','Disabled — submission saved in WordPress');
    wp_send_json_success(['message'=>'Your submission has been saved. Reference: AES-'.$id.'.']);
}
add_action('add_meta_boxes',function(){add_meta_box('aes-details','Submitted details',function($p){
    if(!current_user_can('manage_options'))return;
    echo '<p><strong>Notification:</strong> '.esc_html(get_post_meta($p->ID,'_aes_notification',true)).'</p><table class="widefat striped"><tbody>';
    foreach((array)get_post_meta($p->ID,'_aes_details',true) as $r)echo '<tr><th>'.esc_html($r['label']).'</th><td style="white-space:pre-wrap">'.esc_html($r['value']).'</td></tr>';
    echo '</tbody></table><h3>Private attachments</h3>';
    foreach((array)get_post_meta($p->ID,'_aes_files',true) as $i=>$f){$url=wp_nonce_url(admin_url('admin-post.php?action=aes_download&id='.$p->ID.'&file='.$i),'aes_download_'.$p->ID);echo '<p><a href="'.esc_url($url).'">'.esc_html($f['name']).'</a></p>';}
},'aes_submission','normal','high');});
add_action('admin_post_aes_download',function(){
    if(!current_user_can('manage_options'))wp_die('Not allowed',403);$id=absint($_GET['id']??0);check_admin_referer('aes_download_'.$id);
    if(get_post_type($id)!=='aes_submission')wp_die('Not found',404);
    $files=(array)get_post_meta($id,'_aes_files',true);$f=$files[absint($_GET['file']??0)]??null;if(!$f)wp_die('Not found',404);
    nocache_headers();header('X-Content-Type-Options: nosniff');header('Content-Type: '.$f['mime']);header('Content-Disposition: attachment; filename="'.sanitize_file_name($f['name']).'"');echo base64_decode($f['data']);exit;
});
