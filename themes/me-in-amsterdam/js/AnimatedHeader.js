$(document).ready(function() {
    $(window).scroll(function() {
	var height = $(window).scrollTop();
	if(height  > 100) {
            $('#top').addClass('shrink');
            $('#topmenu').addClass('shrink');
            $('#search').addClass('shrink');
            $('#navlinks').addClass('shrink');
	}
	if(height  < 10) {
            $('#top').removeClass('shrink');
            $('#topmenu').removeClass('shrink');
            $('#search').removeClass('shrink');
            $('#navlinks').removeClass('shrink');
	}
    });
});
