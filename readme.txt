=== Qaiyo Access Manager ===
Contributors: pixeldesigns
Tags: permissions, roles, access control, cpt, user management
Requires at least: 5.8
Tested up to: 7.0
Stable tag: 1.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Extend WordPress permission management: control which plugins and custom post types each role or individual user can see and manage.

== Description ==

Qaiyo Access Manager lets administrators set fine-grained access rules for plugins and custom post types at both role and individual user level.

**Key features:**

* **Plugin-level access control** — Define which roles can see and manage each installed plugin.
* **CPT-level access control** — Restrict custom post types (WooCommerce Products, ACF groups, etc.) per role.
* **User-level overrides** — Allow or deny access for specific users, overriding role-based rules.
* **Native capability info** — See at a glance which WordPress roles already have capabilities for each item.
* **Admin protection** — Administrators always have full access and cannot be restricted.
* **Translation ready** — Ships with English, Hungarian, German, French and Spanish translations.
* **Translation plugin compatible** — Works with WPML, Polylang, TranslatePress and other translation plugins.
* **AJAX save** — Settings are saved without page reload.
* **WordPress standards** — Nonce verification, capability checks, input sanitization, escaped output.

== Installation ==

1. Upload the `wp-plugin-access-manager` folder to `/wp-content/plugins/`.
2. Activate the plugin from the WordPress admin Plugins page.
3. Navigate to **Access Manager** in the admin sidebar.
4. Configure role and user-level access rules for plugins and content types.

== Frequently Asked Questions ==

= What happens if no roles are assigned to a plugin or CPT? =

It remains accessible to everyone by default.

= Can administrators be restricted? =

No. Administrators always have full access for security reasons.

= How does user-level override work? =

User-level rules take priority over role-based rules. A denied user cannot access the item even if their role is allowed, and an allowed user can access it even if their role is not.

= Is it compatible with WPML / Polylang / TranslatePress? =

Yes. The plugin excludes internal post types used by translation plugins and does not interfere with language-based content filtering.

= What happens when the plugin is uninstalled? =

All stored settings are removed from the database via uninstall.php.

== Changelog ==

= 1.0.0 =
* Initial release
* Plugin and CPT level access control per role
* User-level overrides (allow/deny per user)
* Native WordPress capability info display
* Translations: English, Hungarian, German, French, Spanish
* Translation plugin compatible (WPML, Polylang, TranslatePress)
* REST API access filtering for restricted CPTs
* AJAX-based settings save
