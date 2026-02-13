<?php
/**
 * Custom Taxonomies: Device Type, Ticket Status.
 *
 * @package ComputerAllyCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'ca_register_taxonomies' );

function ca_register_taxonomies() {

	/* ── Device Type ───────────────────────── */
	register_taxonomy( 'ca_device_type', 'ca_device', [
		'labels' => [
			'name'          => __( 'Device Types', 'ca-core' ),
			'singular_name' => __( 'Device Type', 'ca-core' ),
			'menu_name'     => __( 'Device Types', 'ca-core' ),
		],
		'public'            => false,
		'show_ui'           => true,
		'show_in_rest'      => true,
		'hierarchical'      => true,
		'show_admin_column' => true,
	] );

	// Seed default device types on first run
	$types = [ 'Laptop', 'Desktop', 'Tablet', 'Other' ];
	foreach ( $types as $type ) {
		if ( ! term_exists( $type, 'ca_device_type' ) ) {
			wp_insert_term( $type, 'ca_device_type' );
		}
	}
}
