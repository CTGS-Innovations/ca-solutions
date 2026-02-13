<?php
/**
 * Plugin Name: Computer Ally Core
 * Plugin URI:  https://computerally.com
 * Description: Repair ticket tracking, QR codes, customer portal, and admin tools for Computer Ally.
 * Version:     1.0.0
 * Author:      Computer Ally
 * Author URI:  https://computerally.com
 * Text Domain: ca-core
 * Requires at least: 6.0
 * Requires PHP: 8.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ────────────────────────────────────────────
   CONSTANTS
   ──────────────────────────────────────────── */

define( 'CA_CORE_VERSION', '1.0.0' );
define( 'CA_CORE_PATH', plugin_dir_path( __FILE__ ) );
define( 'CA_CORE_URL', plugin_dir_url( __FILE__ ) );
define( 'CA_SLA_THRESHOLD_HOURS', 48 );

/* ────────────────────────────────────────────
   INCLUDES
   ──────────────────────────────────────────── */

require_once CA_CORE_PATH . 'includes/post-types.php';
require_once CA_CORE_PATH . 'includes/taxonomies.php';
require_once CA_CORE_PATH . 'includes/meta-fields.php';
require_once CA_CORE_PATH . 'includes/shortcodes.php';
require_once CA_CORE_PATH . 'includes/qr-codes.php';
require_once CA_CORE_PATH . 'includes/rest-api.php';
require_once CA_CORE_PATH . 'includes/repair-statuses.php';
require_once CA_CORE_PATH . 'includes/admin/dashboard.php';
require_once CA_CORE_PATH . 'includes/admin/ticket-columns.php';

/* ────────────────────────────────────────────
   ACTIVATION / DEACTIVATION
   ──────────────────────────────────────────── */

register_activation_hook( __FILE__, 'ca_core_activate' );

function ca_core_activate() {
	ca_register_post_types();
	ca_register_taxonomies();
	flush_rewrite_rules();

	// Create the repair status page if it doesn't exist
	if ( ! get_page_by_path( 'repair-status' ) ) {
		wp_insert_post( [
			'post_title'   => 'Repair Status',
			'post_name'    => 'repair-status',
			'post_content' => '[ca_repair_status]',
			'post_status'  => 'publish',
			'post_type'    => 'page',
		] );
	}
}

register_deactivation_hook( __FILE__, 'ca_core_deactivate' );

function ca_core_deactivate() {
	flush_rewrite_rules();
}

/* ────────────────────────────────────────────
   ENQUEUE PLUGIN ASSETS
   ──────────────────────────────────────────── */

add_action( 'wp_enqueue_scripts', 'ca_core_enqueue_frontend' );

function ca_core_enqueue_frontend() {
	wp_enqueue_style(
		'ca-core-frontend',
		CA_CORE_URL . 'assets/css/frontend.css',
		[],
		CA_CORE_VERSION
	);

	wp_enqueue_script(
		'ca-core-frontend',
		CA_CORE_URL . 'assets/js/frontend.js',
		[],
		CA_CORE_VERSION,
		true
	);

	wp_localize_script( 'ca-core-frontend', 'caCore', [
		'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
		'restUrl'  => rest_url( 'ca/v1/' ),
		'nonce'    => wp_create_nonce( 'wp_rest' ),
		'siteUrl'  => home_url(),
	] );
}

add_action( 'admin_enqueue_scripts', 'ca_core_enqueue_admin' );

function ca_core_enqueue_admin( $hook ) {
	$screen = get_current_screen();
	if ( $screen && in_array( $screen->post_type, [ 'ca_ticket', 'ca_customer', 'ca_device' ], true ) ) {
		wp_enqueue_style(
			'ca-core-admin',
			CA_CORE_URL . 'assets/css/admin.css',
			[],
			CA_CORE_VERSION
		);
		wp_enqueue_script(
			'ca-core-admin',
			CA_CORE_URL . 'assets/js/admin.js',
			[ 'jquery' ],
			CA_CORE_VERSION,
			true
		);
	}
}

/* ────────────────────────────────────────────
   CUSTOM REWRITE FOR /repair/{token}
   ──────────────────────────────────────────── */

add_action( 'init', 'ca_core_rewrite_rules' );

function ca_core_rewrite_rules() {
	add_rewrite_rule(
		'^repair/([a-zA-Z0-9_-]+)/?$',
		'index.php?pagename=repair-status&ca_token=$matches[1]',
		'top'
	);
	add_rewrite_tag( '%ca_token%', '([a-zA-Z0-9_-]+)' );
}
