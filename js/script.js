$(function() {

	// фенсибокс
	$('.js-fancybox').fancybox({
		prevEffect	: 'none',
		nextEffect	: 'none',
		helpers	: {
			thumbs	: {
				width	: 80,
				height	: 80
			}
		}
	});

	// collapse
	$('.js-collapse-trigger').on('click', function(){
		$(this).next().slideToggle(200);
	});

	// разделяем числа на разряды
	function numberWithCommas(x) {
		return x.toString().replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "\$1,");
	}
	$('.js-replace-number').each(function() {
		$(this).html(numberWithCommas($(this).html()));
	});

	// показываем меню на мобильном
	$('.js-mob-trigger').on('click', function(){
		$(this).toggleClass('active');
		$(this).next().toggleClass('active');
		$(this).next().slideToggle(300);
	});

	// collapse block
	$('.js-slide-trigger').on('click', function() {
		$(this).parent().find('.js-slide-anchor').toggleClass('active');
		$(this).toggleClass('active');
		$(this).hasClass('active') ? $(this).html('Скрыть') : $(this).html('Показать еще');
	});

	// только цифры в инпутах
	$('.js-only-numbers').bind("change keyup input click", function() {
		if (this.value.match(/[^0-9\.]/g, '')) {
			this.value = this.value.replace(/[^0-9]/g, '');
		}
	});


	// слайдер цены
	var min = $('[range-min]'),
		max = $('[range-max]');

	$(".js-range").slider({
		range: true,
		min: 1,
		max: 10000,
		step: 1,
		values: [2000, 6000],
		slide: function(event, ui) {
			$(this).parents('.js-range-parent').find(min).val(ui.values[0] + ' ₴');
			$(this).parents('.js-range-parent').find(max).val(ui.values[1] + ' ₴');
		}
	});

	min.on('keyup', function() {
		$(this).parents('.js-range-parent').find('.js-range').slider("values", 0, $(this).val());
	});

	max.on('keyup', function() {
		$(this).parents('.js-range-parent').find('.js-range').slider("values", 1, $(this).val());
	});

	$('.filter__price-range-block-input').on('blur', function() {$(this).val($(this).val() + ' ₴');});

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


	// оформление псевдо селекта
	var trigger = $('.js-drop-trigger'),
		targetList = $('.js-drop-target'),
		targetVal = $('.js-drop-val');

	trigger.on('click', function(){
		if (!trigger.hasClass('active')) {
			$(this).next().slideToggle(300);
			$(this).addClass('active');
		}
	});
	targetVal.on('click', function(){
		targetVal.removeClass('active');
		$(this).addClass('active');
		targetList.slideToggle(300);
		trigger.html($(this).html());
		trigger.removeClass('active');
	});

	// закрываем сортировку по клику вне области
	$(document).mouseup(function(e) {
		if (targetList.has(e.target).length === 0 && trigger.has(e.target).length === 0) {
			targetList.slideUp(300);
			targetList.removeClass('active');
			trigger.removeClass('active');
		}
	});

	// разворачиваем облако тегов
	$('.js-tag-slide').on('click', function(){
		if ($(this).hasClass('active')) {
			$('.sidebar__tags-section').removeClass('active');
			$(this).html('Развернуть');	
			$(this).removeClass('active');
		} else {
			$(this).addClass('active');
			$('.sidebar__tags-section').addClass('active');
			$(this).html('Свернуть');
		}
		
	});

	// определяем мобильный ли браузер
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	if (isMobile.any()) {
		$('.header__bottom-menu-link').on('click', function(){
			if (!$(this).hasClass('mob-active')) {
				$('.header__bottom-menu-link').removeClass('mob-active');
				$(this).addClass('mob-active');
				return false;
			}
		});
	}

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