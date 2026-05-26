# Qaiyo Access Manager

WordPress plugin for fine-grained access control over plugins and custom post types — per role or per individual user.

**Version:** 1.0.0

**Author:** PixelDesigns

**License:** GPL-2.0-or-later

**Requires:** WordPress 5.8+, PHP 7.4+

---

## What it does

WordPress roles give you broad strokes. Qaiyo Access Manager gives you the detail work.

You can restrict which roles can see installed plugin menus, which roles can access any custom post type, and then override both of those rules for specific users. None of this touches WordPress core capabilities — the plugin intercepts at the menu and CPT access layer.

## Features

| Feature | Details |
|---|---|
| Plugin access control | Hide admin menu entries per role |
| CPT access control | Restrict any registered post type per role |
| User-level overrides | Grant or block individual users, overrides role setting |
| Capability display | See native WP capabilities for every item |
| Admin safety lock | Administrator role is always protected |
| AJAX save | No page reload on settings changes |
| Languages | EN, HU, DE, FR, ES (auto-detect) |
| Multilingual plugins | WPML, Polylang, TranslatePress |
| Uninstall | uninstall.php cleans all stored options |
| Security | Nonce, capability check, sanitize, escape throughout |

## Installation

1. Upload the `qaiyo-access-manager` folder to `/wp-content/plugins/`
2. Activate through **Plugins → Installed Plugins**
3. Go to **Settings → Qaiyo Access Manager**

Or install directly from the WordPress.org plugin directory.

## Usage

### Role-based plugin restrictions

In the plugin settings, you'll see a list of all installed plugins. For each one, you can select which roles should have access. Roles without access won't see the plugin's admin menu entries.

### CPT restrictions

Same pattern for post types. Select which roles can access each registered CPT. Works with any CPT, including WooCommerce products, ACF-driven types, and your own custom registrations.

### User overrides

Under the **User Overrides** tab, search for any user and set explicit allow/deny rules for specific plugins or post types. These override the role setting.

### Capability display

Every plugin entry and CPT entry shows the native WordPress capabilities it relies on. This is read-only — it's there so you understand what access the item actually requires before you restrict it.

## Security

- All settings forms use WordPress nonce verification
- Save actions check `manage_options` capability
- All user input is sanitized before storage
- All output is properly escaped

The Administrator role is hardcoded as exempt. No setting in the UI can restrict administrator access.

## Compatibility

Tested with:
- WooCommerce 8.x+
- Advanced Custom Fields (ACF) 6.x+
- Polylang 3.x+
- WPML 4.x+
- TranslatePress 2.x+
- JetEngine, Toolset, MetaBox

## Development

```bash
git clone https://github.com/pixeldesigns/qaiyo-access-manager
cd qaiyo-access-manager
```
