<?php
/**
 * REST API endpoints for front-end interactions.
 *
 * Namespace: ca/v1
 *
 * Public (no auth required):
 *   GET  /ca/v1/repair/{token}         — Get ticket data by public token
 *   POST /ca/v1/repair/{token}/addon   — Customer requests an add-on
 *
 * Admin (requires edit_posts):
 *   POST /ca/v1/tickets/{id}/status    — Update ticket status
 *   POST /ca/v1/tickets/{id}/checklist — Toggle a checklist item
 *   POST /ca/v1/tickets/{id}/note      — Add update log entry
 *   POST /ca/v1/tickets/{id}/addon     — Respond to add-on request
 *
 * @package ComputerAllyCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'rest_api_init', 'ca_register_rest_routes' );

function ca_register_rest_routes() {

	/* ── Public: Get repair status ─────────── */
	register_rest_route( 'ca/v1', '/repair/(?P<token>[a-zA-Z0-9_-]+)', [
		'methods'             => 'GET',
		'callback'            => 'ca_api_get_repair',
		'permission_callback' => '__return_true',
	] );

	/* ── Public: Request add-on ────────────── */
	register_rest_route( 'ca/v1', '/repair/(?P<token>[a-zA-Z0-9_-]+)/addon', [
		'methods'             => 'POST',
		'callback'            => 'ca_api_request_addon',
		'permission_callback' => '__return_true',
	] );

	/* ── Admin: Update status ──────────────── */
	register_rest_route( 'ca/v1', '/tickets/(?P<id>\d+)/status', [
		'methods'             => 'POST',
		'callback'            => 'ca_api_update_status',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
	] );

	/* ── Admin: Toggle checklist item ──────── */
	register_rest_route( 'ca/v1', '/tickets/(?P<id>\d+)/checklist', [
		'methods'             => 'POST',
		'callback'            => 'ca_api_toggle_checklist',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
	] );

	/* ── Admin: Add note ───────────────────── */
	register_rest_route( 'ca/v1', '/tickets/(?P<id>\d+)/note', [
		'methods'             => 'POST',
		'callback'            => 'ca_api_add_note',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
	] );

	/* ── Admin: Respond to add-on ──────────── */
	register_rest_route( 'ca/v1', '/tickets/(?P<id>\d+)/addon', [
		'methods'             => 'POST',
		'callback'            => 'ca_api_respond_addon',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
	] );
}

/* ────────────────────────────────────────────
   CALLBACK: Get repair data (public)
   ──────────────────────────────────────────── */

function ca_api_get_repair( $request ) {
	$token = $request->get_param( 'token' );

	$tickets = get_posts( [
		'post_type'   => 'ca_ticket',
		'meta_key'    => '_ca_public_token',
		'meta_value'  => $token,
		'numberposts' => 1,
	] );

	if ( empty( $tickets ) ) {
		return new WP_Error( 'not_found', 'Ticket not found.', [ 'status' => 404 ] );
	}

	$t  = $tickets[0];
	$id = $t->ID;

	// Get device info
	$device_id = get_post_meta( $id, '_ca_device_id', true );
	$device    = null;
	if ( $device_id ) {
		$device = [
			'make'  => get_post_meta( $device_id, '_ca_make', true ),
			'model' => get_post_meta( $device_id, '_ca_model', true ),
			'type'  => '',
		];
		$terms = wp_get_post_terms( $device_id, 'ca_device_type', [ 'fields' => 'names' ] );
		if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
			$device['type'] = $terms[0];
		}
	}

	return rest_ensure_response( [
		'jobNumber'     => get_post_meta( $id, '_ca_job_number', true ),
		'status'        => get_post_meta( $id, '_ca_status', true ),
		'device'        => $device,
		'checklist'     => json_decode( get_post_meta( $id, '_ca_checklist', true ) ?: '[]', true ),
		'updateLog'     => array_filter(
			json_decode( get_post_meta( $id, '_ca_update_log', true ) ?: '[]', true ),
			fn( $entry ) => empty( $entry['isInternal'] )
		),
		'addOnRequests' => json_decode( get_post_meta( $id, '_ca_addon_requests', true ) ?: '[]', true ),
		'addonCatalog'  => ca_get_addon_catalog(),
		'processSteps'  => ca_get_process_steps(),
		'checkedInAt'   => get_post_meta( $id, '_ca_checked_in_at', true ),
	] );
}

/* ────────────────────────────────────────────
   CALLBACK: Customer requests an add-on
   ──────────────────────────────────────────── */

