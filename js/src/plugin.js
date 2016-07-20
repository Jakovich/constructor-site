/**
 * @Fyodorov Pavel Elaboration 2014
 * @link http://fpelab.com
 * @git https://bitbucket.org/fpelab
 */
/*
 *  Project: FPSlider
 *  Description:
 *  Author: Pavel Fedorov, Mon-key Studio, http://mon-key.ru
 *  License: MIT License 2014
 */
(function($, window, document, undefined) {

	// Create the defaults once
	var pluginName = 'construct',
		defaults = {
			afterStep: false,
			afterInit: false,
			callbacks: {
				onInitStart: false,
				onInitEnd: false,
				onPrepareSlide: false,
				onResizeSlide: false,
				onChangeSlide: false,
				onImagesLoaded: false,
				onSlidesLoaded: false,
			}
		},

		wHeight = $(window).height(),
		wWidth = $(window).width();



	// The actual plugin constructor
	function Plugin(element, options) {
		this.element     = element;
		this.$element    = $(element);
		this.options     = $.extend({}, defaults, options);
		this._defaults   = defaults;
		this._name       = pluginName;
		this._backup     = $(element).clone();
		this.total       = false;
		this.totalCount  = false;
		this.discount    = 0,
			this.backupMaket = {};
		this.backupColors = [];
		this.backup = [];

		this.defColors = ['#fff', '#fff'];

		this.defProps =
		{
			top:
			{
				tshirt:
				{
					colors: {
						'белый'   : '#fff',
						'желтый'  : '#ffda00',
						'оранжевый' : '#ED6E1E',
						'красный' : '#D62631',
						'голубой' : '#5EBCEB',
						'синий' : '#164C90',
						'темно-синий' : '#2C387C',
						'зеленый' : '#308939',
						'черный' : '#2B2A29'
					}
				},
				neck:
				{
					colors: {
						'черный' : '#000',
						'розовый': 'pink'
					}
				},
				sleeve:
				{
					colors: {
						'красный'   : 'red',
						'синий'  : 'blue',
						'зеленый' : 'green'
					}
				},
			}
		};

		this.defProt =
		{
			top:
			{
				tshirt:
				{
					typeID: false,
					color:  [],
					price:  false
				},
				neck:
				{
					color:  [],
				},
				sleeve:
				{
					color:  [],
				},
				sideInserts:
				{
					color: [],
					insert: false,
				},
				sleeveInserts:
				{
					color: [],
					insert: false,
				}
			},
			bottom:
			{
				shorts:
				{
					typeID: false,
					color:  [],
					price:  false
				}
			}
		};

		this.orderRow =
		{
			ID:             false,
			sername:        false,
			size:           false,
			longSleeves:    false,
			backSername:    false,
			shortsNumber:   false,
			backNumber:     false,
			chestNumber:    false,
			logo:           false
		};
		this.init();

	}

	/** =========================================
	 *   PRIVATE METHODS
	 ========================================= */
	var createColorOptions = function(arr)
	{
		var options = '';
		$.each(arr, function(key, val)
		{
			var option = '<button style="background: '+val+'" type="button" class="color-option" data-value="'+val+'"></button>';
			options = options + option;
		});
		return $(options);
	};


	var dynCheckbox = function($el) {
		var $cbW = $el,
			$target = $cbW.find('.checkbox-target'),
			$checkbox = $cbW.find('.checkbox');


		if($checkbox.prop('checked'))
		{
			$target.show();
		} else {
			$target.hide();
		}
	};

	/** =========================================
	 *   PUBLIC METHODS
	 ========================================= */

	/**
	 * Запускаем приложение
	 */
	Plugin.prototype.init = function()
	{
		var _this = this;
		this.showLoader();
		this.setDefColors();

		this.backupMaket = this.defProt;

		$('.form-screen').eq(0).addClass('activeSection');

		/*this.$element.on('click', '.js-goNextSection', function() {
			var $current = $(this).closest('.form-screen');
			var $next = $current.next();

			$current.fadeOut(0);
			$next.fadeIn(200, function() {
				_this.options.afterStep();
			});

			$('body,html').animate({
				'scrollTop': _this.$element.offset().top
			}, 300);

		});*/

		this.$element.on('click', '.default-maket', function() {
			_this.defProt = _this.backupMaket;
			_this.changeMaket();
			_this.defColors = _this.backupColors;
			_this.setDefColors();
		});

		this.$element.on('click', '.default-complects', function() {
			var $inputs = $(this).closest('form').find('table').find('input');
			$.each($inputs, function() {
				if($(this).attr('type') == 'text')
				{
					$(this).val(' ').change();
				} else {
					$(this).prop('checked', false).change();
				}
			});
		});

		this.$element.on('click', '.submitDiscount', function() {
			var code = $(this).parent().find('input').val();

			$.ajax({
				url: '/assets/snippets/saveorder/saveorder-ajax.php',
				type: 'post',
				dataType: 'JSON',
				data: {'discount': code},
				success: function (data) {
					if(data.result == true)
					{
						_this.discount = data.discount;
						_this.recountTotal();

						var $activeDiscount = $('<div class="discount-block success">Успешно активирована скидка на <b>'+data.discount+'%</b></div>')
						_this.$element.find('.discount-block').hide().after($activeDiscount);
					} else {
						_this.$element.find('.discount-block').addClass('error');
					}
				}
			});
		});

		this.$element.on('click', '.complects th', function() {
			var ind = $(this).index();
			var $complects  = $('.complects tr');
			var val = ($(this).hasClass('massChecked')) ? false : true ;
			$.each($complects, function(i) {
				if(i > 0)
				{
					$(this).find('td').eq(ind).find('input[type="checkbox"]').prop('checked', val).change();
				}
			});

			if($(this).hasClass('massChecked'))
			{
				$(this).removeClass('massChecked');
			} else {
				$(this).addClass('massChecked');
			}
		});


		var $dynCb = this.$element.find('.checkbox-dyn');

		$.each($dynCb, function() {
			dynCheckbox($(this));
			$(this).on('change', function() {
				dynCheckbox($(this));
			});
		});

		this.$element.on('change input', '.digital-input', function() {
			var $inp = $(this);
			$inp.val($inp.val().replace(/\D/g, ''));
		});



		/*this.$element.on('click', '.js-goPrevSection', function() {
			var $current = $(this).closest('.form-screen');
			var $next = $current.prev();

			$current.fadeOut(0);
			$next.fadeIn(200, function() {
				_this.options.afterStep();
			});

			$('body,html').animate({
				'scrollTop': _this.$element.offset().top
			}, 300);

		});*/

		$(document).on('click', '#popup-select button', function()
		{
			_this.popupSelect($(this));
		});
      
        $(document).on('click', '.select-shorts button', function() {
          $('.select-shorts button').removeClass('active-button');
          $(this).addClass('active-button');
        });
      
        $(document).on('click', '.select-tshirt button', function() {
          $('.select-tshirt button').removeClass('active-button');
          $(this).addClass('active-button');
        });

		this.$element.on('click', '.finishOrder', function()
		{
			var request = '';
			var $forms = _this.$element.find('form');
			$.each($forms, function() {
				request = request + $(this).serialize() + '&';
			});

			if(!$('.orderInfo').valid()) return;

			$.ajax({
				url: url,
				type: 'post',
				dataType: 'json',
				data: request,
				error: function() {
					swal('Ошибка', 'Произошла ошибка, попробуйте позже', 'error');
				},
				success: function(ans) {
					swal(ans.msgHeader, ans.msg, ans.type);
					swal({
							title: ans.msgHeader,
							text: ans.msg,
							type: ans.type,
							showCancelButton: false,
							closeOnConfirm: false,
							closeOnCancel: false },
						function(isConfirm){
							window.location.href = baseUrl;
						});
				}
			});
		});

		this.makeDefProt();

		this.$element.on('click', '.pick-color', function(){
			_this.pickColor($(this));
		});

		this.$element.find('.form-screen').eq(0).on('change', 'input, select', function(){
			_this.makeDefProt();
		});

		this.$element.find('.complects').on('change', 'input, select', function(){
			_this.recountTotal();
		});

		this.$element.on('click', '.switch', function() {
			_this.switchColors($(this));
		});

		this.$element.on('click', '.complectsCountBtn', function() {
			_this.changeComplectsCount();
		});


		this.step1 = this.$element.find('.step').eq(0).clone(true);
		this.step2 = this.$element.find('.step').eq(1).clone(true);
		this.step1Svg = $('#top-svg').attr('d');
		this.step2Svg = $('#bottom-svg').attr('d');

		this.$element.on('click', '.default-step-1', function() {
			var $newStep = _this.step1.clone(true);
			_this.$element.find('.step').eq(0).replaceWith($newStep);
			$('#top-svg').attr('d', _this.step1Svg);
			_this.makeDefProt();
            loadTshirts();
		});

		this.$element.on('click', '.default-step-2', function() {
			var $newStep = _this.step2.clone(true);
			_this.$element.find('.step').eq(1).replaceWith($newStep);
			$('#bottom-svg').attr('d', _this.step2Svg);
			_this.makeDefProt();
            loadShorts();
		});

		_this.options.afterInit();
		_this.changeComplectsCount();

	};

	Plugin.prototype.showLoader = function() {
		this.$element.find('.preview').addClass('loading');
	};

	Plugin.prototype.hideLoader = function() {
		var _this = this;
		setTimeout(function() {
			_this.$element.find('.preview').removeClass('loading');
		}, 200);

	};

	Plugin.prototype.changeComplectsCount = function()
	{
		var _this = this,
			complectsCount = $('.complectsCount').val(),
			currentCount = $('.complects').find('tr').length;

		if(complectsCount - 1 == currentCount) return;

		if(complectsCount <= currentCount - 1)
		{
			for (var it = 1; it <= currentCount - 1 - complectsCount; it++) {
				$('.complects').find('tr').last().remove();
			}
		} else {
			for (var i = currentCount; i <= complectsCount; i++) {
				var row = _this.createRow(i);
				var $row = $(row);
				$('.complects').append($row);
			}
		}

		_this.recountTotal();

		return;

	};

	Plugin.prototype.recountTotal = function()
	{
		var _this = this;
		var $row = $('.complects').find('.itemRow');
		var count = $row.length;
		totalCount = 0;
		$.each($row, function() {
			var $item = $(this);
			var $inputs = $item.find('input');
			var extraPrice = 0;
			$.each($inputs, function() {
				if($(this).prop('checked'))
				{
					extraPrice = extraPrice + parseInt($(this).attr('data-price'));
				}
			});
			var totalItem = _this.total + extraPrice;

			totalItem = totalItem - Math.floor(totalItem*(_this.discount/100));

			totalCount = totalCount + totalItem;
			$item.find('.priceInput').val(totalItem);
			$item.find('.price').text(totalItem);
		});

		var countText = '';

		if(count == 1) {
			countText = count + ' комплект';
		} else if(count > 1 && count < 5) {
			countText = count + ' комплекта';
		} else {
			countText = count + ' комплектов';
		}

		_this.$element.find('.total-price-input').val(totalCount);

		_this.$element.find('.totalCountBtn').text(totalCount);
		_this.$element.find('.complectsCountText').text(countText);

	};

	Plugin.prototype.createRow = function(i)
	{
		var options = '<option value="XS">XS</option><option value="S">S</option><option selected value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="2XL">2XL</option>';

		var row = '<tr class="itemRow"><td>'+ i +'</td>' +
			'<td><input class="digital-input" name="complect['+i+'][number]" type="text"></td>' +
			'<td data-tooltip="Необходимо заполнить, если нужна фамилия на спине футболки"><input name="complect['+i+'][sername]" type="text"></td>' +
			'<td><div class="select-wrp qtip-link"><select  name="complect['+i+'][size]" id="">'+options+'</select></div></td>' +
			'<td data-tooltip="Нажмите заголовок, чтобы выделить всю колонку"><div class="inline-block"><input data-price="'+longSleeves+'" name="complect['+i+'][longSleeves]" type="checkbox" id="'+i+'__1" value="да"><label for="'+i+'__1"></label></div></td>' +
			'<td data-tooltip="Нажмите заголовок, чтобы выделить всю колонку"><div class="inline-block"><input data-price="'+backSername+'" name="complect['+i+'][backSername]" type="checkbox" id="'+i+'__2" value="да"><label for="'+i+'__2"></label></div></td>' +
			'<td data-tooltip="Нажмите заголовок, чтобы выделить всю колонку"><div class="inline-block"><input data-price="'+shirtNumber+'" name="complect['+i+'][shirtNumber]" type="checkbox" id="'+i+'__3" value="да" ><label for="'+i+'__3"></label></div></td>' +
			'<td data-tooltip="Нажмите заголовок, чтобы выделить всю колонку"><div class="inline-block"><input data-price="'+backNumber+'" name="complect['+i+'][backNumber]" type="checkbox" id="'+i+'__4" value="да"><label for="'+i+'__4"></label></div></td>' +
			'<td data-tooltip="Нажмите заголовок, чтобы выделить всю колонку"><div class="inline-block"><input data-price="'+breastNumber+'" name="complect['+i+'][breastNumber]" type="checkbox" id="'+i+'__5" value="да"><label for="'+i+'__5"></label></div></td>' +
			'<td data-tooltip="Нажмите заголовок, чтобы выделить всю колонку"><div class="inline-block"><input data-price="'+logo+'" name="complect['+i+'][logo]" type="checkbox" id="'+i+'__6" value="да"><label for="'+i+'__6"></label></div></td>' +
			'<td class="price-td"><input name="complect['+i+'][price]" type="hidden" class="priceInput"><span class="price">1 260</span>&nbsp;.-</td></tr>';
		return row;
	};

	Plugin.prototype.popupSelect = function($el)
	{
		var _this = this;
		this.showLoader();
		var tmpPath = 'M6259 10176c0,0 286,108 250,1827 -23,1654 151,3300 109,4954 -23,1547 -434,2263 -334,3549 101,1286 -191,1237 -239,2463 -48,1226 -1324,2371 -507,3168 816,797 1069,813 2130,1518 1061,706 2042,1310 5578,1515 0,0 4609,-63 6976,-1607 464,-303 1803,-758 1687,-1358 -84,-434 -454,-2384 -719,-4325l-14818 -12525c-34,272 -71,546 -113,821z';
		var elementUrl = $el.attr('data-url');
		var elementId = $el.attr('data-id');

		$.ajax({
			url: elementUrl,
			type: 'get',
			data: {},
			success: function (svgPath) {
				console.log(svgPath);

				var $img, targetName;
				targetName = $el.closest('#popup-select').attr('data-target');
				$('.preview').find('svg').find('#'+targetName+'-svg').attr('d', svgPath);

				$img = $el.find('img').attr('src');


				$('.'+targetName+'-img').attr('src', $img);
				$('.'+targetName+'-img-inp').attr('value', $img);
				$('.'+targetName+'-input').attr('value', elementId);
				_this.changeMaket();
			}
		});
	};

	Plugin.prototype.setDefColors = function()
	{
		var $colorBlock = this.$element.find('.color-block');
		var _this = this;


		$.each($colorBlock, function() {
			var $el     = $(this),
				ind     = $el.index(),
				$input  = $el.find('input'),
				$btn    = $el.find('.pick-color');


			if(!$btn.hasClass('setted'))
			{
				var $row = $el.closest('.rowJS');
				if($row.hasClass('thirt'))
				{
					color = (ind == 0) ? _this.defColors[0] : _this.defColors[1];
				} else if($row.hasClass('sleeves')) {
					color = _this.defColors[0];
				} else if($row.hasClass('neck')) {
					color = _this.defColors[1];
				} else if($row.hasClass('shirtInserts')) {
					color = _this.defColors[1];
				} else if($row.hasClass('shorts')) {
					color = (ind == 0) ? _this.defColors[0] : _this.defColors[1];
				}


				$input.val(color);
				$el.addClass('setted').find('.color').css({
					'backgroundColor': color
				});
			}
		});
	};

	Plugin.prototype.makeDefProt = function()
	{
		var _this = this,
			$form = _this.$element.find('.fpc-section');

		_this.showLoader();

		$.each($form, function(){
			var $sForm          = $(this),
				sectionName     = $sForm.attr('data-section');

			var tmp = $sForm.serializeJSON();
			_this.defProt[sectionName] =tmp[sectionName];
		});

		_this.total = 0;
		$.each(_this.defProt, function(k,v) {
			_this.totalPrice(k,v);
		});

		this.changeMaket();

		this.$element.find('.price').find('.complectPrice').text(_this.total);
	};


	Plugin.prototype.changeMaket = function()
	{
		var _this = this;
		var $preview = $('.preview');
		var $leftSleeve, $rightSleeve, $tshirt, $mangets, $sideInserts, $shirt, $shirtInserts, $isnsert;



		$leftSleeve         = $preview.find('.fil2');
		$rightSleeve        = $preview.find('.fil3');
		$tshirt             = $preview.find('.fil0');
		$mangets            = $preview.find('.fil6');
		$sideInserts        = $preview.find('.fil5');
		$sleeveInserts      = $preview.find('.fil4');
		$shirt              = $preview.find('.fil7');
		$shirtInserts       = $preview.find('.fil9');
		$isnsert            = $preview.find('.fil1');
		$neck               = $preview.find('.fil6');


		/* $preview.find('.str1, .str0').css({
		 'stroke': _this.defProt.top.tshirt.color[0]
		 }); */


		if($('.top-input').attr('value') == 'AS44')
		{
			$('.extra-color').css('opacity','0.5');
			$('.extra-color').find('button').attr('disabled', true);
		} else {
			$('.extra-color').css('opacity','1');
			$('.extra-color').find('button').attr('disabled', false);
		}

		var greyLines = '#888';

		var shirtStr = (_this.defProt.bottom.shorts.color[0] == '#fff') ? greyLines : _this.defProt.bottom.shorts.color[0];

		$shirt.css({
			'fill' : _this.defProt.bottom.shorts.color[0],
			'stroke': shirtStr,
			'stroke-width': 80
		});

		//$preview.find('.str2').css({'stroke':  _this.defProt.bottom.shorts.color[0]});

		var shirtInsStr = (_this.defProt.bottom.shorts.color[0] == '#fff') ? greyLines : _this.defProt.bottom.shorts.color[1];
		$shirtInserts.css({
			'fill' : _this.defProt.bottom.shorts.color[1],
			'stroke': shirtStr,
			'stroke-width': 80
		});

		var leftSleeveStr = (_this.defProt.top.sleeve.color[0] == '#fff') ? greyLines : _this.defProt.top.sleeve.color[0];
		$leftSleeve.css({
			'fill' : _this.defProt.top.sleeve.color[0],
			'stroke': leftSleeveStr,
			'stroke-width': 80
		});

		var rightSleeveStr = (_this.defProt.top.sleeve.color[1] == '#fff') ? greyLines : _this.defProt.top.sleeve.color[1];
		$rightSleeve.css({
			'fill' : _this.defProt.top.sleeve.color[1],
			'stroke': rightSleeveStr,
			'stroke-width': 80
		});

		var tshirtStr = (_this.defProt.top.tshirt.color[0] == '#fff') ? greyLines : _this.defProt.top.tshirt.color[0];
		$tshirt.css({
			'fill' : _this.defProt.top.tshirt.color[0],
			'stroke': tshirtStr,
			'stroke-width': 80
		});

		var isnsertStr = (_this.defProt.top.tshirt.color[1] == '#fff') ? greyLines : _this.defProt.top.tshirt.color[1];
		$isnsert.css({
			'fill' : _this.defProt.top.tshirt.color[1],
			'stroke': isnsertStr,
			'stroke-width': 80
		});

		var neckStr = (_this.defProt.top.neck.color[0] == '#fff') ? greyLines : _this.defProt.top.neck.color[0];
		console.log(neckStr, _this.defProt.top.neck.color[0])
		$neck.css({
			'fill' : _this.defProt.top.neck.color[0],
			'stroke': '#888',
			'stroke-width': 80
		});


		if(_this.defProt.top.sideInserts.insert === 'true') {
			$sideInserts.css({'fill' : _this.defProt.top.sideInserts.color[0]});
		} else {
			$sideInserts.css({'fill' : 'none'});
			$sideInserts.css({'stroke': _this.defProt.top.tshirt.color[0]});
		}

		if(_this.defProt.top.sleeveInserts.insert == 'true') {
			$sleeveInserts.css({'fill' : _this.defProt.top.sleeveInserts.color[0]});
		} else {
			$sleeveInserts.css({'fill' : 'none'});
			$sleeveInserts.css({'stroke': _this.defProt.top.tshirt.color[0]});
		}

		_this.hideLoader();

	};


	Plugin.prototype.totalPrice = function(key, val) {
		var _this = this;

		if(key == 'price')
		{
			if(val)
				_this.total = _this.total + parseInt(val);
		}

		value = val;
		if (value instanceof Object)
		{
			$.each(value, function(key, val)
			{
				_this.totalPrice(key, val);
			});
		}
	};

	Plugin.prototype.switchColors = function($el)
	{
		var _this = this, $next, $prev, nextTitle, prevTitle;

		$next = $el.next();
		$prev = $el.prev();

		nextTitle = $next.find('.title').text();
		prevTitle = $prev.find('.title').text();

		$el.before($next);
		$el.after($prev);

		$prev.find('.title').text(nextTitle);
		$next.find('.title').text(prevTitle);

		$next.find('input').change();
	};


	Plugin.prototype.pickColor = function($el)
	{
		var _this, source, sourceArr, availableColors, colors, $options, $popup, $wrp;

		_this       = this;
		source      = $el.attr('data-source');

		sourceArr = source.split('::');
		availableColors = this.defProps;

		for (var i = 0; i <= sourceArr.length - 1; i++) {
			var key = sourceArr[i];
			availableColors = availableColors[key];
		}

		colors =  availableColors.colors;

		$options = createColorOptions(colors);

		$popup = $('<div class="color-popup"></div>');
		$popup.append($options);

		$wrp = $el.closest('.color-block');

		if($wrp.hasClass('opened'))
		{
			$wrp.removeClass('opened').find('.color-popup').remove();
		} else {
			$popup.hide();
			$wrp.addClass('opened').append($popup);

			$popup.fadeIn(200, function() {
				$('body').on('click', popupDeligate);
			});
		}

		var popupDeligate = function(e)
		{
			if (!$popup.is(e.target) && $popup.has(e.target).length === 0) {
				$wrp.removeClass('opened').find('.color-popup').remove();
				$('body').off('click', popupDeligate);
			}
		};


		$popup.on('click', '.color-option', function()
		{
			var $colorValue = $(this).attr('data-value'),
				$colorWrp = $(this).closest('.color-block'),
				$input = $colorWrp.find('input');

			$colorWrp.removeClass('opened');
			$('body').off('click', popupDeligate);

			$input.val($colorValue).change();
			$popup.remove();
			$el.addClass('setted').find('.color').css({
				'backgroundColor': $colorValue
			});
		});

	};
  

	/**
	 * Возвращаем все на круги своя
	 * как было до запуска плагина
	 * @return {null}
	 */
	Plugin.prototype.destroy = function() {
		this.$element.replaceWith(this._backup);
		$.data(this, 'plugin_' + pluginName, null);
	};

	/**
	 * Возвращаем все на круги своя,
	 * и сразу вызываем плагин заново
	 * с предыдущими настроками
	 * @return {[type]} [description]
	 */
	Plugin.prototype.reInit = function() {
		var oldInstance = this;
		this.$element.replaceWith(this._backup);
		$.data(this._backup, 'plugin_' + oldInstance._name, new Plugin(this._backup, oldInstance.options));
	};

	/**
	 * Обновляем плагин
	 * Обновляем размеры слайдов
	 * Корректируем положение текущего слайда
	 * @return {[type]} [description]
	 */
	Plugin.prototype.update = function() {
		var $slides = this.$sRoll.find(this.options.slide),
			_this = this,
			index = this.$current.index();

		wHeight = $(window).height();
		wWidth = $(window).width();

		$.each($slides, function() {
			var $img = $(this).find('img');
			_this.resizeSlide($(this), $img);
		});

		this.goToSlide(index, true);
	};

	/**
	 * Инициализация прототипа в плагин
	 */
	$.fn[pluginName] = function(options) {
		var args = arguments;
		if (options === undefined || typeof options === 'object') {
			return this.each(function() {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
				}
			});
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
			var returns;
			this.each(function() {
				var instance = $.data(this, 'plugin_' + pluginName);
				if (instance instanceof Plugin && typeof instance[options] === 'function') {
					returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
				}
			});
			return returns !== undefined ? returns : this;
		}
	};
  
  //слайдер
  
  function htmSlider(){
        
      
        var slideWrap = $('.tshirt-slider__wrapper');
     
        var nextLink = $('.tshirt-slider__nav--next');
        var prevLink = $('.tshirt-slider__nav--prev');
        var playLink = $('.auto');
       
        var is_animate = false;
     
        var slideWidth = $('.tshirt-slider__wrapper li').outerWidth();
     
        var scrollSlider = slideWrap.position().left - slideWidth;
	     	
    
        nextLink.click(function(){
         if(!slideWrap.is(':animated')) {
          slideWrap
           .css({'left': scrollSlider})
           .find('li:last')
           .prependTo(slideWrap)
           .parent()
           .animate({left: 0}, 500);
         }
        });

     
        prevLink.click(function(){
          
        if(!slideWrap.is(':animated')) {
          slideWrap.animate({left: scrollSlider}, 500, function(){
           slideWrap
            .find('li:first')
            .appendTo(slideWrap)
            .parent()
            .css({'left': 0});
          });
         }  
        });
        }
  
  /* иницилизируем функцию слайдера и загрузку вариантов форм*/
    $(document).ready(function(){
      loadShorts();
      loadTshirts();
      
    })
    
    
  
  var loadTshirts = function() {
     $('.tshirt-slider__items').load('top.html', function() {
     $('.tshirt-slider__items').find('ul').addClass('tshirt-slider__wrapper');
     htmSlider();
   });
  }
  
  var loadShorts = function() {
    $('.select-shorts').load('bottom.html');
  }
  
  
                    
  
        
        

}(jQuery, window, document));
