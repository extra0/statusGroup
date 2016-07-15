$(function(){

	// разделяем числа на разряды
	function numberWithCommas(x) { return x.toString().replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "\$1,");}
	$('.js-replace-number').each(function() {$(this).html(numberWithCommas($(this).html()));});

	// collapse block
	$('.js-slide-trigger').on('click', function(){
		$(this).parent().find('.js-slide-anchor').toggleClass('active');
	});

});