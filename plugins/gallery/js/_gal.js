

$(function() {
	$("input.disablenext:not(:checked)").parent().siblings().children().attr("disabled",true);
	$("input.disablenext").click( function() {
		if ($(this).attr("checked")) {
			$(this).parent().siblings().children().attr("disabled",false);
		} else {
			$(this).parent().siblings().children().attr("disabled",true);
		}
		});

});

