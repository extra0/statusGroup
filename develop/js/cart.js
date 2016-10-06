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
	$('[replaced-number]').each(function() {
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