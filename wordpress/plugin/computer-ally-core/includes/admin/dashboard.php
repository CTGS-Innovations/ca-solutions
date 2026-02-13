<?php
/**
 * Admin Dashboard widget — quick overview of repair tickets.
 *
 * @package ComputerAllyCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'wp_dashboard_setup', 'ca_add_dashboard_widget' );

function ca_add_dashboard_widget() {
	wp_add_dashboard_widget(
		'ca_ticket_overview',
		__( 'Repair Tickets Overview', 'ca-core' ),
		'ca_dashboard_widget_render'
	);
}

function ca_dashboard_widget_render() {
	$statuses = ca_get_repair_statuses();
	$config   = ca_get_status_config();

	$counts = [];
	foreach ( array_keys( $statuses ) as $status ) {
		$query = new WP_Query( [
			'post_type'      => 'ca_ticket',
			'meta_key'       => '_ca_status',
			'meta_value'     => $status,
			'posts_per_page' => -1,
			'fields'         => 'ids',
		] );
		$counts[ $status ] = $query->found_posts;
	}

	$total   = array_sum( $counts );
	$overdue = 0;

	// Count overdue tickets
	$active_tickets = get_posts( [
		'post_type'      => 'ca_ticket',
		'posts_per_page' => -1,
		'fields'         => 'ids',
	] );

	foreach ( $active_tickets as $tid ) {
		if ( ca_is_overdue( $tid ) ) {
			$overdue++;
		}
	}

	?>
	<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1rem;">
		<div style="background: #f0f0f1; padding: 0.75rem; border-radius: 4px; text-align: center;">
			<div style="font-size: 1.5rem; font-weight: 700;"><?php echo esc_html( $total ); ?></div>
			<div style="font-size: 0.8125rem; color: #666;">Total Tickets</div>
		</div>
		<div style="background: <?php echo $overdue > 0 ? '#fef2f2' : '#f0f0f1'; ?>; padding: 0.75rem; border-radius: 4px; text-align: center;">
			<div style="font-size: 1.5rem; font-weight: 700; color: <?php echo $overdue > 0 ? '#dc2626' : '#333'; ?>;">
				<?php echo esc_html( $overdue ); ?>
			</div>
			<div style="font-size: 0.8125rem; color: #666;">Overdue (>48hr)</div>
		</div>
	</div>

	<table class="widefat striped" style="font-size: 0.8125rem;">
		<thead>
			<tr><th>Status</th><th style="text-align:right;">Count</th></tr>
		</thead>
		<tbody>
			<?php foreach ( $counts as $status => $count ) :
				$sc = $config[ $status ];
			?>
				<tr>
					<td>
						<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:<?php echo esc_attr( $sc['bg'] ); ?>; border: 1px solid <?php echo esc_attr( $sc['color'] ); ?>; margin-right:6px;"></span>
						<?php echo esc_html( $sc['label'] ); ?>
					</td>
					<td style="text-align:right; font-weight:600;"><?php echo esc_html( $count ); ?></td>
				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>

	<p style="margin-top: 1rem; text-align: center;">
		<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=ca_ticket' ) ); ?>" class="button button-primary">
			<?php esc_html_e( 'View All Tickets', 'ca-core' ); ?>
		</a>
		<a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=ca_ticket' ) ); ?>" class="button">
			<?php esc_html_e( 'New Ticket', 'ca-core' ); ?>
		</a>
	</p>
	<?php
}
