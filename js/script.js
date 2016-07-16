$(function() {

	// разделяем числа на разряды
	function numberWithCommas(x) {
		return x.toString().replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "\$1,");
	}
	$('.js-replace-number').each(function() {
		$(this).html(numberWithCommas($(this).html()));
	});

	// collapse block
	$('.js-slide-trigger').on('click', function() {
		$(this).parent().find('.js-slide-anchor').toggleClass('active');
		$(this).toggleClass('active');
		$(this).hasClass('active') ? $(this).html('Скрыть') : $(this).html('Показать еще');
	});

	// кастомный скролл
	$(".js-custom-scroll").mCustomScrollbar();

	// обработка поиска
	$('.js-search-trigger').on('click', function() {
		$('input.morphsearch-input').trigger('focus');
		$('.morphsearch').addClass('active');
	});
	var morphSearch = document.getElementById('morphsearch'),
		input = morphSearch.querySelector('input.morphsearch-input'),
		ctrlClose = morphSearch.querySelector('span.morphsearch-close'),
		isOpen = isAnimating = false,
		// show/hide search area
		toggleSearch = function(evt) {
			// return if open and the input gets focused
			if (evt.type.toLowerCase() === 'focus' && isOpen) return false;

			var offsets = morphsearch.getBoundingClientRect();
			if (isOpen) {
				classie.remove(morphSearch, 'open');

				// trick to hide input text once the search overlay closes 
				// todo: hardcoded times, should be done after transition ends
				if (input.value !== '') {
					setTimeout(function() {
						classie.add(morphSearch, 'hideInput');
						setTimeout(function() {
							classie.remove(morphSearch, 'hideInput');
							input.value = '';
						}, 300);
					}, 500);
				}

				input.blur();
			} else {
				classie.add(morphSearch, 'open');
			}
			isOpen = !isOpen;
			$('.morphsearch').removeClass('active');
		};

	// events
	input.addEventListener('focus', toggleSearch);
	ctrlClose.addEventListener('click', toggleSearch);
	// esc key closes search overlay
	// keyboard navigation events
	document.addEventListener('keydown', function(ev) {
		var keyCode = ev.keyCode || ev.which;
		if (keyCode === 27 && isOpen) {
			toggleSearch(ev);
			$('.morphsearch').removeClass('active');
		}
	});

});