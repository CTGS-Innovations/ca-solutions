<?php
/**
 * Repair Status definitions and helpers.
 *
 * @package ComputerAllyCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get all repair statuses as value => label pairs.
 */
function ca_get_repair_statuses() {
	return [
		'CHECKED_IN'         => __( 'Checked In', 'ca-core' ),
		'DIAGNOSING'         => __( 'Diagnosing', 'ca-core' ),
		'AWAITING_APPROVAL'  => __( 'Awaiting Approval', 'ca-core' ),
		'REPAIR_IN_PROGRESS' => __( 'Repair In Progress', 'ca-core' ),
		'VALIDATION'         => __( 'Validation', 'ca-core' ),
		'READY_FOR_PICKUP'   => __( 'Ready for Pickup', 'ca-core' ),
		'CLOSED'             => __( 'Closed', 'ca-core' ),
	];
}

/**
 * Get status config with colors and step numbers.
 */
function ca_get_status_config() {
	return [
		'CHECKED_IN' => [
			'label'   => 'Checked In',
			'color'   => '#1D4ED8',
			'bg'      => '#DBEAFE',
			'step'    => 1,
		],
		'DIAGNOSING' => [
			'label'   => 'Diagnosing',
			'color'   => '#B45309',
			'bg'      => '#FEF3C7',
			'step'    => 2,
		],
		'AWAITING_APPROVAL' => [
			'label'   => 'Awaiting Approval',
			'color'   => '#C2410C',
			'bg'      => '#FFEDD5',
			'step'    => 2,
		],
		'REPAIR_IN_PROGRESS' => [
			'label'   => 'Repair In Progress',
			'color'   => '#4338CA',
			'bg'      => '#E0E7FF',
			'step'    => 3,
		],
		'VALIDATION' => [
			'label'   => 'Validation',
			'color'   => '#7C3AED',
			'bg'      => '#F3E8FF',
			'step'    => 4,
		],
		'READY_FOR_PICKUP' => [
			'label'   => 'Ready for Pickup',
			'color'   => '#15803D',
			'bg'      => '#DCFCE7',
			'step'    => 5,
		],
		'CLOSED' => [
			'label'   => 'Closed',
			'color'   => '#374151',
			'bg'      => '#F3F4F6',
			'step'    => 5,
		],
	];
}

/**
 * Get ordered statuses for the 5-step stepper.
 */
function ca_get_status_order() {
	return [
		'CHECKED_IN',
		'DIAGNOSING',
		'REPAIR_IN_PROGRESS',
		'VALIDATION',
		'READY_FOR_PICKUP',
	];
}

/**
 * Get the process steps with descriptions.
 */
function ca_get_process_steps() {
	return [
		[
			'title'       => 'Checked In',
			'description' => 'Your device has been received and logged. We document its condition and your reported issues.',
			'status'      => 'CHECKED_IN',
		],
		[
			'title'       => 'Diagnostics',
			'description' => 'We run comprehensive tests to identify the root cause — not just the symptoms. This ensures we fix it right the first time.',
			'status'      => 'DIAGNOSING',
		],
		[
			'title'       => 'Repair In Progress',
			'description' => 'Our technician is actively working on your device using industry-standard tools and verified parts.',
			'status'      => 'REPAIR_IN_PROGRESS',
		],
		[
			'title'       => 'Validation & Testing',
			'description' => 'After the repair, we run stability tests to make sure everything works reliably before you pick up.',
			'status'      => 'VALIDATION',
		],
		[
			'title'       => 'Ready for Pickup',
			'description' => 'Your device is repaired, tested, and ready to go. We\'ll walk you through what was done when you pick up.',
			'status'      => 'READY_FOR_PICKUP',
		],
	];
}

/**
 * Get the add-on catalog items.
 */
function ca_get_addon_catalog() {
	return [
		[
			'id'            => 'addon-001',
			'name'          => 'Data Backup Setup',
			'description'   => 'Full backup of your files to an external drive or cloud service before any work begins.',
			'why_it_matters' => 'Protects your photos, documents, and important files in case of unexpected drive failure during repair.',
			'price'         => 49,
		],
		[
			'id'            => 'addon-002',
			'name'          => 'Performance Tune-Up',
			'description'   => 'Startup optimization, removal of bloatware, disk cleanup, and system settings tuning for faster performance.',
			'why_it_matters' => 'Most computers slow down over time from accumulated software. A tune-up restores near-original speed.',
			'price'         => 79,
		],
		[
			'id'            => 'addon-003',
			'name'          => 'Security Hardening',
			'description'   => 'Antivirus verification, firewall configuration, browser security settings, and removal of potentially unwanted programs.',
			'why_it_matters' => 'Prevents future malware infections and protects your personal information from common threats.',
			'price'         => 59,
		],
		[
			'id'            => 'addon-004',
			'name'          => 'Long-Term Monitoring Setup',
			'description'   => 'Installation of lightweight monitoring tools that alert us if your system develops issues after repair.',
			'why_it_matters' => 'Catches problems early before they become serious, reducing future repair costs and downtime.',
			'price'         => 39,
		],
		[
			'id'            => 'addon-005',
			'name'          => 'Upgrade Evaluation',
			'description'   => 'Assessment of RAM, storage, and component upgrade options with a written recommendation and quote.',
			'why_it_matters' => 'Know exactly what upgrades will give you the biggest performance improvement for your budget.',
			'price'         => 0,
		],
	];
}

/**
 * Check if a ticket is overdue (past SLA threshold).
 */
function ca_is_overdue( $post_id ) {
	$status = get_post_meta( $post_id, '_ca_status', true );
	if ( in_array( $status, [ 'READY_FOR_PICKUP', 'CLOSED' ], true ) ) {
		return false;
	}

	$checked_in = get_post_meta( $post_id, '_ca_checked_in_at', true );
	if ( empty( $checked_in ) ) {
		return false;
	}

	$hours_elapsed = ( time() - strtotime( $checked_in ) ) / 3600;
	return $hours_elapsed > CA_SLA_THRESHOLD_HOURS;
}
