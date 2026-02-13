<?php
/**
 * Template: Customer-facing repair status page.
 *
 * Variables available (set by shortcode callback):
 *   $ticket, $ticket_id, $status, $job_num, $config, $steps,
 *   $checklist, $log, $addons, $device_name,
 *   $current_config, $current_step, $checked_total, $checklist_total, $progress_pct
 *
 * @package ComputerAllyCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="ca-repair-portal" style="max-width: 42rem; margin: 0 auto;">

	<!-- ── JOB HEADER ──────────────────────── -->
	<div class="ca-card" style="margin-bottom: 1.5rem;">
		<div class="ca-card-body" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
			<div>
				<p style="font-weight: 700; font-size: 1.125rem; margin: 0 0 0.25rem;">
					<?php echo esc_html( $job_num ); ?>
				</p>
				<?php if ( $device_name ) : ?>
					<p style="color: var(--ca-muted-foreground); font-size: 0.875rem; margin: 0;">
						<?php echo esc_html( $device_name ); ?>
					</p>
				<?php endif; ?>
			</div>
			<span class="ca-badge ca-badge-<?php echo esc_attr( sanitize_title( $current_config['label'] ) ); ?>"
			      style="background-color: <?php echo esc_attr( $current_config['bg'] ); ?>; color: <?php echo esc_attr( $current_config['color'] ); ?>;">
				<?php echo esc_html( $current_config['label'] ); ?>
			</span>
		</div>
	</div>

	<!-- ── PROCESS STEPPER ─────────────────── -->
	<div class="ca-panel ca-panel-primary" style="margin-bottom: 1.5rem;">
		<div class="ca-panel-heading">
			<p class="ca-panel-title">Repair Progress</p>
		</div>
		<div class="ca-panel-body">
			<div class="ca-stepper">
				<?php foreach ( $steps as $i => $step ) :
					$step_num    = $i + 1;
					$is_complete = $step_num < $current_step;
					$is_active   = $step_num === $current_step;
				?>
					<div class="ca-stepper-step">
						<div class="ca-stepper-indicator">
							<div class="ca-stepper-circle <?php echo $is_complete ? 'completed' : ( $is_active ? 'active' : '' ); ?>">
								<?php if ( $is_complete ) : ?>
									&#10003;
								<?php else : ?>
									<?php echo esc_html( $step_num ); ?>
								<?php endif; ?>
							</div>
							<?php if ( $i < count( $steps ) - 1 ) : ?>
								<div class="ca-stepper-line <?php echo $is_complete ? 'completed' : ''; ?>"></div>
							<?php endif; ?>
						</div>
						<div class="ca-stepper-content">
							<p class="ca-stepper-title"><?php echo esc_html( $step['title'] ); ?></p>
							<p class="ca-stepper-description"><?php echo esc_html( $step['description'] ); ?></p>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</div>

	<!-- ── BASELINE CHECKLIST ──────────────── -->
	<div class="ca-panel ca-panel-primary" style="margin-bottom: 1.5rem;">
		<div class="ca-panel-heading">
			<p class="ca-panel-title">Baseline Service Checklist</p>
		</div>
		<div class="ca-panel-body">
			<!-- Progress bar -->
			<div style="margin-bottom: 1rem;">
				<div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.25rem;">
					<span><?php echo esc_html( $checked_total ); ?> of <?php echo esc_html( $checklist_total ); ?> complete</span>
					<span><?php echo esc_html( $progress_pct ); ?>%</span>
				</div>
				<div style="height: 0.5rem; background: var(--ca-muted); border-radius: 9999px; overflow: hidden;">
					<div style="height: 100%; width: <?php echo esc_attr( $progress_pct ); ?>%; background: var(--ca-accent); border-radius: 9999px; transition: width 0.3s;"></div>
				</div>
			</div>

			<ul style="list-style: none; padding: 0; margin: 0;">
				<?php foreach ( $checklist as $item ) : ?>
					<li style="padding: 0.5rem 0; border-bottom: 1px solid var(--ca-border); display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
						<?php if ( ! empty( $item['checked'] ) ) : ?>
							<span style="color: var(--ca-accent); font-size: 1rem;">&#10003;</span>
						<?php else : ?>
							<span style="color: var(--ca-muted-foreground); font-size: 1rem;">&#9675;</span>
						<?php endif; ?>
						<span style="<?php echo ! empty( $item['checked'] ) ? 'text-decoration: line-through; color: var(--ca-muted-foreground);' : ''; ?>">
							<?php echo esc_html( $item['label'] ); ?>
						</span>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>

	<!-- ── RISK REDUCTION ──────────────────── -->
	<div class="ca-panel ca-panel-primary" style="margin-bottom: 1.5rem;">
		<div class="ca-panel-heading">
			<p class="ca-panel-title">Why This Matters</p>
		</div>
		<div class="ca-panel-body">
			<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
				<?php
				$risks = [
					[ 'title' => 'Prevent Repeat Issues',   'desc' => 'Proper diagnosis means we fix the root cause, not just symptoms.' ],
					[ 'title' => 'Protect Your Data',        'desc' => 'Baseline checks include security scanning and drive health verification.' ],
					[ 'title' => 'Extend Device Life',       'desc' => 'Driver updates and system checks keep your device running longer.' ],
					[ 'title' => 'Full Transparency',        'desc' => 'Every step is documented so you know exactly what was done.' ],
				];
				foreach ( $risks as $risk ) :
				?>
					<div style="padding: 0.75rem; border: 1px solid var(--ca-border); border-radius: var(--ca-radius);">
						<p style="font-weight: 600; font-size: 0.8125rem; margin: 0 0 0.25rem;"><?php echo esc_html( $risk['title'] ); ?></p>
						<p style="font-size: 0.75rem; color: var(--ca-muted-foreground); margin: 0;"><?php echo esc_html( $risk['desc'] ); ?></p>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</div>

	<!-- ── RECOMMENDED SAFEGUARDS ──────────── -->
	<div class="ca-panel ca-panel-primary" style="margin-bottom: 1.5rem;">
		<div class="ca-panel-heading">
			<p class="ca-panel-title">Recommended Safeguards</p>
		</div>
		<div class="ca-panel-body">
			<p style="font-size: 0.8125rem; color: var(--ca-muted-foreground); margin: 0 0 1rem;">
				Optional add-ons to get more from your repair. None are required.
			</p>
			<?php
			$catalog = ca_get_addon_catalog();
			$requested_ids = array_column( $addons, 'catalogItemId' );
			?>
			<div style="display: grid; gap: 0.75rem;">
				<?php foreach ( $catalog as $item ) :
					$is_requested = in_array( $item['id'], $requested_ids, true );
					$addon_status = '';
					if ( $is_requested ) {
						foreach ( $addons as $a ) {
							if ( $a['catalogItemId'] === $item['id'] ) {
								$addon_status = $a['status'];
								break;
							}
						}
					}
				?>
					<div style="border: 1px solid var(--ca-border); border-radius: var(--ca-radius); padding: 0.75rem;">
						<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.25rem;">
							<p style="font-weight: 600; font-size: 0.875rem; margin: 0;">
								<?php echo esc_html( $item['name'] ); ?>
							</p>
							<span style="font-weight: 700; color: var(--ca-accent); white-space: nowrap;">
								<?php echo $item['price'] > 0 ? '$' . esc_html( $item['price'] ) : 'Free'; ?>
							</span>
						</div>
						<p style="font-size: 0.8125rem; color: var(--ca-muted-foreground); margin: 0 0 0.5rem;">
							<?php echo esc_html( $item['description'] ); ?>
						</p>
						<?php if ( $is_requested ) : ?>
							<span class="ca-badge" style="background: <?php echo $addon_status === 'approved' ? 'var(--ca-status-ready)' : ( $addon_status === 'declined' ? '#FEE2E2' : 'var(--ca-status-diagnosing)' ); ?>; color: <?php echo $addon_status === 'approved' ? 'var(--ca-status-ready-text)' : ( $addon_status === 'declined' ? '#991B1B' : 'var(--ca-status-diagnosing-text)' ); ?>;">
								<?php echo esc_html( ucfirst( $addon_status ) ); ?>
							</span>
						<?php else : ?>
							<button
								class="ca-btn ca-btn-outline ca-btn-xs ca-request-addon"
								data-token="<?php echo esc_attr( get_post_meta( $ticket_id, '_ca_public_token', true ) ); ?>"
								data-catalog-id="<?php echo esc_attr( $item['id'] ); ?>"
							>
								Request
							</button>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</div>

	<!-- ── UPDATE LOG ──────────────────────── -->
	<?php
	$public_log = array_filter( $log, fn( $entry ) => empty( $entry['isInternal'] ) );
	if ( ! empty( $public_log ) ) :
	?>
		<div class="ca-panel ca-panel-primary" style="margin-bottom: 1.5rem;">
			<div class="ca-panel-heading">
				<p class="ca-panel-title">Updates</p>
			</div>
			<div class="ca-panel-body">
				<?php foreach ( array_reverse( $public_log ) as $entry ) : ?>
					<div style="padding: 0.5rem 0; border-bottom: 1px solid var(--ca-border);">
						<p style="font-size: 0.75rem; color: var(--ca-muted-foreground); margin: 0 0 0.25rem;">
							<?php echo esc_html( wp_date( 'M j, Y g:i A', strtotime( $entry['timestamp'] ) ) ); ?>
						</p>
						<p style="font-size: 0.875rem; margin: 0;">
							<?php echo esc_html( $entry['message'] ); ?>
						</p>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	<?php endif; ?>

	<!-- ── PICKUP INSTRUCTIONS ─────────────── -->
	<?php if ( $status === 'READY_FOR_PICKUP' ) : ?>
		<div class="ca-panel" style="border-color: var(--ca-accent); margin-bottom: 1.5rem;">
			<div class="ca-panel-heading" style="background-color: var(--ca-accent);">
				<p class="ca-panel-title" style="color: #fff;">Ready for Pickup!</p>
			</div>
			<div class="ca-panel-body">
				<p style="font-size: 0.875rem; margin: 0 0 0.75rem;">
					Your device is repaired, tested, and waiting for you. Bring this page or your receipt when you pick up.
				</p>
				<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; font-size: 0.8125rem;">
					<div>
						<p style="font-weight: 600; margin: 0 0 0.25rem;">Hours</p>
						<p style="margin: 0; color: var(--ca-muted-foreground);">Mon-Fri: 9AM-6PM<br>Sat: 10AM-4PM</p>
					</div>
					<div>
						<p style="font-weight: 600; margin: 0 0 0.25rem;">Location</p>
						<p style="margin: 0; color: var(--ca-muted-foreground);">123 Main Street, Suite 100<br>Anytown, ST 12345</p>
					</div>
					<div>
						<p style="font-weight: 600; margin: 0 0 0.25rem;">Payment</p>
						<p style="margin: 0; color: var(--ca-muted-foreground);">Cash, Card, Apple/Google Pay, Venmo</p>
					</div>
					<div>
						<p style="font-weight: 600; margin: 0 0 0.25rem;">Phone</p>
						<p style="margin: 0; color: var(--ca-muted-foreground);">(555) 123-4567</p>
					</div>
				</div>
			</div>
		</div>
	<?php endif; ?>

</div>
