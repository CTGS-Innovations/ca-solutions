<?php
/**
 * Shortcodes for front-end rendering.
 *
 * [ca_repair_status]  — Customer-facing repair status page (reads token from URL)
 * [ca_process_steps]  — 5-step repair process timeline
 * [ca_services_grid]  — Service cards grid
 * [ca_trust_stats]    — Trust indicator stats
 * [ca_faq]            — FAQ accordion
 * [ca_contact_info]   — Contact information cards
 * [ca_cta_banner]     — Call-to-action banner
 * [ca_safeguards]     — Add-on safeguards grid
 * [ca_checklist]      — Baseline checklist display
 *
 * @package ComputerAllyCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ============================================================
   [ca_repair_status] — Customer portal (the core feature)
   ============================================================ */

add_shortcode( 'ca_repair_status', 'ca_repair_status_shortcode' );

function ca_repair_status_shortcode() {
	$token = get_query_var( 'ca_token' );
	if ( empty( $token ) ) {
		$token = isset( $_GET['token'] ) ? sanitize_text_field( $_GET['token'] ) : '';
	}

	if ( empty( $token ) ) {
		return '<div class="ca-card"><div class="ca-card-body"><p>' .
			esc_html__( 'No repair token provided. Please scan your QR code to view your repair status.', 'ca-core' ) .
			'</p></div></div>';
	}

	// Look up ticket by token
	$tickets = get_posts( [
		'post_type'   => 'ca_ticket',
		'meta_key'    => '_ca_public_token',
		'meta_value'  => $token,
		'numberposts' => 1,
	] );

	if ( empty( $tickets ) ) {
		return '<div class="ca-card"><div class="ca-card-body"><p>' .
			esc_html__( 'Repair ticket not found. Please check your QR code and try again.', 'ca-core' ) .
			'</p></div></div>';
	}

	$ticket    = $tickets[0];
	$ticket_id = $ticket->ID;
	$status    = get_post_meta( $ticket_id, '_ca_status', true ) ?: 'CHECKED_IN';
	$job_num   = get_post_meta( $ticket_id, '_ca_job_number', true );
	$config    = ca_get_status_config();
	$steps     = ca_get_process_steps();
	$checklist = json_decode( get_post_meta( $ticket_id, '_ca_checklist', true ) ?: '[]', true );
	$log       = json_decode( get_post_meta( $ticket_id, '_ca_update_log', true ) ?: '[]', true );
	$addons    = json_decode( get_post_meta( $ticket_id, '_ca_addon_requests', true ) ?: '[]', true );

	// Get device info
	$device_id = get_post_meta( $ticket_id, '_ca_device_id', true );
	$device_name = '';
	if ( $device_id ) {
		$make  = get_post_meta( $device_id, '_ca_make', true );
		$model = get_post_meta( $device_id, '_ca_model', true );
		$device_name = trim( "$make $model" );
	}

	$current_config  = $config[ $status ] ?? $config['CHECKED_IN'];
	$current_step    = $current_config['step'];
	$checked_total   = count( array_filter( $checklist, fn( $i ) => ! empty( $i['checked'] ) ) );
	$checklist_total = count( $checklist );
	$progress_pct    = $checklist_total > 0 ? round( ( $checked_total / $checklist_total ) * 100 ) : 0;

	ob_start();
	include CA_CORE_PATH . 'templates/repair-status.php';
	return ob_get_clean();
}

/* ============================================================
   [ca_process_steps] — Process timeline
   ============================================================ */

add_shortcode( 'ca_process_steps', 'ca_process_steps_shortcode' );

function ca_process_steps_shortcode() {
	$steps = ca_get_process_steps();
	ob_start();
	?>
	<div class="ca-stepper">
		<?php foreach ( $steps as $i => $step ) : ?>
			<div class="ca-stepper-step">
				<div class="ca-stepper-indicator">
					<div class="ca-stepper-circle"><?php echo esc_html( $i + 1 ); ?></div>
					<?php if ( $i < count( $steps ) - 1 ) : ?>
						<div class="ca-stepper-line"></div>
					<?php endif; ?>
				</div>
				<div class="ca-stepper-content">
					<p class="ca-stepper-title"><?php echo esc_html( $step['title'] ); ?></p>
					<p class="ca-stepper-description"><?php echo esc_html( $step['description'] ); ?></p>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
	<?php
	return ob_get_clean();
}

