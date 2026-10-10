<?php
require('../../../wp-load.php');
global $wpdb;
$results = $wpdb->get_results("SELECT post_id, meta_key, meta_value FROM {$wpdb->postmeta} WHERE meta_value LIKE '%Comprehensive surveillance, expediting%'");
print_r($results);
$results2 = $wpdb->get_results("SELECT option_name, option_value FROM {$wpdb->options} WHERE option_value LIKE '%Comprehensive surveillance, expediting%'");
print_r($results2);
