<?php
/**
 * Plugin Name:       Wafelmedia Utility Blocks
 * Description:       Wafelmedia Utility Blocks - Visibility on Mobile/Tablet/Desktop
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           1.0
 * Author:            Rafał Siemiński
 * Author URI:        https://wafelmedia.pl
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wafelmedia-utility-blocks
 *
 * @package           wafelmedia-utility-blocks
 */

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

function wafelmedia_utility_blocks_editor_scripts() {
    wp_enqueue_script(
		'utility-script-editor', // Unique handle.
		plugins_url( 'build/index.js', __FILE__ ), // block.js: We register the block here.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ) // Dependencies, defined above.
	);

    wp_enqueue_style(
		'utility-style-editor', // Unique handle.
		plugins_url( 'build/index.css', __FILE__ ), // block.css: We register the block here.
		array( 'wp-edit-blocks' ), // Style for the editor
        filemtime( plugin_dir_path( __FILE__ ) . 'build/index.css' ) // Version: filemtime - Gets file modification time.
	);
}
add_action( 'enqueue_block_editor_assets', 'wafelmedia_utility_blocks_editor_scripts' );

function wafelmedia_utility_blocks_scripts() {
	wp_enqueue_style(
		'utility-style', // Unique handle.
		plugins_url( 'build/style-index.css', __FILE__ ), // style.css: This file styles the block both in the editor and on the frontend.
		filemtime( plugin_dir_path( __FILE__ ) . 'build/style-index.css' ) // Version: filemtime - Gets file modification time.
	);
}
add_action( 'enqueue_block_assets', 'wafelmedia_utility_blocks_scripts' );