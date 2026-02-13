<?php
/**
 * Custom Post Types: Tickets, Customers, Devices.
 *
 * @package ComputerAllyCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'ca_register_post_types' );

function ca_register_post_types() {

	/* ── Repair Tickets ────────────────────── */
	register_post_type( 'ca_ticket', [
		'labels' => [
			'name'               => __( 'Tickets', 'ca-core' ),
			'singular_name'      => __( 'Ticket', 'ca-core' ),
			'add_new'            => __( 'New Ticket', 'ca-core' ),
			'add_new_item'       => __( 'Create Ticket', 'ca-core' ),
			'edit_item'          => __( 'Edit Ticket', 'ca-core' ),
			'view_item'          => __( 'View Ticket', 'ca-core' ),
			'search_items'       => __( 'Search Tickets', 'ca-core' ),
			'not_found'          => __( 'No tickets found.', 'ca-core' ),
			'not_found_in_trash' => __( 'No tickets in trash.', 'ca-core' ),
			'menu_name'          => __( 'Repair Tickets', 'ca-core' ),
		],
		'public'             => false,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'show_in_rest'       => true,
		'rest_base'          => 'tickets',
		'menu_icon'          => 'dashicons-clipboard',
		'menu_position'      => 25,
		'supports'           => [ 'title', 'custom-fields' ],
		'capability_type'    => 'post',
		'has_archive'        => false,
		'rewrite'            => false,
	] );

	/* ── Customers ─────────────────────────── */
	register_post_type( 'ca_customer', [
		'labels' => [
			'name'               => __( 'Customers', 'ca-core' ),
			'singular_name'      => __( 'Customer', 'ca-core' ),
			'add_new_item'       => __( 'Add Customer', 'ca-core' ),
			'edit_item'          => __( 'Edit Customer', 'ca-core' ),
			'search_items'       => __( 'Search Customers', 'ca-core' ),
			'not_found'          => __( 'No customers found.', 'ca-core' ),
			'menu_name'          => __( 'Customers', 'ca-core' ),
		],
		'public'             => false,
		'show_ui'            => true,
		'show_in_menu'       => 'edit.php?post_type=ca_ticket',
		'show_in_rest'       => true,
		'rest_base'          => 'customers',
		'supports'           => [ 'title', 'custom-fields' ],
		'capability_type'    => 'post',
		'has_archive'        => false,
		'rewrite'            => false,
	] );

	/* ── Devices ───────────────────────────── */
	register_post_type( 'ca_device', [
		'labels' => [
			'name'               => __( 'Devices', 'ca-core' ),
			'singular_name'      => __( 'Device', 'ca-core' ),
			'add_new_item'       => __( 'Add Device', 'ca-core' ),
			'edit_item'          => __( 'Edit Device', 'ca-core' ),
			'search_items'       => __( 'Search Devices', 'ca-core' ),
			'not_found'          => __( 'No devices found.', 'ca-core' ),
			'menu_name'          => __( 'Devices', 'ca-core' ),
		],
		'public'             => false,
		'show_ui'            => true,
		'show_in_menu'       => 'edit.php?post_type=ca_ticket',
		'show_in_rest'       => true,
		'rest_base'          => 'devices',
		'supports'           => [ 'title', 'custom-fields' ],
		'capability_type'    => 'post',
		'has_archive'        => false,
		'rewrite'            => false,
	] );
}
