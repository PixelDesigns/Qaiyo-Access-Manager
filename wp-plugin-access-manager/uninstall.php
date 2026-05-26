<?php
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

delete_option( 'wpam_plugin_role_rules' );
delete_option( 'wpam_cpt_role_rules' );
delete_option( 'wpam_plugin_user_rules' );
delete_option( 'wpam_cpt_user_rules' );

// v1.x legacy cleanup
delete_option( 'wpam_access_rules' );
delete_option( 'wpam_cpt_access_rules' );
