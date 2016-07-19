$(function() {

	// фенсибокс
	$('.js-fancybox').fancybox({
		prevEffect	: 'none',
		nextEffect	: 'none',
		helpers	: {
			title	: {
				type: 'outside'
			},
			thumbs	: {
				width	: 80,
				height	: 80
			}
		}
	});

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


	// логика работы табов 
	$('.js-tab-nav a').each(function(i){$(this).attr('data-index', i)});
	$('.js-tab-content > div').each(function(i){$(this).attr('data-index', i)});
	$('.js-tab-nav a').on('click', function(){
		$('.js-tab-nav a, .js-tab-content > div').removeClass('current');
		$(this).addClass('current');
		$('.js-tab-content > div[data-index='+ $(this).attr('data-index') +']').addClass('current');
	});

	// tooltip init
	$('.js-tooltip').mouseenter(function(){
		$(this).parent().append('<span class="tooltip-content">' + $(this).attr('data-title') + '</span>');
		$('.tooltip-content').fadeIn(400);
	});

	$('.js-tooltip').mouseleave(function(){
		$('.tooltip-content').fadeOut(400);
		setTimeout(function(){
			$('.tooltip-content').remove();
		},300);
	});


	// определяем текущий день и активируем нужный день в графике работы
	var date = new Date(),
		cDay = date.getDay();
		cDay !=0 ? $('.contact__work-day-item:nth-child('+ cDay +')').addClass('current') : $('.contact__work-day-item:last-child').addClass('current');

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


	// --------- КОРЗИНА

	function cart() {
		var sum = 0;

		// просчитываем общую сумму
		$('[item-total-cost]').each(function() {
			sum += parseInt($(this).attr('item-total-cost'));
		});

		// заносим данные
		$('[item-total]').html(sum);

		// корректируем вывод по разрядам числа
		$('.js-replace-number').each(function() {
			$(this).html(numberWithCommas($(this).html()));
		});
	}

	// удаляем позицию
	$('[item-delete]').click(function() {
		$(this).parents('[item-parent]').remove();
		cart();
	});

	// меняем значение кнопками
	$('[item-changer]').on('click', function() {
		var itemParent = $(this).parents('[item-parent]'),
			input = itemParent.find('[item-val]'),
			totalCost = itemParent.find('[item-total-cost]'),
			itemCost = itemParent.find('[item-cost]');

		input.val(parseInt(input.val()) + parseInt($(this).attr('data-val')));

		if (input.val() < 1) { // не даем опустится ниже 0 значению в инпуте
			input.val('1');
		}
		if (input.val() > parseInt(input.attr('item-max-val'))) { // проверяем на максимально допутисмое значение в инпуте
			input.val(input.attr('item-max-val'));
		}

		totalCost.attr('item-total-cost', parseInt(input.val()) * parseInt(itemCost.attr('item-cost')));
		totalCost.html(totalCost.attr('item-total-cost'));

		cart();
	});

	var tSum = 0;
	$('[item-total-cost]').each(function() {
		var totalItem = parseInt($(this).parents('[item-parent]').find('[item-val]').val()) * parseInt($(this).parents('[item-parent]').find('[item-cost]').attr('item-cost'));
		$(this).attr('item-total-cost', totalItem);
		$(this).html(totalItem);

		tSum += totalItem;
		$('[item-total]').html(tSum);
	});

	//  обработка изменения значения в инпуте в товаре
	$('[item-val]').keyup(function() {
		if ($(this).val() == 0) {
			$(this).val('1');
		}
		if ($(this).val() > parseInt($(this).attr('item-max-val'))) {
			$(this).val($(this).attr('item-max-val'));
		}

		var itemParent = $(this).parents('[item-parent]'),
			totalCost = itemParent.find('[item-total-cost]'),
			itemCost = itemParent.find('[item-cost]');

		totalCost.attr('item-total-cost', parseInt($(this).val()) * parseInt(itemCost.attr('item-cost')));
		totalCost.html(totalCost.attr('item-total-cost'));

		cart();
	});

	cart();



	// ======= Выбор материала обивки
	$('.js-material').on('click', function(){
		$('.js-material').removeClass('current'); 
		$(this).addClass('current'); // подсвечиаем активный материал 

		$('.js-material-price').html($(this).attr('data-price')); // заносим цену материала в попап
		$('[name="material-name"]').val($(this).next().html()); // заносим название материала в скрытый инпут
		$('[name="material-price"]').val($(this).attr('data-price') + ' ₴'); // заносим цену материала в скрытый инпут

		$('.js-material-input input').val($(this).next().html()); // заносим название выбранного материала в псевдо селект
		$('.js-material-input .form-pseudo-select-material-wrap').attr('style', 'background: url(../'+$(this).attr('src')+')'); // заносим название выбранного материала в псевдо селект

		pPice();

	});


	// ======= Выбор каркаса
	$('.js-frame').on('click', function(){
		$('.js-frame').removeClass('current'); 
		$(this).addClass('current'); // подсвечиаем активный материал 

		$('.js-frame-price').html($(this).attr('data-price')); // заносим цену материала в попап
		$('[name="frame-name"]').val($(this).next().html()); // заносим название материала в скрытый инпут
		$('[name="frame-price"]').val($(this).attr('data-price') + ' ₴'); // заносим цену материала в скрытый инпут

		$('.js-frame-input input').val($(this).next().html()); // заносим название выбранного материала в псевдо селект
		$('.js-frame-input .form-pseudo-select-material-wrap').attr('style', 'background: url(../'+$(this).attr('src')+')'); // заносим название выбранного материала в псевдо селект

		pPice();
	});

	$('.md-button').click(function(){
		$('.md-close').trigger('click');
	});


	// расчет общей цены после выбора материалов
	function pPice() {
		var sum = 0,
			tSum = 0;

		$('.product__tab-content-block-prop-list-img.current').each(function(){
			tSum += parseInt($(this).attr('data-price'));
		});


		sum = parseInt($('.product__price-current').attr('data-price')) + parseInt(tSum);

		$('.product__price-current').html(numberWithCommas(sum + ' ₴'));
		$('[name="total-price"]').val(sum + ' ₴');
	}

	pPice();

});