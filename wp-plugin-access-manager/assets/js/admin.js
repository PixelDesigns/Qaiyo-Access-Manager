(function ($) {
	'use strict';

	var searchTimer = null;

	// =====================
	// Card toggle
	// =====================
	$(document).on('click', '.wpam-card-header', function (e) {
		if ($(e.target).closest('button:not(.wpam-toggle-btn), input, label, select').length) return;
		var $card = $(this).closest('.wpam-card');
		var $body = $card.find('.wpam-card-body');
		var $btn  = $(this).find('.wpam-toggle-btn');
		var expanded = $btn.attr('aria-expanded') === 'true';
		$body.slideToggle(200);
		$btn.attr('aria-expanded', !expanded);
	});

	$('#wpam-expand-all').on('click', function () {
		$('.wpam-tab-content:visible .wpam-card:not(.wpam-hidden)').each(function () {
			$(this).find('.wpam-card-body').slideDown(200);
			$(this).find('.wpam-toggle-btn').attr('aria-expanded', 'true');
		});
	});

	$('#wpam-collapse-all').on('click', function () {
		$('.wpam-tab-content:visible .wpam-card-body').slideUp(200);
		$('.wpam-tab-content:visible .wpam-toggle-btn').attr('aria-expanded', 'false');
	});

	// =====================
	// Role quick actions
	// =====================
	$(document).on('click', '.wpam-select-all-roles', function () {
		$(this).closest('.wpam-section').find('.wpam-role-cb').prop('checked', true);
	});

	$(document).on('click', '.wpam-deselect-all-roles', function () {
		$(this).closest('.wpam-section').find('.wpam-role-cb').prop('checked', false);
	});

	// =====================
	// Search filter
	// =====================
	$('#wpam-search').on('input', function () {
		var q = $(this).val().toLowerCase().trim();
		$('.wpam-tab-content:visible .wpam-card').each(function () {
			var name = $(this).data('item-name') || '';
			$(this).toggleClass('wpam-hidden', q.length > 0 && name.indexOf(q) === -1);
		});
	});

	$('.wpam-tabs .nav-tab').on('click', function () {
		$('#wpam-search').val('');
		$('.wpam-card').removeClass('wpam-hidden');
	});

	// =====================
	// User search (AJAX)
	// =====================
	$(document).on('input', '.wpam-user-search', function () {
		var $input   = $(this);
		var $wrap    = $input.closest('.wpam-user-search-wrap');
		var $results = $wrap.find('.wpam-user-search-results');
		var query    = $input.val().trim();

		clearTimeout(searchTimer);

		if (query.length < 2) {
			$results.hide().empty();
			return;
		}

		searchTimer = setTimeout(function () {
			$.ajax({
				url: wpam_data.ajax_url,
				type: 'GET',
				data: {
					action: 'wpam_search_users',
					nonce: wpam_data.user_nonce,
					q: query
				},
				success: function (res) {
					$results.empty();
					if (!res.success || !res.data.length) {
						$results.html('<div class="wpam-user-search-empty">' + wpam_data.i18n.no_results + '</div>').show();
						return;
					}

					var $card     = $input.closest('.wpam-card');
					var $ruleList = $card.find('.wpam-user-rules-list');
					var existing  = [];
					$ruleList.find('.wpam-user-rule-row').each(function () {
						existing.push(parseInt($(this).data('user-id'), 10));
					});

					$.each(res.data, function (_, user) {
						if (existing.indexOf(user.id) !== -1) return;
						var $row = $('<div class="wpam-user-search-result" data-user-id="' + user.id + '">' +
							'<div><span class="wpam-user-result-name">' + escHtml(user.name) + '</span>' +
							' <span class="wpam-user-result-detail">(' + escHtml(user.login) + ')</span></div>' +
							'<span class="wpam-user-result-detail">' + escHtml(user.email) + ' &mdash; ' + escHtml(user.role) + '</span>' +
							'</div>');

						$row.data('user-data', user);
						$results.append($row);
					});

					$results.show();
				}
			});
		}, 300);
	});

	$(document).on('click', '.wpam-user-search-result', function () {
		var user  = $(this).data('user-data');
		var $card = $(this).closest('.wpam-card');
		var $list = $card.find('.wpam-user-rules-list');

		var row = '<div class="wpam-user-rule-row" data-user-id="' + user.id + '" data-rule-type="allowed">' +
			'<span class="wpam-user-rule-info">' +
			'<strong>' + escHtml(user.name) + '</strong>' +
			'<span class="wpam-user-rule-meta">' + escHtml(user.email) + ' &mdash; ' + escHtml(user.role) + '</span>' +
			'</span>' +
			'<select class="wpam-user-rule-type">' +
			'<option value="allowed" selected>' + wpam_data.i18n.allow + '</option>' +
			'<option value="denied">' + wpam_data.i18n.deny + '</option>' +
			'</select>' +
			'<button type="button" class="button button-small wpam-user-rule-remove" title="' + wpam_data.i18n.remove + '">&times;</button>' +
			'</div>';

		$list.append(row);
		$card.find('.wpam-user-search').val('');
		$card.find('.wpam-user-search-results').hide().empty();
	});

	$(document).on('change', '.wpam-user-rule-type', function () {
		$(this).closest('.wpam-user-rule-row').attr('data-rule-type', $(this).val());
	});

	$(document).on('click', '.wpam-user-rule-remove', function () {
		$(this).closest('.wpam-user-rule-row').remove();
	});

	$(document).on('click', function (e) {
		if (!$(e.target).closest('.wpam-user-search-wrap').length) {
			$('.wpam-user-search-results').hide();
		}
	});

	// =====================
	// Save (AJAX)
	// =====================
	$('#wpam-access-form').on('submit', function (e) {
		e.preventDefault();

		var pluginRoles = {};
		var cptRoles    = {};
		var pluginUsers = {};
		var cptUsers    = {};

		// Collect plugin role rules
		$('#wpam-tab-plugins .wpam-card').each(function () {
			var key   = $(this).data('item-key');
			var roles = [];
			$(this).find('.wpam-role-cb:checked').each(function () { roles.push($(this).val()); });
			if (roles.length) pluginRoles[key] = roles;

			var userRules = collectUserRules($(this));
			if (userRules) pluginUsers[key] = userRules;
		});

		// Collect CPT role rules
		$('#wpam-tab-cpt .wpam-card').each(function () {
			var key   = $(this).data('item-key');
			var roles = [];
			$(this).find('.wpam-role-cb:checked').each(function () { roles.push($(this).val()); });
			if (roles.length) cptRoles[key] = roles;

			var userRules = collectUserRules($(this));
			if (userRules) cptUsers[key] = userRules;
		});

		var $btn    = $('#wpam-save-btn');
		var $status = $('#wpam-save-status');
		$btn.prop('disabled', true).text(wpam_data.i18n.saving);
		$status.text('').removeClass('wpam-status-success wpam-status-error');

		$.ajax({
			url: wpam_data.ajax_url,
			type: 'POST',
			data: {
				action: 'wpam_save_access',
				nonce: wpam_data.nonce,
				plugin_role_rules: JSON.stringify(pluginRoles),
				cpt_role_rules: JSON.stringify(cptRoles),
				plugin_user_rules: JSON.stringify(pluginUsers),
				cpt_user_rules: JSON.stringify(cptUsers)
			},
			success: function (res) {
				if (res.success) {
					$status.text(wpam_data.i18n.saved).addClass('wpam-status-success');
					updateBadges();
				} else {
					$status.text(res.data && res.data.message ? res.data.message : wpam_data.i18n.error).addClass('wpam-status-error');
				}
			},
			error: function () {
				$status.text(wpam_data.i18n.error).addClass('wpam-status-error');
			},
			complete: function () {
				$btn.prop('disabled', false).text(wpam_data.i18n.save_btn);
				setTimeout(function () {
					$status.fadeOut(300, function () {
						$(this).text('').show().removeClass('wpam-status-success wpam-status-error');
					});
				}, 3000);
			}
		});
	});

	// =====================
	// Helpers
	// =====================
	function collectUserRules($card) {
		var allowed = [];
		var denied  = [];
		$card.find('.wpam-user-rule-row').each(function () {
			var uid  = parseInt($(this).data('user-id'), 10);
			var type = $(this).find('.wpam-user-rule-type').val();
			if (type === 'allowed') {
				allowed.push(uid);
			} else {
				denied.push(uid);
			}
		});
		if (!allowed.length && !denied.length) return null;
		return { allowed: allowed, denied: denied };
	}

	function updateBadges() {
		$('.wpam-card').each(function () {
			var hasRoles = $(this).find('.wpam-role-cb:checked').length > 0;
			var hasUsers = $(this).find('.wpam-user-rule-row').length > 0;
			var $badge   = $(this).find('.wpam-badge-restricted');

			$(this).toggleClass('wpam-has-rules', hasRoles || hasUsers);
			if (hasRoles || hasUsers) {
				if (!$badge.length) {
					$(this).find('.wpam-card-info').append('<span class="wpam-badge wpam-badge-restricted">Szabályozva</span>');
				}
			} else {
				$badge.remove();
			}
		});
	}

	function escHtml(str) {
		var div = document.createElement('div');
		div.appendChild(document.createTextNode(str));
		return div.innerHTML;
	}

	// Set initial data-rule-type attributes
	$('.wpam-user-rule-row').each(function () {
		var type = $(this).find('.wpam-user-rule-type').val();
		$(this).attr('data-rule-type', type);
	});

})(jQuery);
