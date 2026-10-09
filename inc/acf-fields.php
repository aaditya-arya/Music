<?php
/**
 * Register ACF Fields for Homepage
 */

if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array(
    'key' => 'group_homepage_content',
    'title' => 'Homepage Content',
    'fields' => array(
        
        // 1. Company Journey
        array(
            'key' => 'field_tab_journey',
            'label' => 'Company Journey',
            'name' => '',
            'type' => 'tab',
        ),
        array(
            'key' => 'field_journey_title',
            'label' => 'Journey Title',
            'name' => 'journey_title',
            'type' => 'text',
            'default_value' => 'Company Journey',
        ),
        array(
            'key' => 'field_journey_content',
            'label' => 'Journey Content',
            'name' => 'journey_content',
            'type' => 'wysiwyg',
            'media_upload' => 0,
            'default_value' => '<p><strong>Akshar Engineering Services Pvt. Ltd.</strong> (Formerly known as Akshar Consultancy Services) is a professional third-party inspection services and project support organization...</p>',
        ),
        array(
            'key' => 'field_journey_stats',
            'label' => 'Stats',
            'name' => 'journey_stats',
            'type' => 'repeater',
            'layout' => 'table',
            'sub_fields' => array(
                array(
                    'key' => 'field_stat_value',
                    'label' => 'Value',
                    'name' => 'value',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_stat_label',
                    'label' => 'Label',
                    'name' => 'label',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_stat_color',
                    'label' => 'Color Class',
                    'name' => 'color',
                    'type' => 'select',
                    'choices' => array(
                        'text-brand-blue' => 'Blue',
                        'text-brand-orange' => 'Orange',
                    )
                ),
            ),
        ),
        array(
            'key' => 'field_vision_title',
            'label' => 'Vision Title',
            'name' => 'vision_title',
            'type' => 'text',
            'default_value' => 'Our Vision',
        ),
        array(
            'key' => 'field_vision_desc',
            'label' => 'Vision Description',
            'name' => 'vision_desc',
            'type' => 'textarea',
        ),
        array(
            'key' => 'field_vision_list',
            'label' => 'Vision List Items',
            'name' => 'vision_list',
            'type' => 'repeater',
            'sub_fields' => array(
                array(
                    'key' => 'field_vision_list_text',
                    'label' => 'Text',
                    'name' => 'text',
                    'type' => 'text',
                ),
            ),
        ),
        array(
            'key' => 'field_vision_footer',
            'label' => 'Vision Footer',
            'name' => 'vision_footer',
            'type' => 'text',
        ),

        // 2. Core Services
        array(
            'key' => 'field_tab_services',
            'label' => 'Core Services',
            'name' => '',
            'type' => 'tab',
        ),
        array(
            'key' => 'field_services_title',
            'label' => 'Section Title',
            'name' => 'services_title',
            'type' => 'text',
            'default_value' => 'Core Services',
        ),
        array(
            'key' => 'field_services_subtitle',
            'label' => 'Section Subtitle',
            'name' => 'services_subtitle',
            'type' => 'text',
        ),
        array(
            'key' => 'field_services_cards',
            'label' => 'Service Cards',
            'name' => 'services_cards',
            'type' => 'repeater',
            'layout' => 'block',
            'sub_fields' => array(
                array(
                    'key' => 'field_sc_image',
                    'label' => 'Background Image',
                    'name' => 'image',
                    'type' => 'image',
                    'return_format' => 'url',
                ),
                array(
                    'key' => 'field_sc_title',
                    'label' => 'Title',
                    'name' => 'title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_sc_desc',
                    'label' => 'Description',
                    'name' => 'description',
                    'type' => 'textarea',
                ),
                array(
                    'key' => 'field_sc_link',
                    'label' => 'Link URL',
                    'name' => 'link',
                    'type' => 'url',
                ),
            ),
        ),

        // 3. Equipment Scope
        array(
            'key' => 'field_tab_equipment',
            'label' => 'Equipment Scope',
            'name' => '',
            'type' => 'tab',
        ),
        array(
            'key' => 'field_eq_title',
            'label' => 'Section Title',
            'name' => 'eq_title',
            'type' => 'text',
            'default_value' => 'Equipment & Asset Scope',
        ),
        array(
            'key' => 'field_eq_subtitle',
            'label' => 'Section Subtitle',
            'name' => 'eq_subtitle',
            'type' => 'text',
        ),
        array(
            'key' => 'field_eq_cards',
            'label' => 'Equipment Cards',
            'name' => 'eq_cards',
            'type' => 'repeater',
            'layout' => 'block',
            'sub_fields' => array(
                array(
                    'key' => 'field_eqc_num',
                    'label' => 'Number Badge',
                    'name' => 'number',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_eqc_title',
                    'label' => 'Title',
                    'name' => 'title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_eqc_desc',
                    'label' => 'Description',
                    'name' => 'description',
                    'type' => 'textarea',
                ),
                array(
                    'key' => 'field_eqc_list',
                    'label' => 'List Items',
                    'name' => 'list_items',
                    'type' => 'repeater',
                    'sub_fields' => array(
                        array(
                            'key' => 'field_eqc_list_text',
                            'label' => 'Text',
                            'name' => 'text',
                            'type' => 'text',
                        ),
                    ),
                ),
                array(
                    'key' => 'field_eqc_footer',
                    'label' => 'Footer (Standards)',
                    'name' => 'footer',
                    'type' => 'text',
                ),
            ),
        ),

        // 4. Sectors
        array(
            'key' => 'field_tab_sectors',
            'label' => 'Sectors We Serve',
            'name' => '',
            'type' => 'tab',
        ),
        array(
            'key' => 'field_sec_title',
            'label' => 'Section Title',
            'name' => 'sec_title',
            'type' => 'text',
            'default_value' => 'Sectors We Serve',
        ),
        array(
            'key' => 'field_sec_subtitle',
            'label' => 'Section Subtitle',
            'name' => 'sec_subtitle',
            'type' => 'text',
        ),
        array(
            'key' => 'field_sec_cards',
            'label' => 'Sector Cards',
            'name' => 'sec_cards',
            'type' => 'repeater',
            'layout' => 'block',
            'sub_fields' => array(
                array(
                    'key' => 'field_secc_image',
                    'label' => 'Background Image',
                    'name' => 'image',
                    'type' => 'image',
                    'return_format' => 'url',
                ),
                array(
                    'key' => 'field_secc_title',
                    'label' => 'Title',
                    'name' => 'title',
                    'type' => 'text',
                ),
                array(
                    'key' => 'field_secc_desc',
                    'label' => 'Description',
                    'name' => 'description',
                    'type' => 'textarea',
                ),
                array(
                    'key' => 'field_secc_link',
                    'label' => 'Link URL',
                    'name' => 'link',
                    'type' => 'url',
                ),
            ),
        ),

    ),
    'location' => array(
        array(
            array(
                'param' => 'page',
                'operator' => '==',
                'value' => '5',
            ),
        ),
    ),
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
    'label_placement' => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen' => array(
        0 => 'the_content', // Hide default editor
    ),
));

endif;
