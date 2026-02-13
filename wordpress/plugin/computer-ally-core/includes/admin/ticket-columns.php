<?php
/**
 * Custom admin columns for the Tickets list table.
 *
 * @package ComputerAllyCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ── Define columns ────────────────────── */

add_filter( 'manage_ca_ticket_posts_columns', 'ca_ticket_columns' );

function ca_ticket_columns( $columns ) {
	$new = [];
	$new['cb']            = $columns['cb'];
	$new['title']         = __( 'Ticket', 'ca-core' );
	$new['ca_job_number'] = __( 'Job #', 'ca-core' );
	$new['ca_customer']   = __( 'Customer', 'ca-core' );
	$new['ca_device']     = __( 'Device', 'ca-core' );
	$new['ca_status']     = __( 'Status', 'ca-core' );
	$new['ca_overdue']    = __( 'SLA', 'ca-core' );
	$new['date']          = $columns['date'];
	return $new;
}

/* ── Populate columns ──────────────────── */

add_action( 'manage_ca_ticket_posts_custom_column', 'ca_ticket_column_content', 10, 2 );

function ca_ticket_column_content( $column, $post_id ) {
	$config = ca_get_status_config();

	switch ( $column ) {
		case 'ca_job_number':
			echo esc_html( get_post_meta( $post_id, '_ca_job_number', true ) ?: '—' );
			break;

		case 'ca_customer':
			$cid = get_post_meta( $post_id, '_ca_customer_id', true );
			echo $cid ? esc_html( get_the_title( $cid ) ) : '—';
			break;

		case 'ca_device':
			$did = get_post_meta( $post_id, '_ca_device_id', true );
			if ( $did ) {
				$make  = get_post_meta( $did, '_ca_make', true );
				$model = get_post_meta( $did, '_ca_model', true );
				echo esc_html( trim( "$make $model" ) ?: '—' );
			} else {
				echo '—';
			}
			break;

		case 'ca_status':
			$status = get_post_meta( $post_id, '_ca_status', true ) ?: 'CHECKED_IN';
			$sc     = $config[ $status ] ?? $config['CHECKED_IN'];
			printf(
				'<span style="display:inline-block; padding:2px 8px; border-radius:9999px; font-size:0.75rem; font-weight:500; background:%s; color:%s;">%s</span>',
				esc_attr( $sc['bg'] ),
				esc_attr( $sc['color'] ),
				esc_html( $sc['label'] )
			);
			break;

		case 'ca_overdue':
			if ( ca_is_overdue( $post_id ) ) {
				echo '<span style="color:#dc2626; font-weight:600;">OVERDUE</span>';
			} else {
				echo '<span style="color:#16a34a;">OK</span>';
			}
			break;
	}
}

/* ── Make columns sortable ─────────────── */

add_filter( 'manage_edit-ca_ticket_sortable_columns', 'ca_ticket_sortable_columns' );

function ca_ticket_sortable_columns( $columns ) {
	$columns['ca_job_number'] = 'ca_job_number';
	$columns['ca_status']     = 'ca_status';
	return $columns;
}

add_action( 'pre_get_posts', 'ca_ticket_sort_handler' );

function ca_ticket_sort_handler( $query ) {
	if ( ! is_admin() || ! $query->is_main_query() ) {
		return;
	}
	if ( $query->get( 'post_type' ) !== 'ca_ticket' ) {
		return;
	}

	$orderby = $query->get( 'orderby' );
	if ( $orderby === 'ca_job_number' ) {
		$query->set( 'meta_key', '_ca_job_number' );
		$query->set( 'orderby', 'meta_value' );
	} elseif ( $orderby === 'ca_status' ) {
		$query->set( 'meta_key', '_ca_status' );
		$query->set( 'orderby', 'meta_value' );
	}
}

/* ── Status filter dropdown ────────────── */

add_action( 'restrict_manage_posts', 'ca_ticket_status_filter' );

function ca_ticket_status_filter( $post_type ) {
	if ( $post_type !== 'ca_ticket' ) {
		return;
	}

	$current  = isset( $_GET['ca_filter_status'] ) ? sanitize_text_field( $_GET['ca_filter_status'] ) : '';
	$statuses = ca_get_repair_statuses();

	echo '<select name="ca_filter_status">';
	echo '<option value="">' . esc_html__( 'All Statuses', 'ca-core' ) . '</option>';
	foreach ( $statuses as $value => $label ) {
		printf(
			'<option value="%s" %s>%s</option>',
			esc_attr( $value ),
			selected( $current, $value, false ),
			esc_html( $label )
		);
	}
	echo '</select>';
}

add_filter( 'parse_query', 'ca_ticket_filter_query' );

function ca_ticket_filter_query( $query ) {
	global $pagenow;
	if ( ! is_admin() || $pagenow !== 'edit.php' ) {
		return;
	}
	if ( ( $query->get( 'post_type' ) ?? '' ) !== 'ca_ticket' ) {
		return;
	}

	$status = isset( $_GET['ca_filter_status'] ) ? sanitize_text_field( $_GET['ca_filter_status'] ) : '';
	if ( ! empty( $status ) ) {
		$query->set( 'meta_query', [
			[
				'key'   => '_ca_status',
				'value' => $status,
			],
		] );
	}
}