/* ============================================================
   [ca_services_grid] — Services
   ============================================================ */

add_shortcode( 'ca_services_grid', 'ca_services_grid_shortcode' );

function ca_services_grid_shortcode() {
	$services = [
		[ 'title' => 'Virus & Malware Removal',       'description' => 'Thorough cleaning using professional tools — not just a quick scan. We find and remove rootkits, trojans, and persistent threats.', 'icon' => 'shield' ],
		[ 'title' => 'Hardware Diagnostics & Repair',  'description' => 'From failing hard drives to broken screens, we diagnose the actual cause and repair it with quality parts.', 'icon' => 'cpu' ],
		[ 'title' => 'Data Recovery & Backup',         'description' => 'Lost files, corrupted drives, accidental deletion — we use specialized tools to recover what matters most to you.', 'icon' => 'hard-drive' ],
		[ 'title' => 'Performance Optimization',       'description' => 'Slow computer? We identify bottlenecks, remove bloatware, optimize startup, and get you back to full speed.', 'icon' => 'zap' ],
		[ 'title' => 'Operating System Issues',        'description' => 'Blue screens, boot failures, update problems, and corruption — we restore your system to stable working order.', 'icon' => 'monitor' ],
		[ 'title' => 'Network & Connectivity',         'description' => 'WiFi problems, printer issues, email configuration, and home/office network setup and troubleshooting.', 'icon' => 'wifi' ],
	];

	ob_start();
	?>
	<div class="ca-services-grid">
		<?php foreach ( $services as $svc ) : ?>
			<div class="ca-card">
				<div class="ca-card-body">
					<h3 class="ca-card-title" style="margin-bottom: 0.5rem;"><?php echo esc_html( $svc['title'] ); ?></h3>
					<p class="ca-card-description"><?php echo esc_html( $svc['description'] ); ?></p>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
	<?php
	return ob_get_clean();
}

/* ============================================================
   [ca_trust_stats] — Trust indicators
   ============================================================ */

add_shortcode( 'ca_trust_stats', 'ca_trust_stats_shortcode' );

function ca_trust_stats_shortcode() {
	$stats = [
		[ 'stat' => '500+', 'label' => 'Devices Repaired' ],
		[ 'stat' => '4.9',  'label' => 'Google Rating' ],
		[ 'stat' => '24hr', 'label' => 'Avg. Turnaround' ],
		[ 'stat' => '100%', 'label' => 'Transparency' ],
	];

	ob_start();
	?>
	<div class="ca-trust-grid">
		<?php foreach ( $stats as $item ) : ?>
			<div class="ca-trust-item">
				<p class="ca-trust-stat"><?php echo esc_html( $item['stat'] ); ?></p>
				<p class="ca-trust-label"><?php echo esc_html( $item['label'] ); ?></p>
			</div>
		<?php endforeach; ?>
	</div>
	<?php
	return ob_get_clean();
}

/* ============================================================
   [ca_faq] — FAQ accordion
   ============================================================ */

add_shortcode( 'ca_faq', 'ca_faq_shortcode' );

