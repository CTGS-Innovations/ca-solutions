<?php
/**
 * Computer Ally — Hello Elementor Child Theme functions.
 *
 * @package ComputerAlly
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ────────────────────────────────────────────
   1. ENQUEUE PARENT + CHILD STYLES
   ──────────────────────────────────────────── */

add_action( 'wp_enqueue_scripts', 'computerally_enqueue_styles' );

function computerally_enqueue_styles() {
	// Parent theme (Hello Elementor)
	wp_enqueue_style(
		'hello-elementor',
		get_template_directory_uri() . '/style.css',
		[],
		wp_get_theme( 'hello-elementor' )->get( 'Version' )
	);

	// Child theme
	wp_enqueue_style(
		'computerally-child',
		get_stylesheet_uri(),
		[ 'hello-elementor' ],
		wp_get_theme()->get( 'Version' )
	);

	// Google Fonts — Inter
	wp_enqueue_style(
		'google-fonts-inter',
		'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
		[],
		null
	);
}

/* ────────────────────────────────────────────
   2. REGISTER NAV MENUS
   ──────────────────────────────────────────── */

add_action( 'after_setup_theme', 'computerally_setup' );

function computerally_setup() {
	register_nav_menus( [
		'primary'   => __( 'Primary Navigation', 'computerally' ),
		'footer'    => __( 'Footer Navigation', 'computerally' ),
		'admin_nav' => __( 'Admin Sidebar', 'computerally' ),
	] );
}

/* ────────────────────────────────────────────
   3. ELEMENTOR CUSTOM FONTS
   ──────────────────────────────────────────── */

add_action( 'elementor/fonts/additional_fonts', 'computerally_add_elementor_fonts' );

function computerally_add_elementor_fonts( $fonts ) {
	$fonts['Inter'] = 'googlefonts';
	return $fonts;
}

/* ────────────────────────────────────────────
   4. ELEMENTOR DEFAULT COLORS & TYPOGRAPHY
   ──────────────────────────────────────────── */

add_action( 'elementor/kit/register_tabs', 'computerally_register_kit_defaults', 10, 1 );

function computerally_register_kit_defaults( $kit ) {
	// The Global Colors and Typography are set in the Elementor
	// Site Settings UI. See the README for recommended values.
}

/* ────────────────────────────────────────────
   5. REMOVE DEFAULT HELLO ELEMENTOR HEADER/FOOTER
   (We use Elementor Theme Builder for these)
   ──────────────────────────────────────────── */

add_action( 'init', 'computerally_disable_hello_header_footer' );

function computerally_disable_hello_header_footer() {
	// Only if Elementor Pro is active and handling header/footer
	if ( defined( 'ELEMENTOR_PRO_VERSION' ) ) {
		remove_action( 'hello_elementor_header', 'hello_elementor_header_markup' );
		remove_action( 'hello_elementor_footer', 'hello_elementor_footer_markup' );
	}
}

/* ────────────────────────────────────────────
   6. ADD THEME SUPPORT
   ──────────────────────────────────────────── */

add_action( 'after_setup_theme', 'computerally_theme_support' );

function computerally_theme_support() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo', [
		'height'      => 40,
		'width'       => 200,
		'flex-height' => true,
		'flex-width'  => true,
	] );
}

/* ────────────────────────────────────────────
   7. CUSTOM ELEMENTOR WIDGET CATEGORIES
   ──────────────────────────────────────────── */

add_action( 'elementor/elements/categories_registered', 'computerally_elementor_categories' );

function computerally_elementor_categories( $elements_manager ) {
	$elements_manager->add_category( 'computer-ally', [
		'title' => __( 'Computer Ally', 'computerally' ),
		'icon'  => 'eicon-tools',
	] );
}
