<?php
/**
 * Custom Meta Fields for Tickets, Customers, and Devices.
 *
 * Registers post meta for the REST API and admin UI.
 *
 * @package ComputerAllyCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'ca_register_meta_fields' );

function ca_register_meta_fields() {

	/* ── Ticket Meta ───────────────────────── */

	$ticket_meta = [
		'_ca_public_token'     => [ 'type' => 'string',  'description' => 'Public token for customer-facing URL' ],
		'_ca_job_number'       => [ 'type' => 'string',  'description' => 'Human-readable job number (CA-YYYYMMDD-NNN)' ],
		'_ca_customer_id'      => [ 'type' => 'integer', 'description' => 'Linked customer post ID' ],
		'_ca_device_id'        => [ 'type' => 'integer', 'description' => 'Linked device post ID' ],
		'_ca_status'           => [ 'type' => 'string',  'description' => 'Repair status enum value' ],
		'_ca_intake_notes'     => [ 'type' => 'string',  'description' => 'Notes taken at intake' ],
		'_ca_checklist'        => [ 'type' => 'string',  'description' => 'JSON-encoded checklist items' ],
		'_ca_update_log'       => [ 'type' => 'string',  'description' => 'JSON-encoded update log entries' ],
		'_ca_addon_requests'   => [ 'type' => 'string',  'description' => 'JSON-encoded add-on requests' ],
		'_ca_checked_in_at'    => [ 'type' => 'string',  'description' => 'Timestamp: checked in' ],
		'_ca_diagnosing_at'    => [ 'type' => 'string',  'description' => 'Timestamp: diagnosing started' ],
		'_ca_awaiting_at'      => [ 'type' => 'string',  'description' => 'Timestamp: awaiting approval' ],
		'_ca_in_progress_at'   => [ 'type' => 'string',  'description' => 'Timestamp: repair in progress' ],
		'_ca_validation_at'    => [ 'type' => 'string',  'description' => 'Timestamp: validation started' ],
		'_ca_ready_at'         => [ 'type' => 'string',  'description' => 'Timestamp: ready for pickup' ],
		'_ca_closed_at'        => [ 'type' => 'string',  'description' => 'Timestamp: ticket closed' ],
	];

	foreach ( $ticket_meta as $key => $args ) {
		register_post_meta( 'ca_ticket', $key, [
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => $args['type'],
			'description'   => $args['description'],
			'auth_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		] );
	}

	/* ── Customer Meta ─────────────────────── */

	$customer_meta = [
		'_ca_phone' => [ 'type' => 'string', 'description' => 'Phone number' ],
		'_ca_email' => [ 'type' => 'string', 'description' => 'Email address' ],
	];

	foreach ( $customer_meta as $key => $args ) {
		register_post_meta( 'ca_customer', $key, [
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => $args['type'],
			'description'   => $args['description'],
			'auth_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		] );
	}

	/* ── Device Meta ───────────────────────── */

	$device_meta = [
		'_ca_make'            => [ 'type' => 'string', 'description' => 'Manufacturer' ],
		'_ca_model'           => [ 'type' => 'string', 'description' => 'Model name/number' ],
		'_ca_serial'          => [ 'type' => 'string', 'description' => 'Serial number' ],
		'_ca_condition_notes' => [ 'type' => 'string', 'description' => 'Condition notes at intake' ],
	];

	foreach ( $device_meta as $key => $args ) {
		register_post_meta( 'ca_device', $key, [
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => $args['type'],
			'description'   => $args['description'],
			'auth_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		] );
	}
}

/* ────────────────────────────────────────────
   META BOXES (Admin UI for editing meta fields)
   ──────────────────────────────────────────── */

add_action( 'add_meta_boxes', 'ca_add_meta_boxes' );

function ca_add_meta_boxes() {
	add_meta_box( 'ca-ticket-details', __( 'Ticket Details', 'ca-core' ), 'ca_ticket_details_metabox', 'ca_ticket', 'normal', 'high' );
	add_meta_box( 'ca-ticket-qr',      __( 'QR Code', 'ca-core' ),       'ca_ticket_qr_metabox',      'ca_ticket', 'side',   'default' );
	add_meta_box( 'ca-customer-info',   __( 'Contact Info', 'ca-core' ),  'ca_customer_info_metabox',  'ca_customer', 'normal', 'high' );
	add_meta_box( 'ca-device-specs',    __( 'Device Specs', 'ca-core' ),  'ca_device_specs_metabox',   'ca_device', 'normal', 'high' );
}

/* ── Ticket Details Meta Box ───────────── */

function ca_ticket_details_metabox( $post ) {
	wp_nonce_field( 'ca_ticket_nonce', 'ca_ticket_nonce_field' );

	$statuses = ca_get_repair_statuses();
	$current  = get_post_meta( $post->ID, '_ca_status', true ) ?: 'CHECKED_IN';
	$token    = get_post_meta( $post->ID, '_ca_public_token', true );
	$job_num  = get_post_meta( $post->ID, '_ca_job_number', true );
	$notes    = get_post_meta( $post->ID, '_ca_intake_notes', true );

	// Get all customers for dropdown
	$customers = get_posts( [ 'post_type' => 'ca_customer', 'numberposts' => -1, 'orderby' => 'title', 'order' => 'ASC' ] );
	$devices   = get_posts( [ 'post_type' => 'ca_device',   'numberposts' => -1, 'orderby' => 'title', 'order' => 'ASC' ] );

	$selected_customer = get_post_meta( $post->ID, '_ca_customer_id', true );
	$selected_device   = get_post_meta( $post->ID, '_ca_device_id', true );

	?>
	<table class="form-table">
		<tr>
			<th><label for="ca_job_number"><?php esc_html_e( 'Job Number', 'ca-core' ); ?></label></th>
			<td>
				<input type="text" id="ca_job_number" name="_ca_job_number" value="<?php echo esc_attr( $job_num ); ?>" class="regular-text" readonly />
				<p class="description"><?php esc_html_e( 'Auto-generated on creation.', 'ca-core' ); ?></p>
			</td>
		</tr>
		<tr>
			<th><label for="ca_public_token"><?php esc_html_e( 'Public Token', 'ca-core' ); ?></label></th>
			<td>
				<input type="text" id="ca_public_token" name="_ca_public_token" value="<?php echo esc_attr( $token ); ?>" class="regular-text" readonly />
				<?php if ( $token ) : ?>
					<p class="description">
						<?php printf( __( 'Customer URL: %s', 'ca-core' ), '<code>' . esc_url( home_url( '/repair/' . $token ) ) . '</code>' ); ?>
					</p>
				<?php endif; ?>
			</td>
		</tr>
		<tr>
			<th><label for="ca_status"><?php esc_html_e( 'Status', 'ca-core' ); ?></label></th>
			<td>
				<select id="ca_status" name="_ca_status">
					<?php foreach ( $statuses as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $current, $value ); ?>>
							<?php echo esc_html( $label ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th><label for="ca_customer_id"><?php esc_html_e( 'Customer', 'ca-core' ); ?></label></th>
			<td>
				<select id="ca_customer_id" name="_ca_customer_id">
					<option value=""><?php esc_html_e( '— Select —', 'ca-core' ); ?></option>
					<?php foreach ( $customers as $c ) : ?>
						<option value="<?php echo esc_attr( $c->ID ); ?>" <?php selected( $selected_customer, $c->ID ); ?>>
							<?php echo esc_html( $c->post_title ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th><label for="ca_device_id"><?php esc_html_e( 'Device', 'ca-core' ); ?></label></th>
			<td>
				<select id="ca_device_id" name="_ca_device_id">
					<option value=""><?php esc_html_e( '— Select —', 'ca-core' ); ?></option>
					<?php foreach ( $devices as $d ) : ?>
						<option value="<?php echo esc_attr( $d->ID ); ?>" <?php selected( $selected_device, $d->ID ); ?>>
							<?php echo esc_html( $d->post_title ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th><label for="ca_intake_notes"><?php esc_html_e( 'Intake Notes', 'ca-core' ); ?></label></th>
			<td>
				<textarea id="ca_intake_notes" name="_ca_intake_notes" rows="4" class="large-text"><?php echo esc_textarea( $notes ); ?></textarea>
			</td>
		</tr>
	</table>
	<?php
}

/* ── QR Code Meta Box ──────────────────── */

function ca_ticket_qr_metabox( $post ) {
	$token = get_post_meta( $post->ID, '_ca_public_token', true );
	if ( ! $token ) {
		echo '<p>' . esc_html__( 'QR code will be generated when the ticket is saved.', 'ca-core' ) . '</p>';
		return;
	}
	$url = home_url( '/repair/' . $token );
	echo '<div style="text-align:center; padding:10px;">';
	echo '<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . urlencode( $url ) . '" alt="QR Code" style="max-width:100%;" />';
	echo '<p style="margin-top:8px;"><small>' . esc_html( $url ) . '</small></p>';
	echo '<a href="javascript:window.print();" class="button">' . esc_html__( 'Print Receipt', 'ca-core' ) . '</a>';
	echo '</div>';
}

/* ── Customer Info Meta Box ────────────── */

function ca_customer_info_metabox( $post ) {
	wp_nonce_field( 'ca_customer_nonce', 'ca_customer_nonce_field' );
	$phone = get_post_meta( $post->ID, '_ca_phone', true );
	$email = get_post_meta( $post->ID, '_ca_email', true );
	?>
	<table class="form-table">
		<tr>
			<th><label for="ca_phone"><?php esc_html_e( 'Phone', 'ca-core' ); ?></label></th>
			<td><input type="tel" id="ca_phone" name="_ca_phone" value="<?php echo esc_attr( $phone ); ?>" class="regular-text" /></td>
		</tr>
		<tr>
			<th><label for="ca_email"><?php esc_html_e( 'Email', 'ca-core' ); ?></label></th>
			<td><input type="email" id="ca_email" name="_ca_email" value="<?php echo esc_attr( $email ); ?>" class="regular-text" /></td>
		</tr>
	</table>
	<?php
}

/* ── Device Specs Meta Box ─────────────── */

function ca_device_specs_metabox( $post ) {
	wp_nonce_field( 'ca_device_nonce', 'ca_device_nonce_field' );
	$make  = get_post_meta( $post->ID, '_ca_make', true );
	$model = get_post_meta( $post->ID, '_ca_model', true );
	$serial = get_post_meta( $post->ID, '_ca_serial', true );
	$notes  = get_post_meta( $post->ID, '_ca_condition_notes', true );
	?>
	<table class="form-table">
		<tr>
			<th><label for="ca_make"><?php esc_html_e( 'Make', 'ca-core' ); ?></label></th>
			<td><input type="text" id="ca_make" name="_ca_make" value="<?php echo esc_attr( $make ); ?>" class="regular-text" /></td>
		</tr>
		<tr>
			<th><label for="ca_model"><?php esc_html_e( 'Model', 'ca-core' ); ?></label></th>
			<td><input type="text" id="ca_model" name="_ca_model" value="<?php echo esc_attr( $model ); ?>" class="regular-text" /></td>
		</tr>
		<tr>
			<th><label for="ca_serial"><?php esc_html_e( 'Serial Number', 'ca-core' ); ?></label></th>
			<td><input type="text" id="ca_serial" name="_ca_serial" value="<?php echo esc_attr( $serial ); ?>" class="regular-text" /></td>
		</tr>
		<tr>
			<th><label for="ca_condition_notes"><?php esc_html_e( 'Condition Notes', 'ca-core' ); ?></label></th>
			<td><textarea id="ca_condition_notes" name="_ca_condition_notes" rows="3" class="large-text"><?php echo esc_textarea( $notes ); ?></textarea></td>
		</tr>
	</table>
	<?php
}

/* ────────────────────────────────────────────
   SAVE META
   ──────────────────────────────────────────── */

add_action( 'save_post_ca_ticket', 'ca_save_ticket_meta', 10, 2 );

function ca_save_ticket_meta( $post_id, $post ) {
	if ( ! isset( $_POST['ca_ticket_nonce_field'] ) || ! wp_verify_nonce( $_POST['ca_ticket_nonce_field'], 'ca_ticket_nonce' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	// Auto-generate token and job number on first save
	$token = get_post_meta( $post_id, '_ca_public_token', true );
	if ( empty( $token ) ) {
		$token = 'tk_' . wp_generate_password( 20, false );
		update_post_meta( $post_id, '_ca_public_token', $token );
	}

	$job_num = get_post_meta( $post_id, '_ca_job_number', true );
	if ( empty( $job_num ) ) {
		$job_num = 'CA-' . gmdate( 'Ymd' ) . '-' . str_pad( $post_id, 3, '0', STR_PAD_LEFT );
		update_post_meta( $post_id, '_ca_job_number', $job_num );
	}

	// Save editable fields
	$fields = [ '_ca_status', '_ca_customer_id', '_ca_device_id', '_ca_intake_notes' ];
	foreach ( $fields as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $field, sanitize_text_field( $_POST[ $field ] ) );
		}
	}

	// Track status timestamp changes
	$new_status = sanitize_text_field( $_POST['_ca_status'] ?? 'CHECKED_IN' );
	$status_ts_map = [
		'CHECKED_IN'         => '_ca_checked_in_at',
		'DIAGNOSING'         => '_ca_diagnosing_at',
		'AWAITING_APPROVAL'  => '_ca_awaiting_at',
		'REPAIR_IN_PROGRESS' => '_ca_in_progress_at',
		'VALIDATION'         => '_ca_validation_at',
		'READY_FOR_PICKUP'   => '_ca_ready_at',
		'CLOSED'             => '_ca_closed_at',
	];

	if ( isset( $status_ts_map[ $new_status ] ) ) {
		$ts_key = $status_ts_map[ $new_status ];
		$existing = get_post_meta( $post_id, $ts_key, true );
		if ( empty( $existing ) ) {
			update_post_meta( $post_id, $ts_key, current_time( 'c' ) );
		}
	}

	// Initialize checklist on first save
	$checklist = get_post_meta( $post_id, '_ca_checklist', true );
	if ( empty( $checklist ) ) {
		$items = ca_get_baseline_checklist();
		update_post_meta( $post_id, '_ca_checklist', wp_json_encode( $items ) );
	}

	// Initialize empty update log and addon requests
	if ( empty( get_post_meta( $post_id, '_ca_update_log', true ) ) ) {
		update_post_meta( $post_id, '_ca_update_log', '[]' );
	}
	if ( empty( get_post_meta( $post_id, '_ca_addon_requests', true ) ) ) {
		update_post_meta( $post_id, '_ca_addon_requests', '[]' );
	}
}

add_action( 'save_post_ca_customer', 'ca_save_customer_meta', 10, 2 );

function ca_save_customer_meta( $post_id, $post ) {
	if ( ! isset( $_POST['ca_customer_nonce_field'] ) || ! wp_verify_nonce( $_POST['ca_customer_nonce_field'], 'ca_customer_nonce' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	$fields = [ '_ca_phone', '_ca_email' ];
	foreach ( $fields as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $field, sanitize_text_field( $_POST[ $field ] ) );
		}
	}
}

add_action( 'save_post_ca_device', 'ca_save_device_meta', 10, 2 );

function ca_save_device_meta( $post_id, $post ) {
	if ( ! isset( $_POST['ca_device_nonce_field'] ) || ! wp_verify_nonce( $_POST['ca_device_nonce_field'], 'ca_device_nonce' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	$fields = [ '_ca_make', '_ca_model', '_ca_serial', '_ca_condition_notes' ];
	foreach ( $fields as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $field, sanitize_text_field( $_POST[ $field ] ) );
		}
	}
}

/* ────────────────────────────────────────────
   BASELINE CHECKLIST TEMPLATE
   ──────────────────────────────────────────── */

function ca_get_baseline_checklist() {
	return [
		[ 'id' => 'chk-01', 'label' => 'Document device condition at intake',          'checked' => false ],
		[ 'id' => 'chk-02', 'label' => 'Verify reported symptoms',                     'checked' => false ],
		[ 'id' => 'chk-03', 'label' => 'Run hardware diagnostics',                     'checked' => false ],
		[ 'id' => 'chk-04', 'label' => 'Check for malware and security threats',        'checked' => false ],
		[ 'id' => 'chk-05', 'label' => 'Inspect hard drive health',                    'checked' => false ],
		[ 'id' => 'chk-06', 'label' => 'Check operating system integrity',             'checked' => false ],
		[ 'id' => 'chk-07', 'label' => 'Verify all drivers are up to date',            'checked' => false ],
		[ 'id' => 'chk-08', 'label' => 'Test network connectivity',                    'checked' => false ],
		[ 'id' => 'chk-09', 'label' => 'Clean temporary files and caches',             'checked' => false ],
		[ 'id' => 'chk-10', 'label' => 'Verify repair resolves reported issue',        'checked' => false ],
		[ 'id' => 'chk-11', 'label' => 'Run stability tests post-repair',              'checked' => false ],
		[ 'id' => 'chk-12', 'label' => 'Document work completed and findings',         'checked' => false ],
	];
}