function ca_faq_shortcode() {
	$faqs = [
		[ 'q' => 'How long does a typical repair take?',          'a' => 'Most repairs are completed within 24-48 hours. Complex issues like data recovery or motherboard repair may take longer. Your status page will always show the current stage so you never have to wonder.' ],
		[ 'q' => 'How do I check the status of my repair?',       'a' => 'When you drop off your device, you\'ll receive a QR code. Scan it anytime to see your real-time repair status, including what stage your device is at and what\'s been done so far.' ],
		[ 'q' => 'Do I need an appointment?',                     'a' => 'No appointment needed. Walk-ins are welcome during business hours. For business clients, we also offer scheduled pickups and on-site service.' ],
		[ 'q' => 'What if you find additional issues during repair?', 'a' => 'We\'ll update your status page and notify you before doing any additional work. You\'re always in control of what gets repaired and what gets deferred.' ],
		[ 'q' => 'Are the \'safeguards\' required?',              'a' => 'Absolutely not. Every repair includes our full baseline service — diagnostics, repair, and testing. Safeguards are optional enhancements that some customers find valuable for extra protection, but they\'re never required.' ],
		[ 'q' => 'What forms of payment do you accept?',          'a' => 'We accept cash, all major credit and debit cards, Apple Pay, Google Pay, and Venmo. Business accounts can be invoiced with NET-15 terms.' ],
		[ 'q' => 'Do you offer a warranty on repairs?',           'a' => 'Yes. All repairs come with a 30-day warranty. If the same issue recurs within 30 days, we\'ll fix it at no additional charge.' ],
		[ 'q' => 'Is my data safe during repair?',                'a' => 'We take data privacy seriously. Your files are never accessed beyond what\'s needed for the repair. For added safety, we recommend our Data Backup Setup safeguard before any work begins.' ],
	];

	ob_start();
	?>
	<div class="ca-faq-list">
		<?php foreach ( $faqs as $i => $faq ) : ?>
			<details class="ca-faq-item" <?php echo $i === 0 ? 'open' : ''; ?>>
				<summary class="ca-faq-question"><?php echo esc_html( $faq['q'] ); ?></summary>
				<div class="ca-faq-answer">
					<p><?php echo esc_html( $faq['a'] ); ?></p>
				</div>
			</details>
		<?php endforeach; ?>
	</div>
	<style>
		.ca-faq-list { display: flex; flex-direction: column; gap: 0.5rem; }
		.ca-faq-item { background: var(--ca-card); border: 1px solid var(--ca-border); border-radius: var(--ca-radius); overflow: hidden; }
		.ca-faq-question { padding: 1rem 1.25rem; font-weight: 600; font-size: 0.9375rem; cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; }
		.ca-faq-question::-webkit-details-marker { display: none; }
		.ca-faq-question::after { content: '+'; font-size: 1.25rem; color: var(--ca-muted-foreground); transition: transform 0.2s; }
		details[open] .ca-faq-question::after { content: '−'; }
		.ca-faq-answer { padding: 0 1.25rem 1rem; color: var(--ca-muted-foreground); font-size: 0.875rem; line-height: 1.6; }
		.ca-faq-answer p { margin: 0; }
	</style>
	<?php
	return ob_get_clean();
}

/* ============================================================
   [ca_contact_info] — Contact cards
   ============================================================ */

add_shortcode( 'ca_contact_info', 'ca_contact_info_shortcode' );

function ca_contact_info_shortcode() {
	ob_start();
	?>
	<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
		<!-- Hours -->
		<div class="ca-card">
			<div class="ca-card-body">
				<h3 class="ca-card-title">Business Hours</h3>
				<p style="margin:0.25rem 0; color: var(--ca-muted-foreground); font-size:0.875rem;">Monday - Friday: 9:00 AM - 6:00 PM</p>
				<p style="margin:0.25rem 0; color: var(--ca-muted-foreground); font-size:0.875rem;">Saturday: 10:00 AM - 4:00 PM</p>
				<p style="margin:0.25rem 0; color: var(--ca-muted-foreground); font-size:0.875rem;">Sunday: Closed</p>
			</div>
		</div>
		<!-- Location -->
		<div class="ca-card">
			<div class="ca-card-body">
				<h3 class="ca-card-title">Location</h3>
				<p style="margin:0.25rem 0; color: var(--ca-muted-foreground); font-size:0.875rem;">123 Main Street, Suite 100<br>Anytown, ST 12345</p>
			</div>
		</div>
		<!-- Contact -->
		<div class="ca-card">
			<div class="ca-card-body">
				<h3 class="ca-card-title">Get in Touch</h3>
				<p style="margin:0.25rem 0; color: var(--ca-muted-foreground); font-size:0.875rem;">Phone: (555) 123-4567</p>
				<p style="margin:0.25rem 0; color: var(--ca-muted-foreground); font-size:0.875rem;">Email: hello@computerally.com</p>
			</div>
		</div>
		<!-- Payment -->
		<div class="ca-card">
			<div class="ca-card-body">
				<h3 class="ca-card-title">Payment Methods</h3>
				<p style="margin:0.25rem 0; color: var(--ca-muted-foreground); font-size:0.875rem;">
					Cash &bull; Visa / Mastercard / Amex &bull; Apple Pay &bull; Google Pay &bull; Venmo &bull; Business Invoice (NET-15)
				</p>
			</div>
		</div>
	</div>
	<?php
	return ob_get_clean();
}

