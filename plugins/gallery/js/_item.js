

$(function() {
			dotclear.hideLockable();

		// Add date picker
		var post_dtPick = new datePicker($('#post_dt').get(0));
		post_dtPick.img_top = '1.5em';
		post_dtPick.draw();

		// Confirm post deletion
		$('input[name="delete"]').click(function() {
			return window.confirm(dotclear.msg.confirm_delete_post);
		});

		// Hide some fields
		$('#notes-area label').toggleWithLegend($('#notes-area').children().not('label'),{
			user_pref: 'dcx_post_notes',
			legend_click:true,
			hide: $('#post_notes').val() == ''
		});
		$('#post_lang').parent().children('label').toggleWithLegend($('#post_lang'),{
			user_pref: 'dcx_post_lang',
			legend_click: true
		});
		$('#post_password').parent().children('label').toggleWithLegend($('#post_password'),{
			user_pref: 'dcx_post_password',
			legend_click: true,
			hide: $('#post_password').val() == ''
		});
		$('#post_status').parent().children('label').toggleWithLegend($('#post_status'),{
			user_pref: 'dcx_post_status',
			legend_click: true
		});
		$('#post_dt').parent().children('label').toggleWithLegend($('#post_dt').parent().children().not('label'),{
			user_pref: 'dcx_post_dt',
			legend_click: true
		});
		$('#label_format').toggleWithLegend($('#label_format').parent().children().not('#label_format'),{
			user_pref: 'dcx_post_format',
			legend_click: true
		});
		$('#label_cat_id').toggleWithLegend($('#label_cat_id').parent().children().not('#label_cat_id'),{
			user_pref: 'dcx_cat_id',
			legend_click: true
		});
		$('#create_cat').toggleWithLegend($('#create_cat').parent().children().not('#create_cat'),{
			// no cookie on new category as we don't use this every day
			legend_click: true
		});
		$('#label_comment_tb').toggleWithLegend($('#label_comment_tb').parent().children().not('#label_comment_tb'),{
			user_pref: 'dcx_comment_tb',
			legend_click: true
		});
		$('#post_url').parent().children('label').toggleWithLegend($('#post_url').parent().children().not('label'),{
			user_pref: 'post_url',
			legend_click: true
		});
		// We load toolbar on excerpt only when it's ready
		$('#excerpt-area label').toggleWithLegend($('#excerpt-area').children().not('label'),{
			user_pref: 'dcx_post_excerpt',
			legend_click: true,
			hide: $('#post_excerpt').val() == ''
		});

		// Replace attachment remove links by a POST form submit
		$('a.attachment-remove').click(function() {
			this.href = '';
			var m_name = $(this).parents('ul').find('li:first>a').attr('title');
			if (window.confirm(dotclear.msg.confirm_remove_attachment.replace('%s',m_name))) {
				var f = $('#attachment-remove-hide').get(0);
				f.elements['media_id'].value = this.id.substring(11);
				f.submit();
			}
			return false;
		});

	$("input.disablenext[checked=0]").parent().siblings().children().attr("disabled",true);
	$("input.disablenext").click( function() {
		if ($(this).attr("checked")) {
			$(this).parent().siblings().children().attr("disabled",false);
		} else {
			$(this).parent().siblings().children().attr("disabled",true);
		}
		});
});

