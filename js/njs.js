(function(window) {

	var $ = window.jQuery,
		$doc = $(window.document);

	function _on_dom_ready() {
		$doc
			.on('click', '#btn_step_1', _on_clicked_first_next_step_update_or_move)
	
	}

	$(_on_dom_ready);
})(window);