/* ============================================================
   [ca_cta_banner title="..." text="..." button_text="..." button_url="..."]
   ============================================================ */

add_shortcode( 'ca_cta_banner', 'ca_cta_banner_shortcode' );

function ca_cta_banner_shortcode( $atts ) {
	$atts = shortcode_atts( [
		'title'       => 'Ready to Get Your Computer Fixed?',
		'text'        => 'Drop off your device and track every step of the repair process.',
		'button_text' => 'Contact Us',
		'button_url'  => '/contact',
	], $atts );

	ob_start();
	?>
	<div class="ca-cta-banner">
		<h2><?php echo esc_html( $atts['title'] ); ?></h2>
		<p><?php echo esc_html( $atts['text'] ); ?></p>
		<a href="<?php echo esc_url( $atts['button_url'] ); ?>" class="ca-btn ca-btn-success"><?php echo esc_html( $atts['button_text'] ); ?></a>
	</div>
	<?php
	return ob_get_clean();
}

/* ============================================================
   [ca_safeguards] — Add-on safeguards grid
   ============================================================ */

add_shortcode( 'ca_safeguards', 'ca_safeguards_shortcode' );

function ca_safeguards_shortcode() {
	$catalog = ca_get_addon_catalog();

	ob_start();
	?>
	<div class="ca-services-grid">
		<?php foreach ( $catalog as $item ) : ?>
			<div class="ca-card">
				<div class="ca-card-body">
					<h3 class="ca-card-title" style="margin-bottom: 0.25rem;">
						<?php echo esc_html( $item['name'] ); ?>
						<span style="margin-left: auto; color: var(--ca-accent); font-weight: 700;">
							<?php echo $item['price'] > 0 ? '$' . esc_html( $item['price'] ) : 'Free'; ?>
						</span>
					</h3>
					<p class="ca-card-description" style="margin-bottom: 0.5rem;"><?php echo esc_html( $item['description'] ); ?></p>
					<p style="font-size: 0.8125rem; color: var(--ca-primary); font-style: italic; margin: 0;">
						<?php echo esc_html( $item['why_it_matters'] ); ?>
					</p>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
	<?php
	return ob_get_clean();
}

/* ============================================================
   [ca_checklist] — Baseline checklist display
   ============================================================ */

add_shortcode( 'ca_checklist', 'ca_checklist_shortcode' );

function ca_checklist_shortcode() {
	$items = ca_get_baseline_checklist();

	ob_start();
	?>
	<div class="ca-panel ca-panel-primary">
		<div class="ca-panel-heading">
			<p class="ca-panel-title">Baseline Service — Included With Every Repair</p>
		</div>
		<div class="ca-panel-body">
			<ul style="list-style: none; padding: 0; margin: 0;">
				<?php foreach ( $items as $item ) : ?>
					<li style="padding: 0.5rem 0; border-bottom: 1px solid var(--ca-border); display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
						<span style="color: var(--ca-accent); font-size: 1rem;">&#10003;</span>
						<?php echo esc_html( $item['label'] ); ?>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
	<?php
	return ob_get_clean();
}
