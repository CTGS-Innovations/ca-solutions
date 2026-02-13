<?php
/**
 * QR Code generation utilities.
 *
 * Uses the free goqr.me API for QR image generation.
 * For production, consider a local library like chillerlan/php-qrcode.
 *
 * @package ComputerAllyCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get the customer-facing URL for a repair ticket.
 */
function ca_get_repair_url( $token ) {
	return home_url( '/repair/' . $token );
}

/**
 * Get the QR code image URL for a repair ticket.
 *
 * @param string $token  Public token for the ticket.
 * @param int    $size   Image size in pixels (default 300).
 * @return string        URL to the QR code image.
 */
function ca_get_qr_image_url( $token, $size = 300 ) {
	$url = ca_get_repair_url( $token );
	return 'https://api.qrserver.com/v1/create-qr-code/?size=' . $size . 'x' . $size . '&data=' . urlencode( $url );
}

/**
 * Render a QR code block with job number label.
 *
 * @param int $post_id  Ticket post ID.
 * @return string       HTML output.
 */
function ca_render_qr_block( $post_id ) {
	$token   = get_post_meta( $post_id, '_ca_public_token', true );
	$job_num = get_post_meta( $post_id, '_ca_job_number', true );

	if ( empty( $token ) ) {
		return '';
	}

	$qr_url    = ca_get_qr_image_url( $token );
	$repair_url = ca_get_repair_url( $token );

	ob_start();
	?>
	<div class="ca-qr-block" style="text-align: center; padding: 1.5rem;">
		<img
			src="<?php echo esc_url( $qr_url ); ?>"
			alt="<?php echo esc_attr( sprintf( __( 'QR Code for %s', 'ca-core' ), $job_num ) ); ?>"
			style="max-width: 200px; margin: 0 auto 1rem;"
		/>
		<p style="font-weight: 700; font-size: 1.125rem; margin: 0 0 0.25rem;">
			<?php echo esc_html( $job_num ); ?>
		</p>
		<p style="font-size: 0.75rem; color: var(--ca-muted-foreground, #6B7280); margin: 0;">
			<?php echo esc_html( $repair_url ); ?>
		</p>
	</div>
	<?php
	return ob_get_clean();
}

/**
 * Render a printable receipt with QR code.
 *
 * @param int $post_id  Ticket post ID.
 * @return string       HTML output.
 */
function ca_render_print_receipt( $post_id ) {
	$token    = get_post_meta( $post_id, '_ca_public_token', true );
	$job_num  = get_post_meta( $post_id, '_ca_job_number', true );
	$device_id = get_post_meta( $post_id, '_ca_device_id', true );

	$device_name = '';
	if ( $device_id ) {
		$make  = get_post_meta( $device_id, '_ca_make', true );
		$model = get_post_meta( $device_id, '_ca_model', true );
		$device_name = trim( "$make $model" );
	}

	$customer_id = get_post_meta( $post_id, '_ca_customer_id', true );
	$customer_name = $customer_id ? get_the_title( $customer_id ) : '';

	$qr_url    = ca_get_qr_image_url( $token, 200 );
	$repair_url = ca_get_repair_url( $token );

	ob_start();
	?>
	<div class="print-receipt" style="max-width: 400px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif;">
		<div style="text-align: center; padding: 1.5rem 0; border-bottom: 2px solid #000;">
			<h2 style="margin: 0 0 0.25rem; font-size: 1.25rem;">Computer Ally</h2>
			<p style="margin: 0; font-size: 0.75rem; color: #666;">Computer Repair You Can Actually See</p>
		</div>

		<div style="padding: 1rem 0; border-bottom: 1px solid #ddd;">
			<p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Job:</strong> <?php echo esc_html( $job_num ); ?></p>
			<?php if ( $customer_name ) : ?>
				<p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Customer:</strong> <?php echo esc_html( $customer_name ); ?></p>
			<?php endif; ?>
			<?php if ( $device_name ) : ?>
				<p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Device:</strong> <?php echo esc_html( $device_name ); ?></p>
			<?php endif; ?>
			<p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Date:</strong> <?php echo esc_html( current_time( 'M j, Y g:i A' ) ); ?></p>
		</div>

		<div style="text-align: center; padding: 1.5rem 0;">
			<p style="font-weight: 600; margin: 0 0 0.75rem; font-size: 0.875rem;">Scan to track your repair:</p>
			<img src="<?php echo esc_url( $qr_url ); ?>" alt="QR Code" style="max-width: 200px;" />
			<p style="font-size: 0.6875rem; color: #666; margin: 0.75rem 0 0; word-break: break-all;">
				<?php echo esc_html( $repair_url ); ?>
			</p>
		</div>

		<div style="text-align: center; padding: 0.75rem 0; border-top: 1px solid #ddd; font-size: 0.75rem; color: #666;">
			<p style="margin: 0;">Mon-Fri 9-6 &bull; Sat 10-4 &bull; (555) 123-4567</p>
		</div>
	</div>
	<?php
	return ob_get_clean();
}
