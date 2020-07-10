$("a[href^='#']").click(function(e) {
	e.preventDefault();

	var position = $($(this).attr("href")).offset().top;
	var offset = 50;

	if (position === 0){
		offset = 0
	}

	$("body, html").animate({
		scrollTop: position + offset
	} /* speed */ );
});