function ca_api_request_addon( $request ) {
	$token      = $request->get_param( 'token' );
	$catalog_id = sanitize_text_field( $request->get_param( 'catalogItemId' ) );

	$tickets = get_posts( [
		'post_type'   => 'ca_ticket',
		'meta_key'    => '_ca_public_token',
		'meta_value'  => $token,
		'numberposts' => 1,
	] );

	if ( empty( $tickets ) ) {
		return new WP_Error( 'not_found', 'Ticket not found.', [ 'status' => 404 ] );
	}

	$id      = $tickets[0]->ID;
	$addons  = json_decode( get_post_meta( $id, '_ca_addon_requests', true ) ?: '[]', true );

	// Check if already requested
	foreach ( $addons as $addon ) {
		if ( $addon['catalogItemId'] === $catalog_id ) {
			return new WP_Error( 'already_requested', 'This add-on has already been requested.', [ 'status' => 400 ] );
		}
	}

	$addons[] = [
		'id'            => 'req-' . wp_generate_password( 8, false ),
		'catalogItemId' => $catalog_id,
		'status'        => 'requested',
		'requestedAt'   => current_time( 'c' ),
	];

	update_post_meta( $id, '_ca_addon_requests', wp_json_encode( $addons ) );

	return rest_ensure_response( [ 'success' => true, 'addOnRequests' => $addons ] );
}

/* ────────────────────────────────────────────
   CALLBACK: Update ticket status (admin)
   ──────────────────────────────────────────── */

function ca_api_update_status( $request ) {
	$id         = (int) $request->get_param( 'id' );
	$new_status = sanitize_text_field( $request->get_param( 'status' ) );

	$valid = array_keys( ca_get_repair_statuses() );
	if ( ! in_array( $new_status, $valid, true ) ) {
		return new WP_Error( 'invalid_status', 'Invalid status value.', [ 'status' => 400 ] );
	}

	update_post_meta( $id, '_ca_status', $new_status );

	// Set timestamp
	$ts_map = [
		'CHECKED_IN'         => '_ca_checked_in_at',
		'DIAGNOSING'         => '_ca_diagnosing_at',
		'AWAITING_APPROVAL'  => '_ca_awaiting_at',
		'REPAIR_IN_PROGRESS' => '_ca_in_progress_at',
		'VALIDATION'         => '_ca_validation_at',
		'READY_FOR_PICKUP'   => '_ca_ready_at',
		'CLOSED'             => '_ca_closed_at',
	];

	if ( isset( $ts_map[ $new_status ] ) ) {
		$existing = get_post_meta( $id, $ts_map[ $new_status ], true );
		if ( empty( $existing ) ) {
			update_post_meta( $id, $ts_map[ $new_status ], current_time( 'c' ) );
		}
	}

	return rest_ensure_response( [ 'success' => true, 'status' => $new_status ] );
}

/* ────────────────────────────────────────────
   CALLBACK: Toggle checklist item (admin)
   ──────────────────────────────────────────── */

function ca_api_toggle_checklist( $request ) {
	$id      = (int) $request->get_param( 'id' );
	$item_id = sanitize_text_field( $request->get_param( 'itemId' ) );

	$checklist = json_decode( get_post_meta( $id, '_ca_checklist', true ) ?: '[]', true );

	foreach ( $checklist as &$item ) {
		if ( $item['id'] === $item_id ) {
			$item['checked'] = ! $item['checked'];
			break;
		}
	}
	unset( $item );

	update_post_meta( $id, '_ca_checklist', wp_json_encode( $checklist ) );

	return rest_ensure_response( [ 'success' => true, 'checklist' => $checklist ] );
}

/* ────────────────────────────────────────────
   CALLBACK: Add update log note (admin)
   ──────────────────────────────────────────── */

function ca_api_add_note( $request ) {
	$id          = (int) $request->get_param( 'id' );
	$message     = sanitize_textarea_field( $request->get_param( 'message' ) );
	$is_internal = (bool) $request->get_param( 'isInternal' );

	$log = json_decode( get_post_meta( $id, '_ca_update_log', true ) ?: '[]', true );

	$log[] = [
		'id'         => 'log-' . wp_generate_password( 8, false ),
		'timestamp'  => current_time( 'c' ),
		'message'    => $message,
		'isInternal' => $is_internal,
	];

	update_post_meta( $id, '_ca_update_log', wp_json_encode( $log ) );

	return rest_ensure_response( [ 'success' => true, 'updateLog' => $log ] );
}

/* ────────────────────────────────────────────
   CALLBACK: Respond to add-on request (admin)
   ──────────────────────────────────────────── */

function ca_api_respond_addon( $request ) {
	$id        = (int) $request->get_param( 'id' );
	$addon_id  = sanitize_text_field( $request->get_param( 'addonId' ) );
	$response  = sanitize_text_field( $request->get_param( 'response' ) ); // 'approved' or 'declined'

	if ( ! in_array( $response, [ 'approved', 'declined' ], true ) ) {
		return new WP_Error( 'invalid_response', 'Response must be "approved" or "declined".', [ 'status' => 400 ] );
	}

	$addons = json_decode( get_post_meta( $id, '_ca_addon_requests', true ) ?: '[]', true );

	foreach ( $addons as &$addon ) {
		if ( $addon['id'] === $addon_id ) {
			$addon['status']      = $response;
			$addon['respondedAt'] = current_time( 'c' );
			break;
		}
	}
	unset( $addon );

	update_post_meta( $id, '_ca_addon_requests', wp_json_encode( $addons ) );

	return rest_ensure_response( [ 'success' => true, 'addOnRequests' => $addons ] );
}
