<?php
/**
 * Akshar Engineering Services Theme Functions
 *
 * @package Akshar_Theme
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * 1. Theme Setup
 */
function akshar_theme_setup() {
    // Add title tag support
    add_theme_support('title-tag');

    // Add post thumbnail / featured images support
    add_theme_support('post-thumbnails');

    // Add custom logo support
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 350,
        'flex-height' => true,
        'flex-width'  => true,
    ));

    // Add HTML5 support
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));

    // Register primary navigation menus
    register_nav_menus(array(
        'primary-menu' => __('Primary Navigation Menu', 'akshar-theme'),
        'services-menu' => __('Services Mega Dropdown Menu', 'akshar-theme'),
        'footer-menu'  => __('Footer Navigation Menu', 'akshar-theme'),
    ));
}
add_action('after_setup_theme', 'akshar_theme_setup');

/**
 * 2. Enqueue Stylesheets & Scripts
 */
function akshar_enqueue_scripts() {
    // Google Fonts: Plus Jakarta Sans
    wp_enqueue_style(
        'akshar-google-fonts',
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap',
        array(),
        null
    );

    // Tailwind CSS Play CDN
    wp_enqueue_script('akshar-tailwind', 'https://cdn.tailwindcss.com', array(), '3.4.1', false);

    // Tailwind Inline Configuration
    wp_add_inline_script('akshar-tailwind', "
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            blue: '#1b3574',
                            dark: '#11224d',
                            navy: '#0b1633',
                            orange: '#f16826',
                            lightOrange: '#f3834d',
                            amber: '#fbbf24'
                        }
                    },
                    fontFamily: {
                        sans: ['\"Plus Jakarta Sans\"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
                    }
                }
            }
        }
    ");

    // Theme Main CSS
    wp_enqueue_style(
        'akshar-site-css',
        get_template_directory_uri() . '/assets/site.css',
        array('akshar-google-fonts'),
        filemtime(get_template_directory() . '/assets/site.css')
    );

    // Theme Main JS
    wp_enqueue_script(
        'akshar-site-js',
        get_template_directory_uri() . '/assets/site.js',
        array(),
        filemtime(get_template_directory() . '/assets/site.js'),
        true
    );

    // Native Interactive Flipbook Reader
    wp_enqueue_script(
        'akshar-flipbook-js',
        get_template_directory_uri() . '/assets/flipbook-reader.js',
        array(),
        filemtime(get_template_directory() . '/assets/flipbook-reader.js'),
        true
    );
}
add_action('wp_enqueue_scripts', 'akshar_enqueue_scripts');

/**
 * 3. Customizer Settings for Dynamic Content (Brochure PDF, Heyzine Flipbook, Contact Info)
 */
function akshar_customizer_settings($wp_customize) {
    // AES Settings Section
    $wp_customize->add_section('akshar_company_settings', array(
        'title'       => __('AES Company & Brochure Settings', 'akshar-theme'),
        'priority'    => 30,
        'description' => __('Manage corporate contact details, brochure PDF, and interactive Heyzine flipbook URL.', 'akshar-theme')
    ));

    // Brochure PDF URL Setting
    $wp_customize->add_setting('brochure_pdf_url', array(
        'default'           => get_template_directory_uri() . '/assets/Company Profile.pdf',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('brochure_pdf_url', array(
        'label'    => __('Brochure PDF Download URL', 'akshar-theme'),
        'section'  => 'akshar_company_settings',
        'type'     => 'url',
    ));

    // Heyzine Flipbook URL Setting
    $wp_customize->add_setting('brochure_flipbook_url', array(
        'default'           => 'https://heyzine.com/flip-book/4b6632ed19.html',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('brochure_flipbook_url', array(
        'label'    => __('Interactive Heyzine Flipbook URL', 'akshar-theme'),
        'section'  => 'akshar_company_settings',
        'type'     => 'url',
    ));

    // Phone Number Setting
    $wp_customize->add_setting('company_phone', array(
        'default'           => '+91 8200441159',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('company_phone', array(
        'label'    => __('Company Contact Phone', 'akshar-theme'),
        'section'  => 'akshar_company_settings',
        'type'     => 'text',
    ));

    // Email Setting
    $wp_customize->add_setting('company_email', array(
        'default'           => 'info@aksharengineeringservices.com',
        'sanitize_callback' => 'sanitize_email',
    ));
    $wp_customize->add_control('company_email', array(
        'label'    => __('Company Contact Email', 'akshar-theme'),
        'section'  => 'akshar_company_settings',
        'type'     => 'email',
    ));
}
add_action('customize_register', 'akshar_customizer_settings');

/**
 * 4. Helper Function: Get Asset URL
 */
function akshar_asset($path) {
    return get_template_directory_uri() . '/assets/' . ltrim($path, '/');
}
