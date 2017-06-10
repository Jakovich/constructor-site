







/**
* ==============================================
* INIT BASE
* ==============================================
*/

(function ($, window, document, undefined) {

    /**
    * INITIALIZE ALL PLUGINS
    */
    var app = {
    	init: function() {
           
            form.init();
            
         
            var $preview = $('.preview');
            
            $preview.stick_in_parent({
                
            });
            
            

            $('#constructor').construct({
                /*afterStep: function() {
                    $preview.trigger("sticky_kit:recalc");
                },*/
                /*afterInit: function() {
                    $preview.trigger("sticky_kit:recalc");
                }*/
            });
            


            $('[data-tooltip!=""]').qtip({ // Grab all elements with a non-blank data-tooltip attr.
                content: {
                    attr: 'data-tooltip' // Tell qTip2 to look inside this attr for its content,
                },
                position: {
                    target: 'mouse', // Track the mouse as the positioning target
                    adjust: { x: 10, y: 10 } // Offset it slightly from under the mouse
                },
                style: {
                   classes: 'qtip-dark'
                }
            });

            $('.qtip-link').qtip({ // Grab all elements with a non-blank data-tooltip attr.
                content: '<a style="color: #fff; font-weight: 500;" href="size" target="_blank">Как выбрать размер?</a>',
                hide: {
                    fixed: true,
                    delay: 300
                },
                style: {
                   classes: 'qtip-dark'
                }
            });

    	}
    };


    var uploader = false;
    /**
    * INITIALIZE FORM PLUGINS
    */
    var form = {
        init: function() {
            $(document).find('.validate').validate();
            form.ajaxSubmit();
            $(document).find('.phone-input').mask("0 (000) 000-00-00");

            if(uploader !== false) return;

             uploader = new plupload.Uploader({
                            runtimes : 'html5,flash,silverlight,html4',
                            browse_button: 'pickfiles', // you can pass in id...
                            container: document.getElementById('file-container'), // ... or DOM Element itself
                            url: '#',
                            flash_swf_url: '#',
                            unique_names: true,
                            rename: true,
                            max_file_count: 3,
                            multi_selection: true,
                            multiple_queues: true,
                            silverlight_xap_url: '#',
                            filters: {
                                max_file_size: '5mb',
                                mime_types: [{
                                    title: "Image files",
                                    extensions: "jpg,gif,png,cdr,ai"
                                }, {
                                    title: "Zip files",
                                    extensions: "zip"
                                }, {
                                    title: "Doc files",
                                    extensions: "pdf,xml,xmls,xlsx,txt,rtf,odt,sxw,tex,doc,docx,docm"
                                }]
                            },

                            init: {
                                PostInit: function() {
                                    document.getElementById('filelist').innerHTML = '';
                                    document.getElementById('uploadfiles').onclick = function() {
                                        uploader.start();
                                        return false;
                                    };
                                },

                                FilesAdded: function(up, files) {
                                    document.getElementById('filelist').innerHTML = '';
                                    plupload.each(files, function(file) {
                                        document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
                                    });
                                    up.start();
                                },

                                UploadProgress: function(up, file) {
                                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                                },

                                Error: function(up, err) {
                                    //document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
                                },
                                UploadComplete: function(up, files) {
                                    var $attachedArr = [];

                                    $.each(files, function(i, file) {
                                        $attachedArr.push(file.target_name);
                                    });

                                    var logoStr = $attachedArr.join(',');

                                    $('.logo-input').val(logoStr);
                                }
                            }
                        });

                        uploader.init();


        },
        ajaxSubmit: function() {
            $(document).off('submit', '.ajaxSubmit');
            $(document).on('submit', '.ajaxSubmit', function(event) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
                var $url,$data,$el;
                $el = $(this);
                form.showLoader($el);
                $data = $(this).serialize();
                $url = $(this).attr('action');
                $.ajax({
                        url: $url,
                        type: "post",
                        dataType: "html",
                        data: $data,
                        error: function() {
                            alert('Произошла ошибка (код #001) отправки сообщения.');
                        },
                        complete: function() {
                            form.hideLoader($el);
                        },
                        success: function( strData ){
                            /*$.fancybox.close();
                            $.fancybox($(strData), {padding: 0});*/
                        }
                });
            })
        },
        showLoader: function($el) {

        },
        hideLoader: function($el) {

        }
    }

  $(document).ready(app.init)

})(jQuery, window, document);

/**
 * jquery.mask.js
 * @version: v1.11.2
 * @author: Igor Escobar
 *
 * Created by Igor Escobar on 2012-03-10. Please report any bug at http://blog.igorescobar.com
 *
 * Copyright (c) 2012 Igor Escobar http://blog.igorescobar.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*jshint laxbreak: true */
/* global define */

// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/jqueryPlugin.js
(function (factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["jquery"], factory);
	} else {
		// Browser globals
		factory(window.jQuery || window.Zepto);
	}
}(function ($) {
	"use strict";
	var Mask = function (el, mask, options) {
		el = $(el);

		var jMask = this, old_value = el.val(), regexMask;

		mask = typeof mask === "function" ? mask(el.val(), undefined, el,  options) : mask;

		var p = {
			invalid: [],
			getCaret: function () {
				try {
					var sel,
						pos = 0,
						ctrl = el.get(0),
						dSel = document.selection,
						cSelStart = ctrl.selectionStart;

					// IE Support
					if (dSel && navigator.appVersion.indexOf("MSIE 10") === -1) {
						sel = dSel.createRange();
						sel.moveStart('character', el.is("input") ? -el.val().length : -el.text().length);
						pos = sel.text.length;
					}
					// Firefox support
					else if (cSelStart || cSelStart === '0') {
						pos = cSelStart;
					}

					return pos;
				} catch (e) {}
			},
			setCaret: function(pos) {
				try {
					if (el.is(":focus")) {
						var range, ctrl = el.get(0);

						if (ctrl.setSelectionRange) {
							ctrl.setSelectionRange(pos,pos);
						} else if (ctrl.createTextRange) {
							range = ctrl.createTextRange();
							range.collapse(true);
							range.moveEnd('character', pos);
							range.moveStart('character', pos);
							range.select();
						}
					}
				} catch (e) {}
			},
			events: function() {
				el
					.on('keyup.mask', p.behaviour)
					.on("paste.mask drop.mask", function() {
						setTimeout(function() {
							el.keydown().keyup();
						}, 100);
					})
					.on('change.mask', function(){
						el.data('changed', true);
					})
					.on("blur.mask", function(){
						if (old_value !== el.val() && !el.data('changed')) {
							el.trigger("change");
						}
						el.data('changed', false);
					})
					// it's very important that this callback remains in this position
					// otherwhise old_value it's going to work buggy
					.on('keydown.mask, blur.mask', function() {
						old_value = el.val();
					})
					// select all text on focus
					.on('focus.mask', function (e) {
						if (options.selectOnFocus === true) {
							$(e.target).select();
						}
					})
					// clear the value if it not complete the mask
					.on("focusout.mask", function() {
						if (options.clearIfNotMatch && !regexMask.test(p.val())) {
							p.val('');
						}
					});
			},
			getRegexMask: function() {
				var maskChunks = [], translation, pattern, optional, recursive, oRecursive, r;

				for (var i = 0; i < mask.length; i++) {
					translation = jMask.translation[mask.charAt(i)];

					if (translation) {

						pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, "");
						optional = translation.optional;
						recursive = translation.recursive;

						if (recursive) {
							maskChunks.push(mask.charAt(i));
							oRecursive = {digit: mask.charAt(i), pattern: pattern};
						} else {
							maskChunks.push(!optional && !recursive ? pattern : (pattern + "?"));
						}

					} else {
						maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
					}
				}

				r = maskChunks.join("");

				if (oRecursive) {
					r = r.replace(new RegExp("(" + oRecursive.digit + "(.*" + oRecursive.digit + ")?)"), "($1)?")
						.replace(new RegExp(oRecursive.digit, "g"), oRecursive.pattern);
				}

				return new RegExp(r);
			},
			destroyEvents: function() {
				el.off(['keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.mask '));
			},
			val: function(v) {
				var isInput = el.is('input'),
					method = isInput ? 'val' : 'text',
					r;

				if (arguments.length > 0) {
					if (el[method]() !== v) {
						el[method](v);
					}
					r = el;
				} else {
					r = el[method]();
				}

				return r;
			},
			getMCharsBeforeCount: function(index, onCleanVal) {
				for (var count = 0, i = 0, maskL = mask.length; i < maskL && i < index; i++) {
					if (!jMask.translation[mask.charAt(i)]) {
						index = onCleanVal ? index + 1 : index;
						count++;
					}
				}
				return count;
			},
			caretPos: function (originalCaretPos, oldLength, newLength, maskDif) {
				var translation = jMask.translation[mask.charAt(Math.min(originalCaretPos - 1, mask.length - 1))];

				return !translation ? p.caretPos(originalCaretPos + 1, oldLength, newLength, maskDif)
					: Math.min(originalCaretPos + newLength - oldLength - maskDif, newLength);
			},
			behaviour: function(e) {
				e = e || window.event;
				p.invalid = [];
				var keyCode = e.keyCode || e.which;
				if ($.inArray(keyCode, jMask.byPassKeys) === -1) {

					var caretPos = p.getCaret(),
						currVal = p.val(),
						currValL = currVal.length,
						changeCaret = caretPos < currValL,
						newVal = p.getMasked(),
						newValL = newVal.length,
						maskDif = p.getMCharsBeforeCount(newValL - 1) - p.getMCharsBeforeCount(currValL - 1);

					p.val(newVal);

					// change caret but avoid CTRL+A
					if (changeCaret && !(keyCode === 65 && e.ctrlKey)) {
						// Avoid adjusting caret on backspace or delete
						if (!(keyCode === 8 || keyCode === 46)) {
							caretPos = p.caretPos(caretPos, currValL, newValL, maskDif);
						}
						p.setCaret(caretPos);
					}

					return p.callbacks(e);
				}
			},
			getMasked: function (skipMaskChars) {
				var buf = [],
					value = p.val(),
					m = 0, maskLen = mask.length,
					v = 0, valLen = value.length,
					offset = 1, addMethod = "push",
					resetPos = -1,
					lastMaskChar,
					check;

				if (options.reverse) {
					addMethod = "unshift";
					offset = -1;
					lastMaskChar = 0;
					m = maskLen - 1;
					v = valLen - 1;
					check = function () {
						return m > -1 && v > -1;
					};
				} else {
					lastMaskChar = maskLen - 1;
					check = function () {
						return m < maskLen && v < valLen;
					};
				}

				while (check()) {
					var maskDigit = mask.charAt(m),
						valDigit = value.charAt(v),
						translation = jMask.translation[maskDigit];

					if (translation) {
						if (valDigit.match(translation.pattern)) {
							buf[addMethod](valDigit);
							if (translation.recursive) {
								if (resetPos === -1) {
									resetPos = m;
								} else if (m === lastMaskChar) {
									m = resetPos - offset;
								}

								if (lastMaskChar === resetPos) {
									m -= offset;
								}
							}
							m += offset;
						} else if (translation.optional) {
							m += offset;
							v -= offset;
						} else if (translation.fallback) {
							buf[addMethod](translation.fallback);
							m += offset;
							v -= offset;
						} else {
							p.invalid.push({p: v, v: valDigit, e: translation.pattern});
						}
						v += offset;
					} else {
						if (!skipMaskChars) {
							buf[addMethod](maskDigit);
						}

						if (valDigit === maskDigit) {
							v += offset;
						}

						m += offset;
					}
				}

				var lastMaskCharDigit = mask.charAt(lastMaskChar);
				if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
					buf.push(lastMaskCharDigit);
				}

				return buf.join("");
			},
			callbacks: function (e) {
				var val = p.val(),
					changed = val !== old_value,
					defaultArgs = [val, e, el, options],
					callback = function(name, criteria, args) {
						if (typeof options[name] === "function" && criteria) {
							options[name].apply(this, args);
						}
					};

				callback('onChange', changed === true, defaultArgs);
				callback('onKeyPress', changed === true, defaultArgs);
				callback('onComplete', val.length === mask.length, defaultArgs);
				callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
			}
		};


		// public methods
		jMask.mask = mask;
		jMask.options = options;
		jMask.remove = function() {
			var caret = p.getCaret();
			p.destroyEvents();
			p.val(jMask.getCleanVal());
			p.setCaret(caret - p.getMCharsBeforeCount(caret));
			return el;
		};

		// get value without mask
		jMask.getCleanVal = function() {
			return p.getMasked(true);
		};

		jMask.init = function(only_mask) {
			only_mask = only_mask || false;
			options = options || {};

			jMask.byPassKeys = $.jMaskGlobals.byPassKeys;
			jMask.translation = $.jMaskGlobals.translation;

			jMask.translation = $.extend({}, jMask.translation, options.translation);
			jMask = $.extend(true, {}, jMask, options);

			regexMask = p.getRegexMask();

			if (only_mask === false) {

				if (options.placeholder) {
					el.attr('placeholder' , options.placeholder);
				}

				// autocomplete needs to be off. we can't intercept events
				// the browser doesn't  fire any kind of event when something is
				// selected in a autocomplete list so we can't sanitize it.
				el.attr('autocomplete', 'off');
				p.destroyEvents();
				p.events();

				var caret = p.getCaret();
				p.val(p.getMasked());
				p.setCaret(caret + p.getMCharsBeforeCount(caret, true));

			} else {
				p.events();
				p.val(p.getMasked());
			}
		};

		jMask.init(!el.is("input"));
	};

	$.maskWatchers = {};
	var HTMLAttributes = function () {
			var input = $(this),
				options = {},
				prefix = "data-mask-",
				mask = input.attr('data-mask');

			if (input.attr(prefix + 'reverse')) {
				options.reverse = true;
			}

			if (input.attr(prefix + 'clearifnotmatch')) {
				options.clearIfNotMatch = true;
			}

			if (input.attr(prefix + 'selectonfocus') === 'true') {
				options.selectOnFocus = true;
			}

			if (notSameMaskObject(input, mask, options)) {
				return input.data('mask', new Mask(this, mask, options));
			}
		},
		notSameMaskObject = function(field, mask, options) {
			options = options || {};
			var maskObject = $(field).data('mask'),
				stringify = JSON.stringify,
				value = $(field).val() || $(field).text();
			try {
				if (typeof mask === "function") {
					mask = mask(value);
				}
				return typeof maskObject !== "object" || stringify(maskObject.options) !== stringify(options) || maskObject.mask !== mask;
			} catch (e) {}
		};


	$.fn.mask = function(mask, options) {
		options = options || {};
		var selector = this.selector,
			globals = $.jMaskGlobals,
			interval = $.jMaskGlobals.watchInterval,
			maskFunction = function() {
				if (notSameMaskObject(this, mask, options)) {
					return $(this).data('mask', new Mask(this, mask, options));
				}
			};

		$(this).each(maskFunction);

		if (selector && selector !== "" && globals.watchInputs) {
			clearInterval($.maskWatchers[selector]);
			$.maskWatchers[selector] = setInterval(function(){
				$(document).find(selector).each(maskFunction);
			}, interval);
		}
		return this;
	};

	$.fn.unmask = function() {
		clearInterval($.maskWatchers[this.selector]);
		delete $.maskWatchers[this.selector];
		return this.each(function() {
			var dataMask = $(this).data('mask');
			if (dataMask) {
				dataMask.remove().removeData('mask');
			}
		});
	};

	$.fn.cleanVal = function() {
		return this.data('mask').getCleanVal();
	};

	$.applyDataMask = function() {
		$(document).find($.jMaskGlobals.maskElements).filter(globals.dataMaskAttr).each(HTMLAttributes);
	}

	var globals = {
		maskElements: 'input,td,span,div',
		dataMaskAttr: '*[data-mask]',
		dataMask: true,
		watchInterval: 300,
		watchInputs: true,
		watchDataMask: false,
		byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
		translation: {
			'0': {pattern: /\d/},
			'9': {pattern: /\d/, optional: true},
			'#': {pattern: /\d/, recursive: true},
			'A': {pattern: /[a-zA-Z0-9]/},
			'S': {pattern: /[a-zA-Z]/}
		}
	};

	$.jMaskGlobals = $.jMaskGlobals || {};
	globals = $.jMaskGlobals = $.extend(true, {}, globals, $.jMaskGlobals);

	// looking for inputs with data-mask attribute
	if (globals.dataMask) { $.applyDataMask(); }

	setInterval(function(){
		if ($.jMaskGlobals.watchDataMask) { $.applyDataMask(); }
	}, globals.watchInterval);
}));

/*!
 SerializeJSON jQuery plugin.
 https://github.com/marioizquierdo/jquery.serializeJSON
 version 2.4.1 (Oct, 2014)

 Copyright (c) 2014 Mario Izquierdo
 Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 */
(function ($) {
	"use strict";

	// jQuery('form').serializeJSON()
	$.fn.serializeJSON = function (options) {
		var serializedObject, formAsArray, keys, type, value, _ref, f, opts;
		f = $.serializeJSON;
		opts = f.optsWithDefaults(options); // calculate values for options {parseNumbers, parseBoolens, parseNulls}
		f.validateOptions(opts);
		formAsArray = this.serializeArray(); // array of objects {name, value}
		f.readCheckboxUncheckedValues(formAsArray, this, opts); // add {name, value} of unchecked checkboxes if needed

		serializedObject = {};
		$.each(formAsArray, function (i, input) {
			keys = f.splitInputNameIntoKeysArray(input.name);
			type = keys.pop(); // the last element is always the type ("string" by default)
			if (type !== 'skip') { // easy way to skip a value
				value = f.parseValue(input.value, type, opts); // string, number, boolean or null
				if (opts.parseWithFunction && type === '_') value = opts.parseWithFunction(value, input.name); // allow for custom parsing
				f.deepSet(serializedObject, keys, value, opts);
			}
		});
		return serializedObject;
	};

	// Use $.serializeJSON as namespace for the auxiliar functions
	// and to define defaults
	$.serializeJSON = {

		defaultOptions: {
			parseNumbers: false, // convert values like "1", "-2.33" to 1, -2.33
			parseBooleans: false, // convert "true", "false" to true, false
			parseNulls: false, // convert "null" to null
			parseAll: false, // all of the above
			parseWithFunction: null, // to use custom parser, a function like: function(val){ return parsed_val; }
			checkboxUncheckedValue: undefined, // to include that value for unchecked checkboxes (instead of ignoring them)
			useIntKeysAsArrayIndex: false // name="foo[2]" value="v" => {foo: [null, null, "v"]}, instead of {foo: ["2": "v"]}
		},

		// Merge options with defaults to get {parseNumbers, parseBoolens, parseNulls, useIntKeysAsArrayIndex}
		optsWithDefaults: function(options) {
			var f, parseAll;
			if (options == null) options = {}; // arg default value = {}
			f = $.serializeJSON;
			parseAll = f.optWithDefaults('parseAll', options);
			return {
				parseNumbers:  parseAll || f.optWithDefaults('parseNumbers',  options),
				parseBooleans: parseAll || f.optWithDefaults('parseBooleans', options),
				parseNulls:    parseAll || f.optWithDefaults('parseNulls',    options),
				parseWithFunction:         f.optWithDefaults('parseWithFunction', options),
				checkboxUncheckedValue:    f.optWithDefaults('checkboxUncheckedValue', options),
				useIntKeysAsArrayIndex:    f.optWithDefaults('useIntKeysAsArrayIndex', options)
			}
		},

		optWithDefaults: function(key, options) {
			return (options[key] !== false) && (options[key] !== '') && (options[key] || $.serializeJSON.defaultOptions[key]);
		},

		validateOptions: function(opts) {
			var opt, validOpts;
			validOpts = ['parseNumbers', 'parseBooleans', 'parseNulls', 'parseAll', 'parseWithFunction', 'checkboxUncheckedValue', 'useIntKeysAsArrayIndex']
			for (opt in opts) {
				if (validOpts.indexOf(opt) === -1) {
					throw new  Error("serializeJSON ERROR: invalid option '" + opt + "'. Please use one of " + validOpts.join(','));
				}
			}
		},

		// Convert the string to a number, boolean or null, depending on the enable option and the string format.
		parseValue: function(str, type, opts) {
			var value, f;
			f = $.serializeJSON;
			if (type == 'string') return str; // force string
			if (type == 'number'  || (opts.parseNumbers  && f.isNumeric(str))) return Number(str); // number
			if (type == 'boolean' || (opts.parseBooleans && (str === "true" || str === "false"))) return (["false", "null", "undefined", "", "0"].indexOf(str) === -1); // boolean
			if (type == 'null'    || (opts.parseNulls    && str == "null")) return ["false", "null", "undefined", "", "0"].indexOf(str) !== -1 ? null : str; // null
			if (type == 'array' || type == 'object') return JSON.parse(str); // array or objects require JSON
			if (type == 'auto') return f.parseValue(str, null, {parseNumbers: true, parseBooleans: true, parseNulls: true}); // try again with something like "parseAll"
			return str; // otherwise, keep same string
		},

		isObject:          function(obj) { return obj === Object(obj); }, // is this variable an object?
		isUndefined:       function(obj) { return obj === void 0; }, // safe check for undefined values
		isValidArrayIndex: function(val) { return /^[0-9]+$/.test(String(val)); }, // 1,2,3,4 ... are valid array indexes
		isNumeric:         function(obj) { return obj - parseFloat(obj) >= 0; }, // taken from jQuery.isNumeric implementation. Not using jQuery.isNumeric to support old jQuery and Zepto versions

		// Split the input name in programatically readable keys.
		// The last element is always the type (default "_").
		// Examples:
		// "foo"              => ['foo', '_']
		// "foo:string"       => ['foo', 'string']
		// "foo:boolean"      => ['foo', 'boolean']
		// "[foo]"            => ['foo', '_']
		// "foo[inn][bar]"    => ['foo', 'inn', 'bar', '_']
		// "foo[inn[bar]]"    => ['foo', 'inn', 'bar', '_']
		// "foo[inn][arr][0]" => ['foo', 'inn', 'arr', '0', '_']
		// "arr[][val]"       => ['arr', '', 'val', '_']
		// "arr[][val]:null"  => ['arr', '', 'val', 'null']
		splitInputNameIntoKeysArray: function (name) {
			var keys, nameWithoutType, type, _ref, f;
			f = $.serializeJSON;
			_ref = f.extractTypeFromInputName(name), nameWithoutType = _ref[0], type = _ref[1];
			keys = nameWithoutType.split('['); // split string into array
			keys = $.map(keys, function (key) { return key.replace(/]/g, ''); }); // remove closing brackets
			if (keys[0] === '') { keys.shift(); } // ensure no opening bracket ("[foo][inn]" should be same as "foo[inn]")
			keys.push(type); // add type at the end
			return keys;
		},

		// Returns [name-without-type, type] from name.
		// "foo"              =>  ["foo", "_"]
		// "foo:boolean"      =>  ["foo", "boolean"]
		// "foo[bar]:null"    =>  ["foo[bar]", "null"]
		extractTypeFromInputName: function(name) {
			var match, f;
			f = $.serializeJSON;
			if (match = name.match(/(.*):([^:]+)$/)){
				var validTypes = ['string', 'number', 'boolean', 'null', 'array', 'object', 'skip', 'auto']; // validate type
				if (validTypes.indexOf(match[2]) !== -1) {
					return [match[1], match[2]];
				} else {
					throw new Error("serializeJSON ERROR: Invalid type " + match[2] + " found in input name '" + name + "', please use one of " + validTypes.join(', '))
				}
			} else {
				return [name, '_']; // no defined type, then use parse options
			}
		},

		// Set a value in an object or array, using multiple keys to set in a nested object or array:
		//
		// deepSet(obj, ['foo'], v)               // obj['foo'] = v
		// deepSet(obj, ['foo', 'inn'], v)        // obj['foo']['inn'] = v // Create the inner obj['foo'] object, if needed
		// deepSet(obj, ['foo', 'inn', '123'], v) // obj['foo']['arr']['123'] = v //
		//
		// deepSet(obj, ['0'], v)                                   // obj['0'] = v
		// deepSet(arr, ['0'], v, {useIntKeysAsArrayIndex: true})   // arr[0] = v
		// deepSet(arr, [''], v)                                    // arr.push(v)
		// deepSet(obj, ['arr', ''], v)                             // obj['arr'].push(v)
		//
		// arr = [];
		// deepSet(arr, ['', v]          // arr => [v]
		// deepSet(arr, ['', 'foo'], v)  // arr => [v, {foo: v}]
		// deepSet(arr, ['', 'bar'], v)  // arr => [v, {foo: v, bar: v}]
		// deepSet(arr, ['', 'bar'], v)  // arr => [v, {foo: v, bar: v}, {bar: v}]
		//
		deepSet: function (o, keys, value, opts) {
			var key, nextKey, tail, lastIdx, lastVal, f;
			if (opts == null) opts = {};
			f = $.serializeJSON;
			if (f.isUndefined(o)) { throw new Error("ArgumentError: param 'o' expected to be an object or array, found undefined"); }
			if (!keys || keys.length === 0) { throw new Error("ArgumentError: param 'keys' expected to be an array with least one element"); }

			key = keys[0];

			// Only one key, then it's not a deepSet, just assign the value.
			if (keys.length === 1) {
				if (key === '') {
					o.push(value); // '' is used to push values into the array (assume o is an array)
				} else {
					o[key] = value; // other keys can be used as object keys or array indexes
				}

				// With more keys is a deepSet. Apply recursively.
			} else {

				nextKey = keys[1];

				// '' is used to push values into the array,
				// with nextKey, set the value into the same object, in object[nextKey].
				// Covers the case of ['', 'foo'] and ['', 'var'] to push the object {foo, var}, and the case of nested arrays.
				if (key === '') {
					lastIdx = o.length - 1; // asume o is array
					lastVal = o[lastIdx];
					if (f.isObject(lastVal) && (f.isUndefined(lastVal[nextKey]) || keys.length > 2)) { // if nextKey is not present in the last object element, or there are more keys to deep set
						key = lastIdx; // then set the new value in the same object element
					} else {
						key = lastIdx + 1; // otherwise, point to set the next index in the array
					}
				}

				// o[key] defaults to object or array, depending if nextKey is an array index (int or '') or an object key (string)
				if (f.isUndefined(o[key])) {
					if (nextKey === '') { // '' is used to push values into the array.
						o[key] = [];
					} else if (opts.useIntKeysAsArrayIndex && f.isValidArrayIndex(nextKey)) { // if 1, 2, 3 ... then use an array, where nextKey is the index
						o[key] = [];
					} else { // for anything else, use an object, where nextKey is going to be the attribute name
						o[key] = {};
					}
				}

				// Recursively set the inner object
				tail = keys.slice(1);
				f.deepSet(o[key], tail, value, opts);
			}
		},

		// Fill the formAsArray object with values for the unchecked checkbox inputs,
		// using the same format as the jquery.serializeArray function.
		// The value of the unchecked values is determined from the opts.checkboxUncheckedValue
		// and/or the data-unchecked-value attribute of the inputs.
		readCheckboxUncheckedValues: function (formAsArray, $form, opts) {
			var selector, $uncheckedCheckboxes, $el, dataUncheckedValue, f;
			if (opts == null) opts = {};
			f = $.serializeJSON;

			selector = 'input[type=checkbox][name]:not(:checked)';
			$uncheckedCheckboxes = $form.find(selector).add($form.filter(selector));
			$uncheckedCheckboxes.each(function (i, el) {
				$el = $(el);
				dataUncheckedValue = $el.attr('data-unchecked-value');
				if(dataUncheckedValue) { // data-unchecked-value has precedence over option opts.checkboxUncheckedValue
					formAsArray.push({name: el.name, value: dataUncheckedValue});
				} else {
					if (!f.isUndefined(opts.checkboxUncheckedValue)) {
						formAsArray.push({name: el.name, value: opts.checkboxUncheckedValue});
					}
				}
			});
		}

	};

}(window.jQuery || window.Zepto || window.$));

/*!
 * jQuery Validation Plugin v1.12.0
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2014 Jörn Zaefferer
 * Released under the MIT license
 */
(function($) {

	$.extend($.fn, {
		// http://jqueryvalidation.org/validate/
		validate: function( options ) {

			// if nothing is selected, return nothing; can't chain anyway
			if ( !this.length ) {
				if ( options && options.debug && window.console ) {
					console.warn( "Nothing selected, can't validate, returning nothing." );
				}
				return;
			}

			// check if a validator for this form was already created
			var validator = $.data( this[0], "validator" );
			if ( validator ) {
				return validator;
			}

			// Add novalidate tag if HTML5.
			this.attr( "novalidate", "novalidate" );

			validator = new $.validator( options, this[0] );
			$.data( this[0], "validator", validator );

			if ( validator.settings.onsubmit ) {

				this.validateDelegate( ":submit", "click", function( event ) {
					if ( validator.settings.submitHandler ) {
						validator.submitButton = event.target;
					}
					// allow suppressing validation by adding a cancel class to the submit button
					if ( $(event.target).hasClass("cancel") ) {
						validator.cancelSubmit = true;
					}

					// allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
					if ( $(event.target).attr("formnovalidate") !== undefined ) {
						validator.cancelSubmit = true;
					}
				});

				// validate the form on submit
				this.submit( function( event ) {
					if ( validator.settings.debug ) {
						// prevent form submit to be able to see console output
						event.preventDefault();
					}
					function handle() {
						var hidden;
						if ( validator.settings.submitHandler ) {
							if ( validator.submitButton ) {
								// insert a hidden input as a replacement for the missing submit button
								hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val( $(validator.submitButton).val() ).appendTo(validator.currentForm);
							}
							validator.settings.submitHandler.call( validator, validator.currentForm, event );
							if ( validator.submitButton ) {
								// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
								hidden.remove();
							}
							return false;
						}
						return true;
					}

					// prevent submit for invalid forms or custom submit handlers
					if ( validator.cancelSubmit ) {
						validator.cancelSubmit = false;
						return handle();
					}
					if ( validator.form() ) {
						if ( validator.pendingRequest ) {
							validator.formSubmitted = true;
							return false;
						}
						return handle();
					} else {
						validator.focusInvalid();
						return false;
					}
				});
			}

			return validator;
		},
		// http://jqueryvalidation.org/valid/
		valid: function() {
			var valid, validator;

			if ( $(this[0]).is("form")) {
				valid = this.validate().form();
			} else {
				valid = true;
				validator = $(this[0].form).validate();
				this.each(function() {
					valid = validator.element(this) && valid;
				});
			}
			return valid;
		},
		// attributes: space separated list of attributes to retrieve and remove
		removeAttrs: function( attributes ) {
			var result = {},
				$element = this;
			$.each(attributes.split(/\s/), function( index, value ) {
				result[value] = $element.attr(value);
				$element.removeAttr(value);
			});
			return result;
		},
		// http://jqueryvalidation.org/rules/
		rules: function( command, argument ) {
			var element = this[0],
				settings, staticRules, existingRules, data, param, filtered;

			if ( command ) {
				settings = $.data(element.form, "validator").settings;
				staticRules = settings.rules;
				existingRules = $.validator.staticRules(element);
				switch (command) {
					case "add":
						$.extend(existingRules, $.validator.normalizeRule(argument));
						// remove messages from rules, but allow them to be set separately
						delete existingRules.messages;
						staticRules[element.name] = existingRules;
						if ( argument.messages ) {
							settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
						}
						break;
					case "remove":
						if ( !argument ) {
							delete staticRules[element.name];
							return existingRules;
						}
						filtered = {};
						$.each(argument.split(/\s/), function( index, method ) {
							filtered[method] = existingRules[method];
							delete existingRules[method];
							if ( method === "required" ) {
								$(element).removeAttr("aria-required");
							}
						});
						return filtered;
				}
			}

			data = $.validator.normalizeRules(
				$.extend(
					{},
					$.validator.classRules(element),
					$.validator.attributeRules(element),
					$.validator.dataRules(element),
					$.validator.staticRules(element)
				), element);

			// make sure required is at front
			if ( data.required ) {
				param = data.required;
				delete data.required;
				data = $.extend({ required: param }, data );
				$(element).attr( "aria-required", "true" );
			}

			// make sure remote is at back
			if ( data.remote ) {
				param = data.remote;
				delete data.remote;
				data = $.extend( data, { remote: param });
			}

			return data;
		}
	});

// Custom selectors
	$.extend($.expr[":"], {
		// http://jqueryvalidation.org/blank-selector/
		blank: function( a ) { return !$.trim("" + $(a).val()); },
		// http://jqueryvalidation.org/filled-selector/
		filled: function( a ) { return !!$.trim("" + $(a).val()); },
		// http://jqueryvalidation.org/unchecked-selector/
		unchecked: function( a ) { return !$(a).prop("checked"); }
	});

// constructor for validator
	$.validator = function( options, form ) {
		this.settings = $.extend( true, {}, $.validator.defaults, options );
		this.currentForm = form;
		this.init();
	};

// http://jqueryvalidation.org/jQuery.validator.format/
	$.validator.format = function( source, params ) {
		if ( arguments.length === 1 ) {
			return function() {
				var args = $.makeArray(arguments);
				args.unshift(source);
				return $.validator.format.apply( this, args );
			};
		}
		if ( arguments.length > 2 && params.constructor !== Array  ) {
			params = $.makeArray(arguments).slice(1);
		}
		if ( params.constructor !== Array ) {
			params = [ params ];
		}
		$.each(params, function( i, n ) {
			source = source.replace( new RegExp("\\{" + i + "\\}", "g"), function() {
				return n;
			});
		});
		return source;
	};

	$.extend($.validator, {

		defaults: {
			messages: {},
			groups: {},
			rules: {},
			errorClass: "error",
			validClass: "valid",
			errorElement: "label",
			focusInvalid: true,
			errorContainer: $([]),
			errorLabelContainer: $([]),
			onsubmit: true,
			ignore: ":hidden",
			ignoreTitle: false,
			onfocusin: function( element ) {
				this.lastActive = element;

				// hide error label and remove error class on focus if enabled
				if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
					if ( this.settings.unhighlight ) {
						this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
					}
					this.addWrapper(this.errorsFor(element)).hide();
				}
			},
			onfocusout: function( element ) {
				if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
					this.element(element);
				}
			},
			onkeyup: function( element, event ) {
				if ( event.which === 9 && this.elementValue(element) === "" ) {
					return;
				} else if ( element.name in this.submitted || element === this.lastElement ) {
					this.element(element);
				}
			},
			onclick: function( element ) {
				// click on selects, radiobuttons and checkboxes
				if ( element.name in this.submitted ) {
					this.element(element);

					// or option elements, check parent select in that case
				} else if ( element.parentNode.name in this.submitted ) {
					this.element(element.parentNode);
				}
			},
			highlight: function( element, errorClass, validClass ) {
				if ( element.type === "radio" ) {
					this.findByName(element.name).addClass(errorClass).removeClass(validClass);
				} else {
					$(element).addClass(errorClass).removeClass(validClass);
				}
			},
			unhighlight: function( element, errorClass, validClass ) {
				if ( element.type === "radio" ) {
					this.findByName(element.name).removeClass(errorClass).addClass(validClass);
				} else {
					$(element).removeClass(errorClass).addClass(validClass);
				}
			}
		},

		// http://jqueryvalidation.org/jQuery.validator.setDefaults/
		setDefaults: function( settings ) {
			$.extend( $.validator.defaults, settings );
		},

		messages: {
			required: "This field is required.",
			remote: "Please fix this field.",
			email: "Please enter a valid email address.",
			url: "Please enter a valid URL.",
			date: "Please enter a valid date.",
			dateISO: "Please enter a valid date (ISO).",
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			creditcard: "Please enter a valid credit card number.",
			equalTo: "Please enter the same value again.",
			maxlength: $.validator.format("Please enter no more than {0} characters."),
			minlength: $.validator.format("Please enter at least {0} characters."),
			rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
			range: $.validator.format("Please enter a value between {0} and {1}."),
			max: $.validator.format("Please enter a value less than or equal to {0}."),
			min: $.validator.format("Please enter a value greater than or equal to {0}.")
		},

		autoCreateRanges: false,

		prototype: {

			init: function() {
				this.labelContainer = $(this.settings.errorLabelContainer);
				this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
				this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
				this.submitted = {};
				this.valueCache = {};
				this.pendingRequest = 0;
				this.pending = {};
				this.invalid = {};
				this.reset();

				var groups = (this.groups = {}),
					rules;
				$.each(this.settings.groups, function( key, value ) {
					if ( typeof value === "string" ) {
						value = value.split(/\s/);
					}
					$.each(value, function( index, name ) {
						groups[name] = key;
					});
				});
				rules = this.settings.rules;
				$.each(rules, function( key, value ) {
					rules[key] = $.validator.normalizeRule(value);
				});

				function delegate(event) {
					var validator = $.data(this[0].form, "validator"),
						eventType = "on" + event.type.replace(/^validate/, ""),
						settings = validator.settings;
					if ( settings[eventType] && !this.is( settings.ignore ) ) {
						settings[eventType].call(validator, this[0], event);
					}
				}
				$(this.currentForm)
					.validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
						"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
						"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
						"[type='week'], [type='time'], [type='datetime-local'], " +
						"[type='range'], [type='color'] ",
						"focusin focusout keyup", delegate)
					.validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

				if ( this.settings.invalidHandler ) {
					$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
				}

				// Add aria-required to any Static/Data/Class required fields before first validation
				// Screen readers require this attribute to be present before the initial submission http://www.w3.org/TR/WCAG-TECHS/ARIA2.html
				$(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true");
			},

			// http://jqueryvalidation.org/Validator.form/
			form: function() {
				this.checkForm();
				$.extend(this.submitted, this.errorMap);
				this.invalid = $.extend({}, this.errorMap);
				if ( !this.valid() ) {
					$(this.currentForm).triggerHandler("invalid-form", [ this ]);
				}
				this.showErrors();
				return this.valid();
			},

			checkForm: function() {
				this.prepareForm();
				for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
					this.check( elements[i] );
				}
				return this.valid();
			},

			// http://jqueryvalidation.org/Validator.element/
			element: function( element ) {
				var cleanElement = this.clean( element ),
					checkElement = this.validationTargetFor( cleanElement ),
					result = true;

				this.lastElement = checkElement;

				if ( checkElement === undefined ) {
					delete this.invalid[ cleanElement.name ];
				} else {
					this.prepareElement( checkElement );
					this.currentElements = $( checkElement );

					result = this.check( checkElement ) !== false;
					if (result) {
						delete this.invalid[checkElement.name];
					} else {
						this.invalid[checkElement.name] = true;
					}
				}
				// Add aria-invalid status for screen readers
				$( element ).attr( "aria-invalid", !result );

				if ( !this.numberOfInvalids() ) {
					// Hide error containers on last error
					this.toHide = this.toHide.add( this.containers );
				}
				this.showErrors();
				return result;
			},

			// http://jqueryvalidation.org/Validator.showErrors/
			showErrors: function( errors ) {
				if ( errors ) {
					// add items to error list and map
					$.extend( this.errorMap, errors );
					this.errorList = [];
					for ( var name in errors ) {
						this.errorList.push({
							message: errors[name],
							element: this.findByName(name)[0]
						});
					}
					// remove items from success list
					this.successList = $.grep( this.successList, function( element ) {
						return !(element.name in errors);
					});
				}
				if ( this.settings.showErrors ) {
					this.settings.showErrors.call( this, this.errorMap, this.errorList );
				} else {
					this.defaultShowErrors();
				}
			},

			// http://jqueryvalidation.org/Validator.resetForm/
			resetForm: function() {
				if ( $.fn.resetForm ) {
					$(this.currentForm).resetForm();
				}
				this.submitted = {};
				this.lastElement = null;
				this.prepareForm();
				this.hideErrors();
				this.elements()
					.removeClass( this.settings.errorClass )
					.removeData( "previousValue" )
					.removeAttr( "aria-invalid" );
			},

			numberOfInvalids: function() {
				return this.objectLength(this.invalid);
			},

			objectLength: function( obj ) {
				/* jshint unused: false */
				var count = 0,
					i;
				for ( i in obj ) {
					count++;
				}
				return count;
			},

			hideErrors: function() {
				this.addWrapper( this.toHide ).hide();
			},

			valid: function() {
				return this.size() === 0;
			},

			size: function() {
				return this.errorList.length;
			},

			focusInvalid: function() {
				if ( this.settings.focusInvalid ) {
					try {
						$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
							.filter(":visible")
							.focus()
							// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
							.trigger("focusin");
					} catch(e) {
						// ignore IE throwing errors when focusing hidden elements
					}
				}
			},

			findLastActive: function() {
				var lastActive = this.lastActive;
				return lastActive && $.grep(this.errorList, function( n ) {
						return n.element.name === lastActive.name;
					}).length === 1 && lastActive;
			},

			elements: function() {
				var validator = this,
					rulesCache = {};

				// select all valid inputs inside the form (no submit or reset buttons)
				return $(this.currentForm)
					.find("input, select, textarea")
					.not(":submit, :reset, :image, [disabled]")
					.not( this.settings.ignore )
					.filter(function() {
						if ( !this.name && validator.settings.debug && window.console ) {
							console.error( "%o has no name assigned", this);
						}

						// select only the first element for each name, and only those with rules specified
						if ( this.name in rulesCache || !validator.objectLength($(this).rules()) ) {
							return false;
						}

						rulesCache[this.name] = true;
						return true;
					});
			},

			clean: function( selector ) {
				return $(selector)[0];
			},

			errors: function() {
				var errorClass = this.settings.errorClass.split(" ").join(".");
				return $(this.settings.errorElement + "." + errorClass, this.errorContext);
			},

			reset: function() {
				this.successList = [];
				this.errorList = [];
				this.errorMap = {};
				this.toShow = $([]);
				this.toHide = $([]);
				this.currentElements = $([]);
			},

			prepareForm: function() {
				this.reset();
				this.toHide = this.errors().add( this.containers );
			},

			prepareElement: function( element ) {
				this.reset();
				this.toHide = this.errorsFor(element);
			},

			elementValue: function( element ) {
				var val,
					$element = $(element),
					type = $element.attr("type");

				if ( type === "radio" || type === "checkbox" ) {
					return $("input[name='" + $element.attr("name") + "']:checked").val();
				}

				val = $element.val();
				if ( typeof val === "string" ) {
					return val.replace(/\r/g, "");
				}
				return val;
			},

			check: function( element ) {
				element = this.validationTargetFor( this.clean( element ) );

				var rules = $(element).rules(),
					rulesCount = $.map( rules, function(n, i) {
						return i;
					}).length,
					dependencyMismatch = false,
					val = this.elementValue(element),
					result, method, rule;

				for (method in rules ) {
					rule = { method: method, parameters: rules[method] };
					try {

						result = $.validator.methods[method].call( this, val, element, rule.parameters );

						// if a method indicates that the field is optional and therefore valid,
						// don't mark it as valid when there are no other rules
						if ( result === "dependency-mismatch" && rulesCount === 1 ) {
							dependencyMismatch = true;
							continue;
						}
						dependencyMismatch = false;

						if ( result === "pending" ) {
							this.toHide = this.toHide.not( this.errorsFor(element) );
							return;
						}

						if ( !result ) {
							this.formatAndAdd( element, rule );
							return false;
						}
					} catch(e) {
						if ( this.settings.debug && window.console ) {
							console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
						}
						throw e;
					}
				}
				if ( dependencyMismatch ) {
					return;
				}
				if ( this.objectLength(rules) ) {
					this.successList.push(element);
				}
				return true;
			},

			// return the custom message for the given element and validation method
			// specified in the element's HTML5 data attribute
			// return the generic message if present and no method specific message is present
			customDataMessage: function( element, method ) {
				return $( element ).data( "msg" + method[ 0 ].toUpperCase() +
						method.substring( 1 ).toLowerCase() ) || $( element ).data("msg");
			},

			// return the custom message for the given element name and validation method
			customMessage: function( name, method ) {
				var m = this.settings.messages[name];
				return m && (m.constructor === String ? m : m[method]);
			},

			// return the first defined argument, allowing empty strings
			findDefined: function() {
				for (var i = 0; i < arguments.length; i++) {
					if ( arguments[i] !== undefined ) {
						return arguments[i];
					}
				}
				return undefined;
			},

			defaultMessage: function( element, method ) {
				return this.findDefined(
					this.customMessage( element.name, method ),
					this.customDataMessage( element, method ),
					// title is never undefined, so handle empty string as undefined
					!this.settings.ignoreTitle && element.title || undefined,
					$.validator.messages[method],
					"<strong>Warning: No message defined for " + element.name + "</strong>"
				);
			},

			formatAndAdd: function( element, rule ) {
				var message = this.defaultMessage( element, rule.method ),
					theregex = /\$?\{(\d+)\}/g;
				if ( typeof message === "function" ) {
					message = message.call(this, rule.parameters, element);
				} else if (theregex.test(message)) {
					message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
				}
				this.errorList.push({
					message: message,
					element: element,
					method: rule.method
				});

				this.errorMap[element.name] = message;
				this.submitted[element.name] = message;
			},

			addWrapper: function( toToggle ) {
				if ( this.settings.wrapper ) {
					toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
				}
				return toToggle;
			},

			defaultShowErrors: function() {
				var i, elements, error;
				for ( i = 0; this.errorList[i]; i++ ) {
					error = this.errorList[i];
					if ( this.settings.highlight ) {
						this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
					}
					this.showLabel( error.element, error.message );
				}
				if ( this.errorList.length ) {
					this.toShow = this.toShow.add( this.containers );
				}
				if ( this.settings.success ) {
					for ( i = 0; this.successList[i]; i++ ) {
						this.showLabel( this.successList[i] );
					}
				}
				if ( this.settings.unhighlight ) {
					for ( i = 0, elements = this.validElements(); elements[i]; i++ ) {
						this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
					}
				}
				this.toHide = this.toHide.not( this.toShow );
				this.hideErrors();
				this.addWrapper( this.toShow ).show();
			},

			validElements: function() {
				return this.currentElements.not(this.invalidElements());
			},

			invalidElements: function() {
				return $(this.errorList).map(function() {
					return this.element;
				});
			},

			showLabel: function( element, message ) {
				var label = this.errorsFor( element );
				if ( label.length ) {
					// refresh error/success class
					label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );
					// replace message on existing label
					label.html(message);
				} else {
					// create label
					label = $("<" + this.settings.errorElement + ">")
						.attr("for", this.idOrName(element))
						.addClass(this.settings.errorClass)
						.html(message || "");
					if ( this.settings.wrapper ) {
						// make sure the element is visible, even in IE
						// actually showing the wrapped element is handled elsewhere
						label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
					}
					if ( !this.labelContainer.append(label).length ) {
						if ( this.settings.errorPlacement ) {
							this.settings.errorPlacement(label, $(element) );
						} else {
							label.insertAfter(element);
						}
					}
				}
				if ( !message && this.settings.success ) {
					label.text("");
					if ( typeof this.settings.success === "string" ) {
						label.addClass( this.settings.success );
					} else {
						this.settings.success( label, element );
					}
				}
				this.toShow = this.toShow.add(label);
			},

			errorsFor: function( element ) {
				var name = this.idOrName(element);
				return this.errors().filter(function() {
					return $(this).attr("for") === name;
				});
			},

			idOrName: function( element ) {
				return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
			},

			validationTargetFor: function( element ) {
				// if radio/checkbox, validate first element in group instead
				if ( this.checkable(element) ) {
					element = this.findByName( element.name ).not(this.settings.ignore)[0];
				}
				return element;
			},

			checkable: function( element ) {
				return (/radio|checkbox/i).test(element.type);
			},

			findByName: function( name ) {
				return $(this.currentForm).find("[name='" + name + "']");
			},

			getLength: function( value, element ) {
				switch ( element.nodeName.toLowerCase() ) {
					case "select":
						return $("option:selected", element).length;
					case "input":
						if ( this.checkable( element) ) {
							return this.findByName(element.name).filter(":checked").length;
						}
				}
				return value.length;
			},

			depend: function( param, element ) {
				return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
			},

			dependTypes: {
				"boolean": function( param ) {
					return param;
				},
				"string": function( param, element ) {
					return !!$(param, element.form).length;
				},
				"function": function( param, element ) {
					return param(element);
				}
			},

			optional: function( element ) {
				var val = this.elementValue(element);
				return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
			},

			startRequest: function( element ) {
				if ( !this.pending[element.name] ) {
					this.pendingRequest++;
					this.pending[element.name] = true;
				}
			},

			stopRequest: function( element, valid ) {
				this.pendingRequest--;
				// sometimes synchronization fails, make sure pendingRequest is never < 0
				if ( this.pendingRequest < 0 ) {
					this.pendingRequest = 0;
				}
				delete this.pending[element.name];
				if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
					$(this.currentForm).submit();
					this.formSubmitted = false;
				} else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
					$(this.currentForm).triggerHandler("invalid-form", [ this ]);
					this.formSubmitted = false;
				}
			},

			previousValue: function( element ) {
				return $.data(element, "previousValue") || $.data(element, "previousValue", {
						old: null,
						valid: true,
						message: this.defaultMessage( element, "remote" )
					});
			}

		},

		classRuleSettings: {
			required: { required: true },
			email: { email: true },
			url: { url: true },
			date: { date: true },
			dateISO: { dateISO: true },
			number: { number: true },
			digits: { digits: true },
			creditcard: { creditcard: true }
		},

		addClassRules: function( className, rules ) {
			if ( className.constructor === String ) {
				this.classRuleSettings[className] = rules;
			} else {
				$.extend(this.classRuleSettings, className);
			}
		},

		classRules: function( element ) {
			var rules = {},
				classes = $(element).attr("class");

			if ( classes ) {
				$.each(classes.split(" "), function() {
					if ( this in $.validator.classRuleSettings ) {
						$.extend(rules, $.validator.classRuleSettings[this]);
					}
				});
			}
			return rules;
		},

		attributeRules: function( element ) {
			var rules = {},
				$element = $(element),
				type = element.getAttribute("type"),
				method, value;

			for (method in $.validator.methods) {

				// support for <input required> in both html5 and older browsers
				if ( method === "required" ) {
					value = element.getAttribute(method);
					// Some browsers return an empty string for the required attribute
					// and non-HTML5 browsers might have required="" markup
					if ( value === "" ) {
						value = true;
					}
					// force non-HTML5 browsers to return bool
					value = !!value;
				} else {
					value = $element.attr(method);
				}

				// convert the value to a number for number inputs, and for text for backwards compability
				// allows type="date" and others to be compared as strings
				if ( /min|max/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
					value = Number(value);
				}

				if ( value || value === 0 ) {
					rules[method] = value;
				} else if ( type === method && type !== "range" ) {
					// exception: the jquery validate 'range' method
					// does not test for the html5 'range' type
					rules[method] = true;
				}
			}

			// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
			if ( rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength) ) {
				delete rules.maxlength;
			}

			return rules;
		},

		dataRules: function( element ) {
			var method, value,
				rules = {}, $element = $( element );
			for ( method in $.validator.methods ) {
				value = $element.data( "rule" + method[ 0 ].toUpperCase() + method.substring( 1 ).toLowerCase() );
				if ( value !== undefined ) {
					rules[ method ] = value;
				}
			}
			return rules;
		},

		staticRules: function( element ) {
			var rules = {},
				validator = $.data(element.form, "validator");

			if ( validator.settings.rules ) {
				rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
			}
			return rules;
		},

		normalizeRules: function( rules, element ) {
			// handle dependency check
			$.each(rules, function( prop, val ) {
				// ignore rule when param is explicitly false, eg. required:false
				if ( val === false ) {
					delete rules[prop];
					return;
				}
				if ( val.param || val.depends ) {
					var keepRule = true;
					switch (typeof val.depends) {
						case "string":
							keepRule = !!$(val.depends, element.form).length;
							break;
						case "function":
							keepRule = val.depends.call(element, element);
							break;
					}
					if ( keepRule ) {
						rules[prop] = val.param !== undefined ? val.param : true;
					} else {
						delete rules[prop];
					}
				}
			});

			// evaluate parameters
			$.each(rules, function( rule, parameter ) {
				rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
			});

			// clean number parameters
			$.each([ "minlength", "maxlength" ], function() {
				if ( rules[this] ) {
					rules[this] = Number(rules[this]);
				}
			});
			$.each([ "rangelength", "range" ], function() {
				var parts;
				if ( rules[this] ) {
					if ( $.isArray(rules[this]) ) {
						rules[this] = [ Number(rules[this][0]), Number(rules[this][1]) ];
					} else if ( typeof rules[this] === "string" ) {
						parts = rules[this].split(/[\s,]+/);
						rules[this] = [ Number(parts[0]), Number(parts[1]) ];
					}
				}
			});

			if ( $.validator.autoCreateRanges ) {
				// auto-create ranges
				if ( rules.min && rules.max ) {
					rules.range = [ rules.min, rules.max ];
					delete rules.min;
					delete rules.max;
				}
				if ( rules.minlength && rules.maxlength ) {
					rules.rangelength = [ rules.minlength, rules.maxlength ];
					delete rules.minlength;
					delete rules.maxlength;
				}
			}

			return rules;
		},

		// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
		normalizeRule: function( data ) {
			if ( typeof data === "string" ) {
				var transformed = {};
				$.each(data.split(/\s/), function() {
					transformed[this] = true;
				});
				data = transformed;
			}
			return data;
		},

		// http://jqueryvalidation.org/jQuery.validator.addMethod/
		addMethod: function( name, method, message ) {
			$.validator.methods[name] = method;
			$.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
			if ( method.length < 3 ) {
				$.validator.addClassRules(name, $.validator.normalizeRule(name));
			}
		},

		methods: {

			// http://jqueryvalidation.org/required-method/
			required: function( value, element, param ) {
				// check if dependency is met
				if ( !this.depend(param, element) ) {
					return "dependency-mismatch";
				}
				if ( element.nodeName.toLowerCase() === "select" ) {
					// could be an array for select-multiple or a string, both are fine this way
					var val = $(element).val();
					return val && val.length > 0;
				}
				if ( this.checkable(element) ) {
					return this.getLength(value, element) > 0;
				}
				return $.trim(value).length > 0;
			},

			// http://jqueryvalidation.org/email-method/
			email: function( value, element ) {
				// From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
				// Retrieved 2014-01-14
				// If you have a problem with this implementation, report a bug against the above spec
				// Or use custom methods to implement your own email validation
				return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
			},

			// http://jqueryvalidation.org/url-method/
			url: function( value, element ) {
				// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
				return this.optional(element) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
			},

			// http://jqueryvalidation.org/date-method/
			date: function( value, element ) {
				return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
			},

			// http://jqueryvalidation.org/dateISO-method/
			dateISO: function( value, element ) {
				return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
			},

			// http://jqueryvalidation.org/number-method/
			number: function( value, element ) {
				return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
			},

			// http://jqueryvalidation.org/digits-method/
			digits: function( value, element ) {
				return this.optional(element) || /^\d+$/.test(value);
			},

			// http://jqueryvalidation.org/creditcard-method/
			// based on http://en.wikipedia.org/wiki/Luhn/
			creditcard: function( value, element ) {
				if ( this.optional(element) ) {
					return "dependency-mismatch";
				}
				// accept only spaces, digits and dashes
				if ( /[^0-9 \-]+/.test(value) ) {
					return false;
				}
				var nCheck = 0,
					nDigit = 0,
					bEven = false,
					n, cDigit;

				value = value.replace(/\D/g, "");

				// Basing min and max length on
				// http://developer.ean.com/general_info/Valid_Credit_Card_Types
				if ( value.length < 13 || value.length > 19 ) {
					return false;
				}

				for ( n = value.length - 1; n >= 0; n--) {
					cDigit = value.charAt(n);
					nDigit = parseInt(cDigit, 10);
					if ( bEven ) {
						if ( (nDigit *= 2) > 9 ) {
							nDigit -= 9;
						}
					}
					nCheck += nDigit;
					bEven = !bEven;
				}

				return (nCheck % 10) === 0;
			},

			// http://jqueryvalidation.org/minlength-method/
			minlength: function( value, element, param ) {
				var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
				return this.optional(element) || length >= param;
			},

			// http://jqueryvalidation.org/maxlength-method/
			maxlength: function( value, element, param ) {
				var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
				return this.optional(element) || length <= param;
			},

			// http://jqueryvalidation.org/rangelength-method/
			rangelength: function( value, element, param ) {
				var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
				return this.optional(element) || ( length >= param[0] && length <= param[1] );
			},

			// http://jqueryvalidation.org/min-method/
			min: function( value, element, param ) {
				return this.optional(element) || value >= param;
			},

			// http://jqueryvalidation.org/max-method/
			max: function( value, element, param ) {
				return this.optional(element) || value <= param;
			},

			// http://jqueryvalidation.org/range-method/
			range: function( value, element, param ) {
				return this.optional(element) || ( value >= param[0] && value <= param[1] );
			},

			// http://jqueryvalidation.org/equalTo-method/
			equalTo: function( value, element, param ) {
				// bind to the blur event of the target in order to revalidate whenever the target field is updated
				// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
				var target = $(param);
				if ( this.settings.onfocusout ) {
					target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
						$(element).valid();
					});
				}
				return value === target.val();
			},

			// http://jqueryvalidation.org/remote-method/
			remote: function( value, element, param ) {
				if ( this.optional(element) ) {
					return "dependency-mismatch";
				}

				var previous = this.previousValue(element),
					validator, data;

				if (!this.settings.messages[element.name] ) {
					this.settings.messages[element.name] = {};
				}
				previous.originalMessage = this.settings.messages[element.name].remote;
				this.settings.messages[element.name].remote = previous.message;

				param = typeof param === "string" && { url: param } || param;

				if ( previous.old === value ) {
					return previous.valid;
				}

				previous.old = value;
				validator = this;
				this.startRequest(element);
				data = {};
				data[element.name] = value;
				$.ajax($.extend(true, {
					url: param,
					mode: "abort",
					port: "validate" + element.name,
					dataType: "json",
					data: data,
					context: validator.currentForm,
					success: function( response ) {
						var valid = response === true || response === "true",
							errors, message, submitted;

						validator.settings.messages[element.name].remote = previous.originalMessage;
						if ( valid ) {
							submitted = validator.formSubmitted;
							validator.prepareElement(element);
							validator.formSubmitted = submitted;
							validator.successList.push(element);
							delete validator.invalid[element.name];
							validator.showErrors();
						} else {
							errors = {};
							message = response || validator.defaultMessage( element, "remote" );
							errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
							validator.invalid[element.name] = true;
							validator.showErrors(errors);
						}
						previous.valid = valid;
						validator.stopRequest(element, valid);
					}
				}, param));
				return "pending";
			}

		}

	});

	$.format = function deprecated() {
		throw "$.format has been deprecated. Please use $.validator.format instead.";
	};

}(jQuery));




// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
(function($) {
	var pendingRequests = {},
		ajax;
	// Use a prefilter if available (1.5+)
	if ( $.ajaxPrefilter ) {
		$.ajaxPrefilter(function( settings, _, xhr ) {
			var port = settings.port;
			if ( settings.mode === "abort" ) {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = xhr;
			}
		});
	} else {
		// Proxy ajax
		ajax = $.ajax;
		$.ajax = function( settings ) {
			var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
				port = ( "port" in settings ? settings : $.ajaxSettings ).port;
			if ( mode === "abort" ) {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = ajax.apply(this, arguments);
				return pendingRequests[port];
			}
			return ajax.apply(this, arguments);
		};
	}
}(jQuery));

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
	$.extend($.fn, {
		validateDelegate: function( delegate, type, handler ) {
			return this.bind(type, function( event ) {
				var target = $(event.target);
				if ( target.is(delegate) ) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
}(jQuery));




/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: RU (Russian; русский язык)
 */
(function($) {
	$.extend($.validator.messages, {
		required: "Это поле необходимо заполнить.",
		remote: "Пожалуйста, введите правильное значение.",
		email: "Пожалуйста, введите корректный адрес электронной почты.",
		url: "Пожалуйста, введите корректный URL.",
		date: "Пожалуйста, введите корректную дату.",
		dateISO: "Пожалуйста, введите корректную дату в формате ISO.",
		number: "Пожалуйста, введите число.",
		digits: "Пожалуйста, вводите только цифры.",
		creditcard: "Пожалуйста, введите правильный номер кредитной карты.",
		equalTo: "Пожалуйста, введите такое же значение ещё раз.",
		extension: "Пожалуйста, выберите файл с правильным расширением.",
		maxlength: $.validator.format("Пожалуйста, введите не больше {0} символов."),
		minlength: $.validator.format("Пожалуйста, введите не меньше {0} символов."),
		rangelength: $.validator.format("Пожалуйста, введите значение длиной от {0} до {1} символов."),
		range: $.validator.format("Пожалуйста, введите число от {0} до {1}."),
		max: $.validator.format("Пожалуйста, введите число, меньшее или равное {0}."),
		min: $.validator.format("Пожалуйста, введите число, большее или равное {0}.")
	});
}(jQuery));


/**
 * Оджинали аппиаред ин джейКоммон
 *
 * @author Vlad Yakovlev (red.scorpix@gmail.com)
 * @copyright Art.Lebedev Studio (http://www.artlebedev.ru)
 * @version 0.3 alpha 7
 * @date 2009-12-29
 * @requires jQuery 1.3.2
 *
 * Отслеживает изменение размеров окна браузера и масштабирование текста.
 * Отслеживание запускается только при добавлении первого хэндлера.
 *
 * @example
 * function funcBind() { alert('yoop'); }
 * measurer.bind(funcBind);
 * @description Теперь функция будет выполняться всякий раз, когда изменится размер окна браузера или размер текста.
 * measurer.unbind(funcBind);
 * @description А теперь — нет.
 *
 * @version 1.0
 */
$measurer = function() {

	var
		callbacks = [],
		interval = 500,
		curHeight,
		el = null,
		isInit = false,
		isDocReady = false;

	$(function() {
		isDocReady = true;
		isInit && initBlock();
	});

	function createBlock() {
		if (el == null) {
			el = $('<div></div>').css('height', '1em').css('left', '0').css('lineHeight', '1em').css('margin', '0').
			css('position', 'absolute').css('padding', '0').css('top', '-1em').css('visibility', 'hidden').
			css('width', '1em').appendTo('body');

			curHeight = el.height();
		}
	}

	function getHeight() {
		return curHeight;
	}

	function initBlock() {
		createBlock();

		$(window).resize(callFuncs);

		/**
		 * В IE событие <code>onresize</code> срабатывает и на элементах.
		 */

		/**
		 * Для остальных браузеров периодически проверяем изменение размера текста.
		 */
		curHeight = el.height();
		setInterval(function() {
			var newHeight = el.height();

			if (newHeight != curHeight) {
				curHeight = newHeight;
				callFuncs();
			}
		}, interval);
	}

	function callFuncs() {
		for(var i = 0; i < callbacks.length; i++) {
			callbacks[i]();
		}
	}

	return {
		/**
		 * Ручная инициализация события изменения размеров элементов на странице.
		 */
		resize: callFuncs,

		/**
		 * Добавляет обработчик события.
		 * @param {Function} func Ссылка на функцию, которую нужно выполнить.
		 */
		bind: function(func) {
			if (!el) {
				isInit = true;
				isDocReady && initBlock();
			}

			callbacks.push(func);
		},

		/**
		 * Удаляет обработчик события.
		 */
		unbind: function(func) {
			for(var i = 0; i < callbacks.length; i++) {
				callbacks[i] == func && callbacks.splice(i, 1);
			}
		},

		getHeight: getHeight,
		createBlock: createBlock
	};
}();

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

		/*_this.options.afterInit();*/
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
          slideWrap.animate({left: scrollSlider}, 500, function(){
           slideWrap
            .find('li:first')
            .appendTo(slideWrap)
            .parent()
            .css({'left': 0});
          });
         }
        });

     
        prevLink.click(function(){
          
        if(!slideWrap.is(':animated')) {
          slideWrap
           .css({'left': scrollSlider})
           .find('li:last')
           .prependTo(slideWrap)
           .parent()
           .animate({left: 0}, 500);
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

/*
 * qTip2 - Pretty powerful tooltips - v2.2.1
 * http://qtip2.com
 *
 * Copyright (c) 2014
 * Released under the MIT licenses
 * http://jquery.org/license
 *
 * Date: Sat Sep 6 2014 06:06 EDT-0400
 * Plugins: None
 * Styles: core basic css3
 */
/*global window: false, jQuery: false, console: false, define: false */

/* Cache window, document, undefined */
(function( window, document, undefined ) {

// Uses AMD or browser globals to create a jQuery plugin.
	(function( factory ) {
		"use strict";
		if(typeof define === 'function' && define.amd) {
			define(['jquery'], factory);
		}
		else if(jQuery && !jQuery.fn.qtip) {
			factory(jQuery);
		}
	}
	(function($) {
		"use strict"; // Enable ECMAScript "strict" operation for this function. See more: http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
		;// Munge the primitives - Paul Irish tip
		var TRUE = true,
			FALSE = false,
			NULL = null,

// Common variables
			X = 'x', Y = 'y',
			WIDTH = 'width',
			HEIGHT = 'height',

// Positioning sides
			TOP = 'top',
			LEFT = 'left',
			BOTTOM = 'bottom',
			RIGHT = 'right',
			CENTER = 'center',

// Position adjustment types
			FLIP = 'flip',
			FLIPINVERT = 'flipinvert',
			SHIFT = 'shift',

// Shortcut vars
			QTIP, PROTOTYPE, CORNER, CHECKS,
			PLUGINS = {},
			NAMESPACE = 'qtip',
			ATTR_HAS = 'data-hasqtip',
			ATTR_ID = 'data-qtip-id',
			WIDGET = ['ui-widget', 'ui-tooltip'],
			SELECTOR = '.'+NAMESPACE,
			INACTIVE_EVENTS = 'click dblclick mousedown mouseup mousemove mouseleave mouseenter'.split(' '),

			CLASS_FIXED = NAMESPACE+'-fixed',
			CLASS_DEFAULT = NAMESPACE + '-default',
			CLASS_FOCUS = NAMESPACE + '-focus',
			CLASS_HOVER = NAMESPACE + '-hover',
			CLASS_DISABLED = NAMESPACE+'-disabled',

			replaceSuffix = '_replacedByqTip',
			oldtitle = 'oldtitle',
			trackingBound,

// Browser detection
			BROWSER = {
				/*
				 * IE version detection
				 *
				 * Adapted from: http://ajaxian.com/archives/attack-of-the-ie-conditional-comment
				 * Credit to James Padolsey for the original implemntation!
				 */
				ie: (function(){
					for (
						var v = 4, i = document.createElement("div");
						(i.innerHTML = "<!--[if gt IE " + v + "]><i></i><![endif]-->") && i.getElementsByTagName("i")[0];
						v+=1
					) {}
					return v > 4 ? v : NaN;
				}()),

				/*
				 * iOS version detection
				 */
				iOS: parseFloat(
					('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,''])[1])
						.replace('undefined', '3_2').replace('_', '.').replace('_', '')
				) || FALSE
			};
		;function QTip(target, options, id, attr) {
			// Elements and ID
			this.id = id;
			this.target = target;
			this.tooltip = NULL;
			this.elements = { target: target };

			// Internal constructs
			this._id = NAMESPACE + '-' + id;
			this.timers = { img: {} };
			this.options = options;
			this.plugins = {};

			// Cache object
			this.cache = {
				event: {},
				target: $(),
				disabled: FALSE,
				attr: attr,
				onTooltip: FALSE,
				lastClass: ''
			};

			// Set the initial flags
			this.rendered = this.destroyed = this.disabled = this.waiting =
				this.hiddenDuringWait = this.positioning = this.triggering = FALSE;
		}
		PROTOTYPE = QTip.prototype;

		PROTOTYPE._when = function(deferreds) {
			return $.when.apply($, deferreds);
		};

		PROTOTYPE.render = function(show) {
			if(this.rendered || this.destroyed) { return this; } // If tooltip has already been rendered, exit

			var self = this,
				options = this.options,
				cache = this.cache,
				elements = this.elements,
				text = options.content.text,
				title = options.content.title,
				button = options.content.button,
				posOptions = options.position,
				namespace = '.'+this._id+' ',
				deferreds = [],
				tooltip;

			// Add ARIA attributes to target
			$.attr(this.target[0], 'aria-describedby', this._id);

			// Create public position object that tracks current position corners
			cache.posClass = this._createPosClass(
				(this.position = { my: posOptions.my, at: posOptions.at }).my
			);

			// Create tooltip element
			this.tooltip = elements.tooltip = tooltip = $('<div/>', {
				'id': this._id,
				'class': [ NAMESPACE, CLASS_DEFAULT, options.style.classes, cache.posClass ].join(' '),
				'width': options.style.width || '',
				'height': options.style.height || '',
				'tracking': posOptions.target === 'mouse' && posOptions.adjust.mouse,

				/* ARIA specific attributes */
				'role': 'alert',
				'aria-live': 'polite',
				'aria-atomic': FALSE,
				'aria-describedby': this._id + '-content',
				'aria-hidden': TRUE
			})
				.toggleClass(CLASS_DISABLED, this.disabled)
				.attr(ATTR_ID, this.id)
				.data(NAMESPACE, this)
				.appendTo(posOptions.container)
				.append(
					// Create content element
					elements.content = $('<div />', {
						'class': NAMESPACE + '-content',
						'id': this._id + '-content',
						'aria-atomic': TRUE
					})
				);

			// Set rendered flag and prevent redundant reposition calls for now
			this.rendered = -1;
			this.positioning = TRUE;

			// Create title...
			if(title) {
				this._createTitle();

				// Update title only if its not a callback (called in toggle if so)
				if(!$.isFunction(title)) {
					deferreds.push( this._updateTitle(title, FALSE) );
				}
			}

			// Create button
			if(button) { this._createButton(); }

			// Set proper rendered flag and update content if not a callback function (called in toggle)
			if(!$.isFunction(text)) {
				deferreds.push( this._updateContent(text, FALSE) );
			}
			this.rendered = TRUE;

			// Setup widget classes
			this._setWidget();

			// Initialize 'render' plugins
			$.each(PLUGINS, function(name) {
				var instance;
				if(this.initialize === 'render' && (instance = this(self))) {
					self.plugins[name] = instance;
				}
			});

			// Unassign initial events and assign proper events
			this._unassignEvents();
			this._assignEvents();

			// When deferreds have completed
			this._when(deferreds).then(function() {
				// tooltiprender event
				self._trigger('render');

				// Reset flags
				self.positioning = FALSE;

				// Show tooltip if not hidden during wait period
				if(!self.hiddenDuringWait && (options.show.ready || show)) {
					self.toggle(TRUE, cache.event, FALSE);
				}
				self.hiddenDuringWait = FALSE;
			});

			// Expose API
			QTIP.api[this.id] = this;

			return this;
		};

		PROTOTYPE.destroy = function(immediate) {
			// Set flag the signify destroy is taking place to plugins
			// and ensure it only gets destroyed once!
			if(this.destroyed) { return this.target; }

			function process() {
				if(this.destroyed) { return; }
				this.destroyed = TRUE;

				var target = this.target,
					title = target.attr(oldtitle),
					timer;

				// Destroy tooltip if rendered
				if(this.rendered) {
					this.tooltip.stop(1,0).find('*').remove().end().remove();
				}

				// Destroy all plugins
				$.each(this.plugins, function(name) {
					this.destroy && this.destroy();
				});

				// Clear timers
				for(timer in this.timers) {
					clearTimeout(this.timers[timer]);
				}

				// Remove api object and ARIA attributes
				target.removeData(NAMESPACE)
					.removeAttr(ATTR_ID)
					.removeAttr(ATTR_HAS)
					.removeAttr('aria-describedby');

				// Reset old title attribute if removed
				if(this.options.suppress && title) {
					target.attr('title', title).removeAttr(oldtitle);
				}

				// Remove qTip events associated with this API
				this._unassignEvents();

				// Remove ID from used id objects, and delete object references
				// for better garbage collection and leak protection
				this.options = this.elements = this.cache = this.timers =
					this.plugins = this.mouse = NULL;

				// Delete epoxsed API object
				delete QTIP.api[this.id];
			}

			// If an immediate destory is needed
			if((immediate !== TRUE || this.triggering === 'hide') && this.rendered) {
				this.tooltip.one('tooltiphidden', $.proxy(process, this));
				!this.triggering && this.hide();
			}

			// If we're not in the process of hiding... process
			else { process.call(this); }

			return this.target;
		};
		;function invalidOpt(a) {
			return a === NULL || $.type(a) !== 'object';
		}

		function invalidContent(c) {
			return !( $.isFunction(c) || (c && c.attr) || c.length || ($.type(c) === 'object' && (c.jquery || c.then) ));
		}

// Option object sanitizer
		function sanitizeOptions(opts) {
			var content, text, ajax, once;

			if(invalidOpt(opts)) { return FALSE; }

			if(invalidOpt(opts.metadata)) {
				opts.metadata = { type: opts.metadata };
			}

			if('content' in opts) {
				content = opts.content;

				if(invalidOpt(content) || content.jquery || content.done) {
					content = opts.content = {
						text: (text = invalidContent(content) ? FALSE : content)
					};
				}
				else { text = content.text; }

				// DEPRECATED - Old content.ajax plugin functionality
				// Converts it into the proper Deferred syntax
				if('ajax' in content) {
					ajax = content.ajax;
					once = ajax && ajax.once !== FALSE;
					delete content.ajax;

					content.text = function(event, api) {
						var loading = text || $(this).attr(api.options.content.attr) || 'Loading...',

							deferred = $.ajax(
								$.extend({}, ajax, { context: api })
							)
								.then(ajax.success, NULL, ajax.error)
								.then(function(content) {
										if(content && once) { api.set('content.text', content); }
										return content;
									},
									function(xhr, status, error) {
										if(api.destroyed || xhr.status === 0) { return; }
										api.set('content.text', status + ': ' + error);
									});

						return !once ? (api.set('content.text', loading), deferred) : loading;
					};
				}

				if('title' in content) {
					if($.isPlainObject(content.title)) {
						content.button = content.title.button;
						content.title = content.title.text;
					}

					if(invalidContent(content.title || FALSE)) {
						content.title = FALSE;
					}
				}
			}

			if('position' in opts && invalidOpt(opts.position)) {
				opts.position = { my: opts.position, at: opts.position };
			}

			if('show' in opts && invalidOpt(opts.show)) {
				opts.show = opts.show.jquery ? { target: opts.show } :
					opts.show === TRUE ? { ready: TRUE } : { event: opts.show };
			}

			if('hide' in opts && invalidOpt(opts.hide)) {
				opts.hide = opts.hide.jquery ? { target: opts.hide } : { event: opts.hide };
			}

			if('style' in opts && invalidOpt(opts.style)) {
				opts.style = { classes: opts.style };
			}

			// Sanitize plugin options
			$.each(PLUGINS, function() {
				this.sanitize && this.sanitize(opts);
			});

			return opts;
		}

// Setup builtin .set() option checks
		CHECKS = PROTOTYPE.checks = {
			builtin: {
				// Core checks
				'^id$': function(obj, o, v, prev) {
					var id = v === TRUE ? QTIP.nextid : v,
						new_id = NAMESPACE + '-' + id;

					if(id !== FALSE && id.length > 0 && !$('#'+new_id).length) {
						this._id = new_id;

						if(this.rendered) {
							this.tooltip[0].id = this._id;
							this.elements.content[0].id = this._id + '-content';
							this.elements.title[0].id = this._id + '-title';
						}
					}
					else { obj[o] = prev; }
				},
				'^prerender': function(obj, o, v) {
					v && !this.rendered && this.render(this.options.show.ready);
				},

				// Content checks
				'^content.text$': function(obj, o, v) {
					this._updateContent(v);
				},
				'^content.attr$': function(obj, o, v, prev) {
					if(this.options.content.text === this.target.attr(prev)) {
						this._updateContent( this.target.attr(v) );
					}
				},
				'^content.title$': function(obj, o, v) {
					// Remove title if content is null
					if(!v) { return this._removeTitle(); }

					// If title isn't already created, create it now and update
					v && !this.elements.title && this._createTitle();
					this._updateTitle(v);
				},
				'^content.button$': function(obj, o, v) {
					this._updateButton(v);
				},
				'^content.title.(text|button)$': function(obj, o, v) {
					this.set('content.'+o, v); // Backwards title.text/button compat
				},

				// Position checks
				'^position.(my|at)$': function(obj, o, v){
					'string' === typeof v && (this.position[o] = obj[o] = new CORNER(v, o === 'at'));
				},
				'^position.container$': function(obj, o, v){
					this.rendered && this.tooltip.appendTo(v);
				},

				// Show checks
				'^show.ready$': function(obj, o, v) {
					v && (!this.rendered && this.render(TRUE) || this.toggle(TRUE));
				},

				// Style checks
				'^style.classes$': function(obj, o, v, p) {
					this.rendered && this.tooltip.removeClass(p).addClass(v);
				},
				'^style.(width|height)': function(obj, o, v) {
					this.rendered && this.tooltip.css(o, v);
				},
				'^style.widget|content.title': function() {
					this.rendered && this._setWidget();
				},
				'^style.def': function(obj, o, v) {
					this.rendered && this.tooltip.toggleClass(CLASS_DEFAULT, !!v);
				},

				// Events check
				'^events.(render|show|move|hide|focus|blur)$': function(obj, o, v) {
					this.rendered && this.tooltip[($.isFunction(v) ? '' : 'un') + 'bind']('tooltip'+o, v);
				},

				// Properties which require event reassignment
				'^(show|hide|position).(event|target|fixed|inactive|leave|distance|viewport|adjust)': function() {
					if(!this.rendered) { return; }

					// Set tracking flag
					var posOptions = this.options.position;
					this.tooltip.attr('tracking', posOptions.target === 'mouse' && posOptions.adjust.mouse);

					// Reassign events
					this._unassignEvents();
					this._assignEvents();
				}
			}
		};

// Dot notation converter
		function convertNotation(options, notation) {
			var i = 0, obj, option = options,

			// Split notation into array
				levels = notation.split('.');

			// Loop through
			while( option = option[ levels[i++] ] ) {
				if(i < levels.length) { obj = option; }
			}

			return [obj || options, levels.pop()];
		}

		PROTOTYPE.get = function(notation) {
			if(this.destroyed) { return this; }

			var o = convertNotation(this.options, notation.toLowerCase()),
				result = o[0][ o[1] ];

			return result.precedance ? result.string() : result;
		};

		function setCallback(notation, args) {
			var category, rule, match;

			for(category in this.checks) {
				for(rule in this.checks[category]) {
					if(match = (new RegExp(rule, 'i')).exec(notation)) {
						args.push(match);

						if(category === 'builtin' || this.plugins[category]) {
							this.checks[category][rule].apply(
								this.plugins[category] || this, args
							);
						}
					}
				}
			}
		}

		var rmove = /^position\.(my|at|adjust|target|container|viewport)|style|content|show\.ready/i,
			rrender = /^prerender|show\.ready/i;

		PROTOTYPE.set = function(option, value) {
			if(this.destroyed) { return this; }

			var rendered = this.rendered,
				reposition = FALSE,
				options = this.options,
				checks = this.checks,
				name;

			// Convert singular option/value pair into object form
			if('string' === typeof option) {
				name = option; option = {}; option[name] = value;
			}
			else { option = $.extend({}, option); }

			// Set all of the defined options to their new values
			$.each(option, function(notation, value) {
				if(rendered && rrender.test(notation)) {
					delete option[notation]; return;
				}

				// Set new obj value
				var obj = convertNotation(options, notation.toLowerCase()), previous;
				previous = obj[0][ obj[1] ];
				obj[0][ obj[1] ] = value && value.nodeType ? $(value) : value;

				// Also check if we need to reposition
				reposition = rmove.test(notation) || reposition;

				// Set the new params for the callback
				option[notation] = [obj[0], obj[1], value, previous];
			});

			// Re-sanitize options
			sanitizeOptions(options);

			/*
			 * Execute any valid callbacks for the set options
			 * Also set positioning flag so we don't get loads of redundant repositioning calls.
			 */
			this.positioning = TRUE;
			$.each(option, $.proxy(setCallback, this));
			this.positioning = FALSE;

			// Update position if needed
			if(this.rendered && this.tooltip[0].offsetWidth > 0 && reposition) {
				this.reposition( options.position.target === 'mouse' ? NULL : this.cache.event );
			}

			return this;
		};
		;PROTOTYPE._update = function(content, element, reposition) {
			var self = this,
				cache = this.cache;

			// Make sure tooltip is rendered and content is defined. If not return
			if(!this.rendered || !content) { return FALSE; }

			// Use function to parse content
			if($.isFunction(content)) {
				content = content.call(this.elements.target, cache.event, this) || '';
			}

			// Handle deferred content
			if($.isFunction(content.then)) {
				cache.waiting = TRUE;
				return content.then(function(c) {
					cache.waiting = FALSE;
					return self._update(c, element);
				}, NULL, function(e) {
					return self._update(e, element);
				});
			}

			// If content is null... return false
			if(content === FALSE || (!content && content !== '')) { return FALSE; }

			// Append new content if its a DOM array and show it if hidden
			if(content.jquery && content.length > 0) {
				element.empty().append(
					content.css({ display: 'block', visibility: 'visible' })
				);
			}

			// Content is a regular string, insert the new content
			else { element.html(content); }

			// Wait for content to be loaded, and reposition
			return this._waitForContent(element).then(function(images) {
				if(self.rendered && self.tooltip[0].offsetWidth > 0) {
					self.reposition(cache.event, !images.length);
				}
			});
		};

		PROTOTYPE._waitForContent = function(element) {
			var cache = this.cache;

			// Set flag
			cache.waiting = TRUE;

			// If imagesLoaded is included, ensure images have loaded and return promise
			return ( $.fn.imagesLoaded ? element.imagesLoaded() : $.Deferred().resolve([]) )
				.done(function() { cache.waiting = FALSE; })
				.promise();
		};

		PROTOTYPE._updateContent = function(content, reposition) {
			this._update(content, this.elements.content, reposition);
		};

		PROTOTYPE._updateTitle = function(content, reposition) {
			if(this._update(content, this.elements.title, reposition) === FALSE) {
				this._removeTitle(FALSE);
			}
		};

		PROTOTYPE._createTitle = function()
		{
			var elements = this.elements,
				id = this._id+'-title';

			// Destroy previous title element, if present
			if(elements.titlebar) { this._removeTitle(); }

			// Create title bar and title elements
			elements.titlebar = $('<div />', {
				'class': NAMESPACE + '-titlebar ' + (this.options.style.widget ? createWidgetClass('header') : '')
			})
				.append(
					elements.title = $('<div />', {
						'id': id,
						'class': NAMESPACE + '-title',
						'aria-atomic': TRUE
					})
				)
				.insertBefore(elements.content)

				// Button-specific events
				.delegate('.qtip-close', 'mousedown keydown mouseup keyup mouseout', function(event) {
					$(this).toggleClass('ui-state-active ui-state-focus', event.type.substr(-4) === 'down');
				})
				.delegate('.qtip-close', 'mouseover mouseout', function(event){
					$(this).toggleClass('ui-state-hover', event.type === 'mouseover');
				});

			// Create button if enabled
			if(this.options.content.button) { this._createButton(); }
		};

		PROTOTYPE._removeTitle = function(reposition)
		{
			var elements = this.elements;

			if(elements.title) {
				elements.titlebar.remove();
				elements.titlebar = elements.title = elements.button = NULL;

				// Reposition if enabled
				if(reposition !== FALSE) { this.reposition(); }
			}
		};
		;PROTOTYPE._createPosClass = function(my) {
			return NAMESPACE + '-pos-' + (my || this.options.position.my).abbrev();
		};

		PROTOTYPE.reposition = function(event, effect) {
			if(!this.rendered || this.positioning || this.destroyed) { return this; }

			// Set positioning flag
			this.positioning = TRUE;

			var cache = this.cache,
				tooltip = this.tooltip,
				posOptions = this.options.position,
				target = posOptions.target,
				my = posOptions.my,
				at = posOptions.at,
				viewport = posOptions.viewport,
				container = posOptions.container,
				adjust = posOptions.adjust,
				method = adjust.method.split(' '),
				tooltipWidth = tooltip.outerWidth(FALSE),
				tooltipHeight = tooltip.outerHeight(FALSE),
				targetWidth = 0,
				targetHeight = 0,
				type = tooltip.css('position'),
				position = { left: 0, top: 0 },
				visible = tooltip[0].offsetWidth > 0,
				isScroll = event && event.type === 'scroll',
				win = $(window),
				doc = container[0].ownerDocument,
				mouse = this.mouse,
				pluginCalculations, offset, adjusted, newClass;

			// Check if absolute position was passed
			if($.isArray(target) && target.length === 2) {
				// Force left top and set position
				at = { x: LEFT, y: TOP };
				position = { left: target[0], top: target[1] };
			}

			// Check if mouse was the target
			else if(target === 'mouse') {
				// Force left top to allow flipping
				at = { x: LEFT, y: TOP };

				// Use the mouse origin that caused the show event, if distance hiding is enabled
				if((!adjust.mouse || this.options.hide.distance) && cache.origin && cache.origin.pageX) {
					event =  cache.origin;
				}

				// Use cached event for resize/scroll events
				else if(!event || (event && (event.type === 'resize' || event.type === 'scroll'))) {
					event = cache.event;
				}

				// Otherwise, use the cached mouse coordinates if available
				else if(mouse && mouse.pageX) {
					event = mouse;
				}

				// Calculate body and container offset and take them into account below
				if(type !== 'static') { position = container.offset(); }
				if(doc.body.offsetWidth !== (window.innerWidth || doc.documentElement.clientWidth)) {
					offset = $(document.body).offset();
				}

				// Use event coordinates for position
				position = {
					left: event.pageX - position.left + (offset && offset.left || 0),
					top: event.pageY - position.top + (offset && offset.top || 0)
				};

				// Scroll events are a pain, some browsers
				if(adjust.mouse && isScroll && mouse) {
					position.left -= (mouse.scrollX || 0) - win.scrollLeft();
					position.top -= (mouse.scrollY || 0) - win.scrollTop();
				}
			}

			// Target wasn't mouse or absolute...
			else {
				// Check if event targetting is being used
				if(target === 'event') {
					if(event && event.target && event.type !== 'scroll' && event.type !== 'resize') {
						cache.target = $(event.target);
					}
					else if(!event.target) {
						cache.target = this.elements.target;
					}
				}
				else if(target !== 'event'){
					cache.target = $(target.jquery ? target : this.elements.target);
				}
				target = cache.target;

				// Parse the target into a jQuery object and make sure there's an element present
				target = $(target).eq(0);
				if(target.length === 0) { return this; }

				// Check if window or document is the target
				else if(target[0] === document || target[0] === window) {
					targetWidth = BROWSER.iOS ? window.innerWidth : target.width();
					targetHeight = BROWSER.iOS ? window.innerHeight : target.height();

					if(target[0] === window) {
						position = {
							top: (viewport || target).scrollTop(),
							left: (viewport || target).scrollLeft()
						};
					}
				}

				// Check if the target is an <AREA> element
				else if(PLUGINS.imagemap && target.is('area')) {
					pluginCalculations = PLUGINS.imagemap(this, target, at, PLUGINS.viewport ? method : FALSE);
				}

				// Check if the target is an SVG element
				else if(PLUGINS.svg && target && target[0].ownerSVGElement) {
					pluginCalculations = PLUGINS.svg(this, target, at, PLUGINS.viewport ? method : FALSE);
				}

				// Otherwise use regular jQuery methods
				else {
					targetWidth = target.outerWidth(FALSE);
					targetHeight = target.outerHeight(FALSE);
					position = target.offset();
				}

				// Parse returned plugin values into proper variables
				if(pluginCalculations) {
					targetWidth = pluginCalculations.width;
					targetHeight = pluginCalculations.height;
					offset = pluginCalculations.offset;
					position = pluginCalculations.position;
				}

				// Adjust position to take into account offset parents
				position = this.reposition.offset(target, position, container);

				// Adjust for position.fixed tooltips (and also iOS scroll bug in v3.2-4.0 & v4.3-4.3.2)
				if((BROWSER.iOS > 3.1 && BROWSER.iOS < 4.1) ||
					(BROWSER.iOS >= 4.3 && BROWSER.iOS < 4.33) ||
					(!BROWSER.iOS && type === 'fixed')
				){
					position.left -= win.scrollLeft();
					position.top -= win.scrollTop();
				}

				// Adjust position relative to target
				if(!pluginCalculations || (pluginCalculations && pluginCalculations.adjustable !== FALSE)) {
					position.left += at.x === RIGHT ? targetWidth : at.x === CENTER ? targetWidth / 2 : 0;
					position.top += at.y === BOTTOM ? targetHeight : at.y === CENTER ? targetHeight / 2 : 0;
				}
			}

			// Adjust position relative to tooltip
			position.left += adjust.x + (my.x === RIGHT ? -tooltipWidth : my.x === CENTER ? -tooltipWidth / 2 : 0);
			position.top += adjust.y + (my.y === BOTTOM ? -tooltipHeight : my.y === CENTER ? -tooltipHeight / 2 : 0);

			// Use viewport adjustment plugin if enabled
			if(PLUGINS.viewport) {
				adjusted = position.adjusted = PLUGINS.viewport(
					this, position, posOptions, targetWidth, targetHeight, tooltipWidth, tooltipHeight
				);

				// Apply offsets supplied by positioning plugin (if used)
				if(offset && adjusted.left) { position.left += offset.left; }
				if(offset && adjusted.top) {  position.top += offset.top; }

				// Apply any new 'my' position
				if(adjusted.my) { this.position.my = adjusted.my; }
			}

			// Viewport adjustment is disabled, set values to zero
			else { position.adjusted = { left: 0, top: 0 }; }

			// Set tooltip position class if it's changed
			if(cache.posClass !== (newClass = this._createPosClass(this.position.my))) {
				tooltip.removeClass(cache.posClass).addClass( (cache.posClass = newClass) );
			}

			// tooltipmove event
			if(!this._trigger('move', [position, viewport.elem || viewport], event)) { return this; }
			delete position.adjusted;

			// If effect is disabled, target it mouse, no animation is defined or positioning gives NaN out, set CSS directly
			if(effect === FALSE || !visible || isNaN(position.left) || isNaN(position.top) || target === 'mouse' || !$.isFunction(posOptions.effect)) {
				tooltip.css(position);
			}

			// Use custom function if provided
			else if($.isFunction(posOptions.effect)) {
				posOptions.effect.call(tooltip, this, $.extend({}, position));
				tooltip.queue(function(next) {
					// Reset attributes to avoid cross-browser rendering bugs
					$(this).css({ opacity: '', height: '' });
					if(BROWSER.ie) { this.style.removeAttribute('filter'); }

					next();
				});
			}

			// Set positioning flag
			this.positioning = FALSE;

			return this;
		};

// Custom (more correct for qTip!) offset calculator
		PROTOTYPE.reposition.offset = function(elem, pos, container) {
			if(!container[0]) { return pos; }

			var ownerDocument = $(elem[0].ownerDocument),
				quirks = !!BROWSER.ie && document.compatMode !== 'CSS1Compat',
				parent = container[0],
				scrolled, position, parentOffset, overflow;

			function scroll(e, i) {
				pos.left += i * e.scrollLeft();
				pos.top += i * e.scrollTop();
			}

			// Compensate for non-static containers offset
			do {
				if((position = $.css(parent, 'position')) !== 'static') {
					if(position === 'fixed') {
						parentOffset = parent.getBoundingClientRect();
						scroll(ownerDocument, -1);
					}
					else {
						parentOffset = $(parent).position();
						parentOffset.left += (parseFloat($.css(parent, 'borderLeftWidth')) || 0);
						parentOffset.top += (parseFloat($.css(parent, 'borderTopWidth')) || 0);
					}

					pos.left -= parentOffset.left + (parseFloat($.css(parent, 'marginLeft')) || 0);
					pos.top -= parentOffset.top + (parseFloat($.css(parent, 'marginTop')) || 0);

					// If this is the first parent element with an overflow of "scroll" or "auto", store it
					if(!scrolled && (overflow = $.css(parent, 'overflow')) !== 'hidden' && overflow !== 'visible') { scrolled = $(parent); }
				}
			}
			while((parent = parent.offsetParent));

			// Compensate for containers scroll if it also has an offsetParent (or in IE quirks mode)
			if(scrolled && (scrolled[0] !== ownerDocument[0] || quirks)) {
				scroll(scrolled, 1);
			}

			return pos;
		};

// Corner class
		var C = (CORNER = PROTOTYPE.reposition.Corner = function(corner, forceY) {
			corner = ('' + corner).replace(/([A-Z])/, ' $1').replace(/middle/gi, CENTER).toLowerCase();
			this.x = (corner.match(/left|right/i) || corner.match(/center/) || ['inherit'])[0].toLowerCase();
			this.y = (corner.match(/top|bottom|center/i) || ['inherit'])[0].toLowerCase();
			this.forceY = !!forceY;

			var f = corner.charAt(0);
			this.precedance = (f === 't' || f === 'b' ? Y : X);
		}).prototype;

		C.invert = function(z, center) {
			this[z] = this[z] === LEFT ? RIGHT : this[z] === RIGHT ? LEFT : center || this[z];
		};

		C.string = function(join) {
			var x = this.x, y = this.y;

			var result = x !== y ?
				(x === 'center' || y !== 'center' && (this.precedance === Y || this.forceY) ?
						[y,x] : [x,y]
				) :
				[x];

			return join !== false ? result.join(' ') : result;
		};

		C.abbrev = function() {
			var result = this.string(false);
			return result[0].charAt(0) + (result[1] && result[1].charAt(0) || '');
		};

		C.clone = function() {
			return new CORNER( this.string(), this.forceY );
		};

		;
		PROTOTYPE.toggle = function(state, event) {
			var cache = this.cache,
				options = this.options,
				tooltip = this.tooltip;

			// Try to prevent flickering when tooltip overlaps show element
			if(event) {
				if((/over|enter/).test(event.type) && cache.event && (/out|leave/).test(cache.event.type) &&
					options.show.target.add(event.target).length === options.show.target.length &&
					tooltip.has(event.relatedTarget).length) {
					return this;
				}

				// Cache event
				cache.event = $.event.fix(event);
			}

			// If we're currently waiting and we've just hidden... stop it
			this.waiting && !state && (this.hiddenDuringWait = TRUE);

			// Render the tooltip if showing and it isn't already
			if(!this.rendered) { return state ? this.render(1) : this; }
			else if(this.destroyed || this.disabled) { return this; }

			var type = state ? 'show' : 'hide',
				opts = this.options[type],
				otherOpts = this.options[ !state ? 'show' : 'hide' ],
				posOptions = this.options.position,
				contentOptions = this.options.content,
				width = this.tooltip.css('width'),
				visible = this.tooltip.is(':visible'),
				animate = state || opts.target.length === 1,
				sameTarget = !event || opts.target.length < 2 || cache.target[0] === event.target,
				identicalState, allow, showEvent, delay, after;

			// Detect state if valid one isn't provided
			if((typeof state).search('boolean|number')) { state = !visible; }

			// Check if the tooltip is in an identical state to the new would-be state
			identicalState = !tooltip.is(':animated') && visible === state && sameTarget;

			// Fire tooltip(show/hide) event and check if destroyed
			allow = !identicalState ? !!this._trigger(type, [90]) : NULL;

			// Check to make sure the tooltip wasn't destroyed in the callback
			if(this.destroyed) { return this; }

			// If the user didn't stop the method prematurely and we're showing the tooltip, focus it
			if(allow !== FALSE && state) { this.focus(event); }

			// If the state hasn't changed or the user stopped it, return early
			if(!allow || identicalState) { return this; }

			// Set ARIA hidden attribute
			$.attr(tooltip[0], 'aria-hidden', !!!state);

			// Execute state specific properties
			if(state) {
				// Store show origin coordinates
				this.mouse && (cache.origin = $.event.fix(this.mouse));

				// Update tooltip content & title if it's a dynamic function
				if($.isFunction(contentOptions.text)) { this._updateContent(contentOptions.text, FALSE); }
				if($.isFunction(contentOptions.title)) { this._updateTitle(contentOptions.title, FALSE); }

				// Cache mousemove events for positioning purposes (if not already tracking)
				if(!trackingBound && posOptions.target === 'mouse' && posOptions.adjust.mouse) {
					$(document).bind('mousemove.'+NAMESPACE, this._storeMouse);
					trackingBound = TRUE;
				}

				// Update the tooltip position (set width first to prevent viewport/max-width issues)
				if(!width) { tooltip.css('width', tooltip.outerWidth(FALSE)); }
				this.reposition(event, arguments[2]);
				if(!width) { tooltip.css('width', ''); }

				// Hide other tooltips if tooltip is solo
				if(!!opts.solo) {
					(typeof opts.solo === 'string' ? $(opts.solo) : $(SELECTOR, opts.solo))
						.not(tooltip).not(opts.target).qtip('hide', $.Event('tooltipsolo'));
				}
			}
			else {
				// Clear show timer if we're hiding
				clearTimeout(this.timers.show);

				// Remove cached origin on hide
				delete cache.origin;

				// Remove mouse tracking event if not needed (all tracking qTips are hidden)
				if(trackingBound && !$(SELECTOR+'[tracking="true"]:visible', opts.solo).not(tooltip).length) {
					$(document).unbind('mousemove.'+NAMESPACE);
					trackingBound = FALSE;
				}

				// Blur the tooltip
				this.blur(event);
			}

			// Define post-animation, state specific properties
			after = $.proxy(function() {
				if(state) {
					// Prevent antialias from disappearing in IE by removing filter
					if(BROWSER.ie) { tooltip[0].style.removeAttribute('filter'); }

					// Remove overflow setting to prevent tip bugs
					tooltip.css('overflow', '');

					// Autofocus elements if enabled
					if('string' === typeof opts.autofocus) {
						$(this.options.show.autofocus, tooltip).focus();
					}

					// If set, hide tooltip when inactive for delay period
					this.options.show.target.trigger('qtip-'+this.id+'-inactive');
				}
				else {
					// Reset CSS states
					tooltip.css({
						display: '',
						visibility: '',
						opacity: '',
						left: '',
						top: ''
					});
				}

				// tooltipvisible/tooltiphidden events
				this._trigger(state ? 'visible' : 'hidden');
			}, this);

			// If no effect type is supplied, use a simple toggle
			if(opts.effect === FALSE || animate === FALSE) {
				tooltip[ type ]();
				after();
			}

			// Use custom function if provided
			else if($.isFunction(opts.effect)) {
				tooltip.stop(1, 1);
				opts.effect.call(tooltip, this);
				tooltip.queue('fx', function(n) {
					after(); n();
				});
			}

			// Use basic fade function by default
			else { tooltip.fadeTo(90, state ? 1 : 0, after); }

			// If inactive hide method is set, active it
			if(state) { opts.target.trigger('qtip-'+this.id+'-inactive'); }

			return this;
		};

		PROTOTYPE.show = function(event) { return this.toggle(TRUE, event); };

		PROTOTYPE.hide = function(event) { return this.toggle(FALSE, event); };
		;PROTOTYPE.focus = function(event) {
			if(!this.rendered || this.destroyed) { return this; }

			var qtips = $(SELECTOR),
				tooltip = this.tooltip,
				curIndex = parseInt(tooltip[0].style.zIndex, 10),
				newIndex = QTIP.zindex + qtips.length,
				focusedElem;

			// Only update the z-index if it has changed and tooltip is not already focused
			if(!tooltip.hasClass(CLASS_FOCUS)) {
				// tooltipfocus event
				if(this._trigger('focus', [newIndex], event)) {
					// Only update z-index's if they've changed
					if(curIndex !== newIndex) {
						// Reduce our z-index's and keep them properly ordered
						qtips.each(function() {
							if(this.style.zIndex > curIndex) {
								this.style.zIndex = this.style.zIndex - 1;
							}
						});

						// Fire blur event for focused tooltip
						qtips.filter('.' + CLASS_FOCUS).qtip('blur', event);
					}

					// Set the new z-index
					tooltip.addClass(CLASS_FOCUS)[0].style.zIndex = newIndex;
				}
			}

			return this;
		};

		PROTOTYPE.blur = function(event) {
			if(!this.rendered || this.destroyed) { return this; }

			// Set focused status to FALSE
			this.tooltip.removeClass(CLASS_FOCUS);

			// tooltipblur event
			this._trigger('blur', [ this.tooltip.css('zIndex') ], event);

			return this;
		};
		;PROTOTYPE.disable = function(state) {
			if(this.destroyed) { return this; }

			// If 'toggle' is passed, toggle the current state
			if(state === 'toggle') {
				state = !(this.rendered ? this.tooltip.hasClass(CLASS_DISABLED) : this.disabled);
			}

			// Disable if no state passed
			else if('boolean' !== typeof state) {
				state = TRUE;
			}

			if(this.rendered) {
				this.tooltip.toggleClass(CLASS_DISABLED, state)
					.attr('aria-disabled', state);
			}

			this.disabled = !!state;

			return this;
		};

		PROTOTYPE.enable = function() { return this.disable(FALSE); };
		;PROTOTYPE._createButton = function()
		{
			var self = this,
				elements = this.elements,
				tooltip = elements.tooltip,
				button = this.options.content.button,
				isString = typeof button === 'string',
				close = isString ? button : 'Close tooltip';

			if(elements.button) { elements.button.remove(); }

			// Use custom button if one was supplied by user, else use default
			if(button.jquery) {
				elements.button = button;
			}
			else {
				elements.button = $('<a />', {
					'class': 'qtip-close ' + (this.options.style.widget ? '' : NAMESPACE+'-icon'),
					'title': close,
					'aria-label': close
				})
					.prepend(
						$('<span />', {
							'class': 'ui-icon ui-icon-close',
							'html': '&times;'
						})
					);
			}

			// Create button and setup attributes
			elements.button.appendTo(elements.titlebar || tooltip)
				.attr('role', 'button')
				.click(function(event) {
					if(!tooltip.hasClass(CLASS_DISABLED)) { self.hide(event); }
					return FALSE;
				});
		};

		PROTOTYPE._updateButton = function(button)
		{
			// Make sure tooltip is rendered and if not, return
			if(!this.rendered) { return FALSE; }

			var elem = this.elements.button;
			if(button) { this._createButton(); }
			else { elem.remove(); }
		};
		;// Widget class creator
		function createWidgetClass(cls) {
			return WIDGET.concat('').join(cls ? '-'+cls+' ' : ' ');
		}

// Widget class setter method
		PROTOTYPE._setWidget = function()
		{
			var on = this.options.style.widget,
				elements = this.elements,
				tooltip = elements.tooltip,
				disabled = tooltip.hasClass(CLASS_DISABLED);

			tooltip.removeClass(CLASS_DISABLED);
			CLASS_DISABLED = on ? 'ui-state-disabled' : 'qtip-disabled';
			tooltip.toggleClass(CLASS_DISABLED, disabled);

			tooltip.toggleClass('ui-helper-reset '+createWidgetClass(), on).toggleClass(CLASS_DEFAULT, this.options.style.def && !on);

			if(elements.content) {
				elements.content.toggleClass( createWidgetClass('content'), on);
			}
			if(elements.titlebar) {
				elements.titlebar.toggleClass( createWidgetClass('header'), on);
			}
			if(elements.button) {
				elements.button.toggleClass(NAMESPACE+'-icon', !on);
			}
		};
		;function delay(callback, duration) {
			// If tooltip has displayed, start hide timer
			if(duration > 0) {
				return setTimeout(
					$.proxy(callback, this), duration
				);
			}
			else{ callback.call(this); }
		}

		function showMethod(event) {
			if(this.tooltip.hasClass(CLASS_DISABLED)) { return; }

			// Clear hide timers
			clearTimeout(this.timers.show);
			clearTimeout(this.timers.hide);

			// Start show timer
			this.timers.show = delay.call(this,
				function() { this.toggle(TRUE, event); },
				this.options.show.delay
			);
		}

		function hideMethod(event) {
			if(this.tooltip.hasClass(CLASS_DISABLED) || this.destroyed) { return; }

			// Check if new target was actually the tooltip element
			var relatedTarget = $(event.relatedTarget),
				ontoTooltip = relatedTarget.closest(SELECTOR)[0] === this.tooltip[0],
				ontoTarget = relatedTarget[0] === this.options.show.target[0];

			// Clear timers and stop animation queue
			clearTimeout(this.timers.show);
			clearTimeout(this.timers.hide);

			// Prevent hiding if tooltip is fixed and event target is the tooltip.
			// Or if mouse positioning is enabled and cursor momentarily overlaps
			if(this !== relatedTarget[0] &&
				(this.options.position.target === 'mouse' && ontoTooltip) ||
				(this.options.hide.fixed && (
					(/mouse(out|leave|move)/).test(event.type) && (ontoTooltip || ontoTarget))
				))
			{
				try {
					event.preventDefault();
					event.stopImmediatePropagation();
				} catch(e) {}

				return;
			}

			// If tooltip has displayed, start hide timer
			this.timers.hide = delay.call(this,
				function() { this.toggle(FALSE, event); },
				this.options.hide.delay,
				this
			);
		}

		function inactiveMethod(event) {
			if(this.tooltip.hasClass(CLASS_DISABLED) || !this.options.hide.inactive) { return; }

			// Clear timer
			clearTimeout(this.timers.inactive);

			this.timers.inactive = delay.call(this,
				function(){ this.hide(event); },
				this.options.hide.inactive
			);
		}

		function repositionMethod(event) {
			if(this.rendered && this.tooltip[0].offsetWidth > 0) { this.reposition(event); }
		}

// Store mouse coordinates
		PROTOTYPE._storeMouse = function(event) {
			(this.mouse = $.event.fix(event)).type = 'mousemove';
			return this;
		};

// Bind events
		PROTOTYPE._bind = function(targets, events, method, suffix, context) {
			if(!targets || !method || !events.length) { return; }
			var ns = '.' + this._id + (suffix ? '-'+suffix : '');
			$(targets).bind(
				(events.split ? events : events.join(ns + ' ')) + ns,
				$.proxy(method, context || this)
			);
			return this;
		};
		PROTOTYPE._unbind = function(targets, suffix) {
			targets && $(targets).unbind('.' + this._id + (suffix ? '-'+suffix : ''));
			return this;
		};

// Global delegation helper
		function delegate(selector, events, method) {
			$(document.body).delegate(selector,
				(events.split ? events : events.join('.'+NAMESPACE + ' ')) + '.'+NAMESPACE,
				function() {
					var api = QTIP.api[ $.attr(this, ATTR_ID) ];
					api && !api.disabled && method.apply(api, arguments);
				}
			);
		}
// Event trigger
		PROTOTYPE._trigger = function(type, args, event) {
			var callback = $.Event('tooltip'+type);
			callback.originalEvent = (event && $.extend({}, event)) || this.cache.event || NULL;

			this.triggering = type;
			this.tooltip.trigger(callback, [this].concat(args || []));
			this.triggering = FALSE;

			return !callback.isDefaultPrevented();
		};

		PROTOTYPE._bindEvents = function(showEvents, hideEvents, showTargets, hideTargets, showMethod, hideMethod) {
			// Get tasrgets that lye within both
			var similarTargets = showTargets.filter( hideTargets ).add( hideTargets.filter(showTargets) ),
				toggleEvents = [];

			// If hide and show targets are the same...
			if(similarTargets.length) {

				// Filter identical show/hide events
				$.each(hideEvents, function(i, type) {
					var showIndex = $.inArray(type, showEvents);

					// Both events are identical, remove from both hide and show events
					// and append to toggleEvents
					showIndex > -1 && toggleEvents.push( showEvents.splice( showIndex, 1 )[0] );
				});

				// Toggle events are special case of identical show/hide events, which happen in sequence
				if(toggleEvents.length) {
					// Bind toggle events to the similar targets
					this._bind(similarTargets, toggleEvents, function(event) {
						var state = this.rendered ? this.tooltip[0].offsetWidth > 0 : false;
						(state ? hideMethod : showMethod).call(this, event);
					});

					// Remove the similar targets from the regular show/hide bindings
					showTargets = showTargets.not(similarTargets);
					hideTargets = hideTargets.not(similarTargets);
				}
			}

			// Apply show/hide/toggle events
			this._bind(showTargets, showEvents, showMethod);
			this._bind(hideTargets, hideEvents, hideMethod);
		};

		PROTOTYPE._assignInitialEvents = function(event) {
			var options = this.options,
				showTarget = options.show.target,
				hideTarget = options.hide.target,
				showEvents = options.show.event ? $.trim('' + options.show.event).split(' ') : [],
				hideEvents = options.hide.event ? $.trim('' + options.hide.event).split(' ') : [];

			// Catch remove/removeqtip events on target element to destroy redundant tooltips
			this._bind(this.elements.target, ['remove', 'removeqtip'], function(event) {
				this.destroy(true);
			}, 'destroy');

			/*
			 * Make sure hoverIntent functions properly by using mouseleave as a hide event if
			 * mouseenter/mouseout is used for show.event, even if it isn't in the users options.
			 */
			if(/mouse(over|enter)/i.test(options.show.event) && !/mouse(out|leave)/i.test(options.hide.event)) {
				hideEvents.push('mouseleave');
			}

			/*
			 * Also make sure initial mouse targetting works correctly by caching mousemove coords
			 * on show targets before the tooltip has rendered. Also set onTarget when triggered to
			 * keep mouse tracking working.
			 */
			this._bind(showTarget, 'mousemove', function(event) {
				this._storeMouse(event);
				this.cache.onTarget = TRUE;
			});

			// Define hoverIntent function
			function hoverIntent(event) {
				// Only continue if tooltip isn't disabled
				if(this.disabled || this.destroyed) { return FALSE; }

				// Cache the event data
				this.cache.event = event && $.event.fix(event);
				this.cache.target = event && $(event.target);

				// Start the event sequence
				clearTimeout(this.timers.show);
				this.timers.show = delay.call(this,
					function() { this.render(typeof event === 'object' || options.show.ready); },
					options.prerender ? 0 : options.show.delay
				);
			}

			// Filter and bind events
			this._bindEvents(showEvents, hideEvents, showTarget, hideTarget, hoverIntent, function() {
				if(!this.timers) { return FALSE; }
				clearTimeout(this.timers.show);
			});

			// Prerendering is enabled, create tooltip now
			if(options.show.ready || options.prerender) { hoverIntent.call(this, event); }
		};

// Event assignment method
		PROTOTYPE._assignEvents = function() {
			var self = this,
				options = this.options,
				posOptions = options.position,

				tooltip = this.tooltip,
				showTarget = options.show.target,
				hideTarget = options.hide.target,
				containerTarget = posOptions.container,
				viewportTarget = posOptions.viewport,
				documentTarget = $(document),
				bodyTarget = $(document.body),
				windowTarget = $(window),

				showEvents = options.show.event ? $.trim('' + options.show.event).split(' ') : [],
				hideEvents = options.hide.event ? $.trim('' + options.hide.event).split(' ') : [];


			// Assign passed event callbacks
			$.each(options.events, function(name, callback) {
				self._bind(tooltip, name === 'toggle' ? ['tooltipshow','tooltiphide'] : ['tooltip'+name], callback, null, tooltip);
			});

			// Hide tooltips when leaving current window/frame (but not select/option elements)
			if(/mouse(out|leave)/i.test(options.hide.event) && options.hide.leave === 'window') {
				this._bind(documentTarget, ['mouseout', 'blur'], function(event) {
					if(!/select|option/.test(event.target.nodeName) && !event.relatedTarget) {
						this.hide(event);
					}
				});
			}

			// Enable hide.fixed by adding appropriate class
			if(options.hide.fixed) {
				hideTarget = hideTarget.add( tooltip.addClass(CLASS_FIXED) );
			}

			/*
			 * Make sure hoverIntent functions properly by using mouseleave to clear show timer if
			 * mouseenter/mouseout is used for show.event, even if it isn't in the users options.
			 */
			else if(/mouse(over|enter)/i.test(options.show.event)) {
				this._bind(hideTarget, 'mouseleave', function() {
					clearTimeout(this.timers.show);
				});
			}

			// Hide tooltip on document mousedown if unfocus events are enabled
			if(('' + options.hide.event).indexOf('unfocus') > -1) {
				this._bind(containerTarget.closest('html'), ['mousedown', 'touchstart'], function(event) {
					var elem = $(event.target),
						enabled = this.rendered && !this.tooltip.hasClass(CLASS_DISABLED) && this.tooltip[0].offsetWidth > 0,
						isAncestor = elem.parents(SELECTOR).filter(this.tooltip[0]).length > 0;

					if(elem[0] !== this.target[0] && elem[0] !== this.tooltip[0] && !isAncestor &&
						!this.target.has(elem[0]).length && enabled
					) {
						this.hide(event);
					}
				});
			}

			// Check if the tooltip hides when inactive
			if('number' === typeof options.hide.inactive) {
				// Bind inactive method to show target(s) as a custom event
				this._bind(showTarget, 'qtip-'+this.id+'-inactive', inactiveMethod, 'inactive');

				// Define events which reset the 'inactive' event handler
				this._bind(hideTarget.add(tooltip), QTIP.inactiveEvents, inactiveMethod);
			}

			// Filter and bind events
			this._bindEvents(showEvents, hideEvents, showTarget, hideTarget, showMethod, hideMethod);

			// Mouse movement bindings
			this._bind(showTarget.add(tooltip), 'mousemove', function(event) {
				// Check if the tooltip hides when mouse is moved a certain distance
				if('number' === typeof options.hide.distance) {
					var origin = this.cache.origin || {},
						limit = this.options.hide.distance,
						abs = Math.abs;

					// Check if the movement has gone beyond the limit, and hide it if so
					if(abs(event.pageX - origin.pageX) >= limit || abs(event.pageY - origin.pageY) >= limit) {
						this.hide(event);
					}
				}

				// Cache mousemove coords on show targets
				this._storeMouse(event);
			});

			// Mouse positioning events
			if(posOptions.target === 'mouse') {
				// If mouse adjustment is on...
				if(posOptions.adjust.mouse) {
					// Apply a mouseleave event so we don't get problems with overlapping
					if(options.hide.event) {
						// Track if we're on the target or not
						this._bind(showTarget, ['mouseenter', 'mouseleave'], function(event) {
							if(!this.cache) {return FALSE; }
							this.cache.onTarget = event.type === 'mouseenter';
						});
					}

					// Update tooltip position on mousemove
					this._bind(documentTarget, 'mousemove', function(event) {
						// Update the tooltip position only if the tooltip is visible and adjustment is enabled
						if(this.rendered && this.cache.onTarget && !this.tooltip.hasClass(CLASS_DISABLED) && this.tooltip[0].offsetWidth > 0) {
							this.reposition(event);
						}
					});
				}
			}

			// Adjust positions of the tooltip on window resize if enabled
			if(posOptions.adjust.resize || viewportTarget.length) {
				this._bind( $.event.special.resize ? viewportTarget : windowTarget, 'resize', repositionMethod );
			}

			// Adjust tooltip position on scroll of the window or viewport element if present
			if(posOptions.adjust.scroll) {
				this._bind( windowTarget.add(posOptions.container), 'scroll', repositionMethod );
			}
		};

// Un-assignment method
		PROTOTYPE._unassignEvents = function() {
			var options = this.options,
				showTargets = options.show.target,
				hideTargets = options.hide.target,
				targets = $.grep([
					this.elements.target[0],
					this.rendered && this.tooltip[0],
					options.position.container[0],
					options.position.viewport[0],
					options.position.container.closest('html')[0], // unfocus
					window,
					document
				], function(i) {
					return typeof i === 'object';
				});

			// Add show and hide targets if they're valid
			if(showTargets && showTargets.toArray) {
				targets = targets.concat(showTargets.toArray());
			}
			if(hideTargets && hideTargets.toArray) {
				targets = targets.concat(hideTargets.toArray());
			}

			// Unbind the events
			this._unbind(targets)
				._unbind(targets, 'destroy')
				._unbind(targets, 'inactive');
		};

// Apply common event handlers using delegate (avoids excessive .bind calls!)
		$(function() {
			delegate(SELECTOR, ['mouseenter', 'mouseleave'], function(event) {
				var state = event.type === 'mouseenter',
					tooltip = $(event.currentTarget),
					target = $(event.relatedTarget || event.target),
					options = this.options;

				// On mouseenter...
				if(state) {
					// Focus the tooltip on mouseenter (z-index stacking)
					this.focus(event);

					// Clear hide timer on tooltip hover to prevent it from closing
					tooltip.hasClass(CLASS_FIXED) && !tooltip.hasClass(CLASS_DISABLED) && clearTimeout(this.timers.hide);
				}

				// On mouseleave...
				else {
					// When mouse tracking is enabled, hide when we leave the tooltip and not onto the show target (if a hide event is set)
					if(options.position.target === 'mouse' && options.position.adjust.mouse &&
						options.hide.event && options.show.target && !target.closest(options.show.target[0]).length) {
						this.hide(event);
					}
				}

				// Add hover class
				tooltip.toggleClass(CLASS_HOVER, state);
			});

			// Define events which reset the 'inactive' event handler
			delegate('['+ATTR_ID+']', INACTIVE_EVENTS, inactiveMethod);
		});
		;// Initialization method
		function init(elem, id, opts) {
			var obj, posOptions, attr, config, title,

			// Setup element references
				docBody = $(document.body),

			// Use document body instead of document element if needed
				newTarget = elem[0] === document ? docBody : elem,

			// Grab metadata from element if plugin is present
				metadata = (elem.metadata) ? elem.metadata(opts.metadata) : NULL,

			// If metadata type if HTML5, grab 'name' from the object instead, or use the regular data object otherwise
				metadata5 = opts.metadata.type === 'html5' && metadata ? metadata[opts.metadata.name] : NULL,

			// Grab data from metadata.name (or data-qtipopts as fallback) using .data() method,
				html5 = elem.data(opts.metadata.name || 'qtipopts');

			// If we don't get an object returned attempt to parse it manualyl without parseJSON
			try { html5 = typeof html5 === 'string' ? $.parseJSON(html5) : html5; } catch(e) {}

			// Merge in and sanitize metadata
			config = $.extend(TRUE, {}, QTIP.defaults, opts,
				typeof html5 === 'object' ? sanitizeOptions(html5) : NULL,
				sanitizeOptions(metadata5 || metadata));

			// Re-grab our positioning options now we've merged our metadata and set id to passed value
			posOptions = config.position;
			config.id = id;

			// Setup missing content if none is detected
			if('boolean' === typeof config.content.text) {
				attr = elem.attr(config.content.attr);

				// Grab from supplied attribute if available
				if(config.content.attr !== FALSE && attr) { config.content.text = attr; }

				// No valid content was found, abort render
				else { return FALSE; }
			}

			// Setup target options
			if(!posOptions.container.length) { posOptions.container = docBody; }
			if(posOptions.target === FALSE) { posOptions.target = newTarget; }
			if(config.show.target === FALSE) { config.show.target = newTarget; }
			if(config.show.solo === TRUE) { config.show.solo = posOptions.container.closest('body'); }
			if(config.hide.target === FALSE) { config.hide.target = newTarget; }
			if(config.position.viewport === TRUE) { config.position.viewport = posOptions.container; }

			// Ensure we only use a single container
			posOptions.container = posOptions.container.eq(0);

			// Convert position corner values into x and y strings
			posOptions.at = new CORNER(posOptions.at, TRUE);
			posOptions.my = new CORNER(posOptions.my);

			// Destroy previous tooltip if overwrite is enabled, or skip element if not
			if(elem.data(NAMESPACE)) {
				if(config.overwrite) {
					elem.qtip('destroy', true);
				}
				else if(config.overwrite === FALSE) {
					return FALSE;
				}
			}

			// Add has-qtip attribute
			elem.attr(ATTR_HAS, id);

			// Remove title attribute and store it if present
			if(config.suppress && (title = elem.attr('title'))) {
				// Final attr call fixes event delegatiom and IE default tooltip showing problem
				elem.removeAttr('title').attr(oldtitle, title).attr('title', '');
			}

			// Initialize the tooltip and add API reference
			obj = new QTip(elem, config, id, !!attr);
			elem.data(NAMESPACE, obj);

			return obj;
		}

// jQuery $.fn extension method
		QTIP = $.fn.qtip = function(options, notation, newValue)
		{
			var command = ('' + options).toLowerCase(), // Parse command
				returned = NULL,
				args = $.makeArray(arguments).slice(1),
				event = args[args.length - 1],
				opts = this[0] ? $.data(this[0], NAMESPACE) : NULL;

			// Check for API request
			if((!arguments.length && opts) || command === 'api') {
				return opts;
			}

			// Execute API command if present
			else if('string' === typeof options) {
				this.each(function() {
					var api = $.data(this, NAMESPACE);
					if(!api) { return TRUE; }

					// Cache the event if possible
					if(event && event.timeStamp) { api.cache.event = event; }

					// Check for specific API commands
					if(notation && (command === 'option' || command === 'options')) {
						if(newValue !== undefined || $.isPlainObject(notation)) {
							api.set(notation, newValue);
						}
						else {
							returned = api.get(notation);
							return FALSE;
						}
					}

					// Execute API command
					else if(api[command]) {
						api[command].apply(api, args);
					}
				});

				return returned !== NULL ? returned : this;
			}

			// No API commands. validate provided options and setup qTips
			else if('object' === typeof options || !arguments.length) {
				// Sanitize options first
				opts = sanitizeOptions($.extend(TRUE, {}, options));

				return this.each(function(i) {
					var api, id;

					// Find next available ID, or use custom ID if provided
					id = $.isArray(opts.id) ? opts.id[i] : opts.id;
					id = !id || id === FALSE || id.length < 1 || QTIP.api[id] ? QTIP.nextid++ : id;

					// Initialize the qTip and re-grab newly sanitized options
					api = init($(this), id, opts);
					if(api === FALSE) { return TRUE; }
					else { QTIP.api[id] = api; }

					// Initialize plugins
					$.each(PLUGINS, function() {
						if(this.initialize === 'initialize') { this(api); }
					});

					// Assign initial pre-render events
					api._assignInitialEvents(event);
				});
			}
		};

// Expose class
		$.qtip = QTip;

// Populated in render method
		QTIP.api = {};
		;$.each({
			/* Allow other plugins to successfully retrieve the title of an element with a qTip applied */
			attr: function(attr, val) {
				if(this.length) {
					var self = this[0],
						title = 'title',
						api = $.data(self, 'qtip');

					if(attr === title && api && 'object' === typeof api && api.options.suppress) {
						if(arguments.length < 2) {
							return $.attr(self, oldtitle);
						}

						// If qTip is rendered and title was originally used as content, update it
						if(api && api.options.content.attr === title && api.cache.attr) {
							api.set('content.text', val);
						}

						// Use the regular attr method to set, then cache the result
						return this.attr(oldtitle, val);
					}
				}

				return $.fn['attr'+replaceSuffix].apply(this, arguments);
			},

			/* Allow clone to correctly retrieve cached title attributes */
			clone: function(keepData) {
				var titles = $([]), title = 'title',

				// Clone our element using the real clone method
					elems = $.fn['clone'+replaceSuffix].apply(this, arguments);

				// Grab all elements with an oldtitle set, and change it to regular title attribute, if keepData is false
				if(!keepData) {
					elems.filter('['+oldtitle+']').attr('title', function() {
						return $.attr(this, oldtitle);
					})
						.removeAttr(oldtitle);
				}

				return elems;
			}
		}, function(name, func) {
			if(!func || $.fn[name+replaceSuffix]) { return TRUE; }

			var old = $.fn[name+replaceSuffix] = $.fn[name];
			$.fn[name] = function() {
				return func.apply(this, arguments) || old.apply(this, arguments);
			};
		});

		/* Fire off 'removeqtip' handler in $.cleanData if jQuery UI not present (it already does similar).
		 * This snippet is taken directly from jQuery UI source code found here:
		 *     http://code.jquery.com/ui/jquery-ui-git.js
		 */
		if(!$.ui) {
			$['cleanData'+replaceSuffix] = $.cleanData;
			$.cleanData = function( elems ) {
				for(var i = 0, elem; (elem = $( elems[i] )).length; i++) {
					if(elem.attr(ATTR_HAS)) {
						try { elem.triggerHandler('removeqtip'); }
						catch( e ) {}
					}
				}
				$['cleanData'+replaceSuffix].apply(this, arguments);
			};
		}
		;// qTip version
		QTIP.version = '2.2.1';

// Base ID for all qTips
		QTIP.nextid = 0;

// Inactive events array
		QTIP.inactiveEvents = INACTIVE_EVENTS;

// Base z-index for all qTips
		QTIP.zindex = 15000;

// Define configuration defaults
		QTIP.defaults = {
			prerender: FALSE,
			id: FALSE,
			overwrite: TRUE,
			suppress: TRUE,
			content: {
				text: TRUE,
				attr: 'title',
				title: FALSE,
				button: FALSE
			},
			position: {
				my: 'top left',
				at: 'bottom right',
				target: FALSE,
				container: FALSE,
				viewport: FALSE,
				adjust: {
					x: 0, y: 0,
					mouse: TRUE,
					scroll: TRUE,
					resize: TRUE,
					method: 'flipinvert flipinvert'
				},
				effect: function(api, pos, viewport) {
					$(this).animate(pos, {
						duration: 200,
						queue: FALSE
					});
				}
			},
			show: {
				target: FALSE,
				event: 'mouseenter',
				effect: TRUE,
				delay: 90,
				solo: FALSE,
				ready: FALSE,
				autofocus: FALSE
			},
			hide: {
				target: FALSE,
				event: 'mouseleave',
				effect: TRUE,
				delay: 0,
				fixed: FALSE,
				inactive: FALSE,
				leave: 'window',
				distance: FALSE
			},
			style: {
				classes: '',
				widget: FALSE,
				width: FALSE,
				height: FALSE,
				def: TRUE
			},
			events: {
				render: NULL,
				move: NULL,
				show: NULL,
				hide: NULL,
				toggle: NULL,
				visible: NULL,
				hidden: NULL,
				focus: NULL,
				blur: NULL
			}
		};
		;}));
}( window, document ));

/*
 Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
*/
(function(){var b,f;b=this.jQuery||window.jQuery;f=b(window);b.fn.stick_in_parent=function(d){var A,w,J,n,B,K,p,q,k,E,t;null==d&&(d={});t=d.sticky_class;B=d.inner_scrolling;E=d.recalc_every;k=d.parent;q=d.offset_top;p=d.spacer;w=d.bottoming;null==q&&(q=0);null==k&&(k=void 0);null==B&&(B=!0);null==t&&(t="is_stuck");A=b(document);null==w&&(w=!0);J=function(a,d,n,C,F,u,r,G){var v,H,m,D,I,c,g,x,y,z,h,l;if(!a.data("sticky_kit")){a.data("sticky_kit",!0);I=A.height();g=a.parent();null!=k&&(g=g.closest(k));
if(!g.length)throw"failed to find stick parent";v=m=!1;(h=null!=p?p&&a.closest(p):b("<div />"))&&h.css("position",a.css("position"));x=function(){var c,f,e;if(!G&&(I=A.height(),c=parseInt(g.css("border-top-width"),10),f=parseInt(g.css("padding-top"),10),d=parseInt(g.css("padding-bottom"),10),n=g.offset().top+c+f,C=g.height(),m&&(v=m=!1,null==p&&(a.insertAfter(h),h.detach()),a.css({position:"",top:"",width:"",bottom:""}).removeClass(t),e=!0),F=a.offset().top-(parseInt(a.css("margin-top"),10)||0)-q,
u=a.outerHeight(!0),r=a.css("float"),h&&h.css({width:a.outerWidth(!0),height:u,display:a.css("display"),"vertical-align":a.css("vertical-align"),"float":r}),e))return l()};x();if(u!==C)return D=void 0,c=q,z=E,l=function(){var b,l,e,k;if(!G&&(e=!1,null!=z&&(--z,0>=z&&(z=E,x(),e=!0)),e||A.height()===I||x(),e=f.scrollTop(),null!=D&&(l=e-D),D=e,m?(w&&(k=e+u+c>C+n,v&&!k&&(v=!1,a.css({position:"fixed",bottom:"",top:c}).trigger("sticky_kit:unbottom"))),e<F&&(m=!1,c=q,null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),
h.detach()),b={position:"",width:"",top:""},a.css(b).removeClass(t).trigger("sticky_kit:unstick")),B&&(b=f.height(),u+q>b&&!v&&(c-=l,c=Math.max(b-u,c),c=Math.min(q,c),m&&a.css({top:c+"px"})))):e>F&&(m=!0,b={position:"fixed",top:c},b.width="border-box"===a.css("box-sizing")?a.outerWidth()+"px":a.width()+"px",a.css(b).addClass(t),null==p&&(a.after(h),"left"!==r&&"right"!==r||h.append(a)),a.trigger("sticky_kit:stick")),m&&w&&(null==k&&(k=e+u+c>C+n),!v&&k)))return v=!0,"static"===g.css("position")&&g.css({position:"relative"}),
a.css({position:"absolute",bottom:d,top:"auto"}).trigger("sticky_kit:bottom")},y=function(){x();return l()},H=function(){G=!0;f.off("touchmove",l);f.off("scroll",l);f.off("resize",y);b(document.body).off("sticky_kit:recalc",y);a.off("sticky_kit:detach",H);a.removeData("sticky_kit");a.css({position:"",bottom:"",top:"",width:""});g.position("position","");if(m)return null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),h.remove()),a.removeClass(t)},f.on("touchmove",l),f.on("scroll",l),f.on("resize",
y),b(document.body).on("sticky_kit:recalc",y),a.on("sticky_kit:detach",H),setTimeout(l,0)}};n=0;for(K=this.length;n<K;n++)d=this[n],J(b(d));return this}}).call(this);

// SweetAlert
// 2014 (c) - Tristan Edwards
// github.com/t4t5/sweetalert
(function(window, document) {

	var modalClass   = '.sweet-alert',
		overlayClass = '.sweet-overlay',
		alertTypes   = ['error', 'warning', 'info', 'success'];


	/*
	 * Manipulate DOM
	 */

	var getModal = function() {
			return document.querySelector(modalClass);
		},
		getOverlay = function() {
			return document.querySelector(overlayClass);
		},
		hasClass = function(elem, className) {
			return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
		},
		addClass = function(elem, className) {
			if (!hasClass(elem, className)) {
				elem.className += ' ' + className;
			}
		},
		removeClass = function(elem, className) {
			var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
			if (hasClass(elem, className)) {
				while (newClass.indexOf(' ' + className + ' ') >= 0) {
					newClass = newClass.replace(' ' + className + ' ', ' ');
				}
				elem.className = newClass.replace(/^\s+|\s+$/g, '');
			}
		},
		escapeHtml = function(str) {
			var div = document.createElement('div');
			div.appendChild(document.createTextNode(str));
			return div.innerHTML;
		},
		_show = function(elem) {
			elem.style.opacity = '';
			elem.style.display = 'block';
		},
		show = function(elems) {
			if (elems && !elems.length) {
				return _show(elems);
			}
			for (var i = 0; i < elems.length; ++i) {
				_show(elems[i]);
			}
		},
		_hide = function(elem) {
			elem.style.opacity = '';
			elem.style.display = 'none';
		},
		hide = function(elems) {
			if (elems && !elems.length) {
				return _hide(elems);
			}
			for (var i = 0; i < elems.length; ++i) {
				_hide(elems[i]);
			}
		},
		isDescendant = function(parent, child) {
			var node = child.parentNode;
			while (node !== null) {
				if (node === parent) {
					return true;
				}
				node = node.parentNode;
			}
			return false;
		},
		getTopMargin = function(elem) {
			elem.style.left = '-9999px';
			elem.style.display = 'block';

			var height = elem.clientHeight;
			var padding = parseInt(getComputedStyle(elem).getPropertyValue('padding'), 10);

			elem.style.left = '';
			elem.style.display = 'none';
			return ('-' + parseInt(height / 2 + padding) + 'px');
		},
		fadeIn = function(elem, interval) {
			if(+elem.style.opacity < 1) {
				interval = interval || 16;
				elem.style.opacity = 0;
				elem.style.display = 'block';
				var last = +new Date();
				var tick = function() {
					elem.style.opacity = +elem.style.opacity + (new Date() - last) / 100;
					last = +new Date();

					if (+elem.style.opacity < 1) {
						setTimeout(tick, interval);
					}
				};
				tick();
			}
		},
		fadeOut = function(elem, interval) {
			interval = interval || 16;
			elem.style.opacity = 1;
			var last = +new Date();
			var tick = function() {
				elem.style.opacity = +elem.style.opacity - (new Date() - last) / 100;
				last = +new Date();

				if (+elem.style.opacity > 0) {
					setTimeout(tick, interval);
				} else {
					elem.style.display = 'none';
				}
			};
			tick();
		},
		fireClick = function(node) {
			// Taken from http://www.nonobtrusive.com/2011/11/29/programatically-fire-crossbrowser-click-event-with-javascript/
			// Then fixed for today's Chrome browser.
			if (MouseEvent) {
				// Up-to-date approach
				var mevt = new MouseEvent('click', {
					view: window,
					bubbles: false,
					cancelable: true
				});
				node.dispatchEvent(mevt);
			} else if ( document.createEvent ) {
				// Fallback
				var evt = document.createEvent('MouseEvents');
				evt.initEvent('click', false, false);
				node.dispatchEvent(evt);
			} else if( document.createEventObject ) {
				node.fireEvent('onclick') ;
			} else if (typeof node.onclick === 'function' ) {
				node.onclick();
			}
		},
		stopEventPropagation = function(e) {
			// In particular, make sure the space bar doesn't scroll the main window.
			if (typeof e.stopPropagation === 'function') {
				e.stopPropagation();
				e.preventDefault();
			} else if (window.event && window.event.hasOwnProperty('cancelBubble')) {
				window.event.cancelBubble = true;
			}
		};

	// Remember state in cases where opening and handling a modal will fiddle with it.
	var previousActiveElement,
		previousDocumentClick,
		previousWindowKeyDown,
		lastFocusedButton;

	/*
	 * Add modal + overlay to DOM
	 */

	function initialize() {
		var sweetHTML = '<div class="sweet-overlay" tabIndex="-1"></div><div class="sweet-alert" tabIndex="-1"><div class="icon error"><span class="x-mark"><span class="line left"></span><span class="line right"></span></span></div><div class="icon warning"> <span class="body"></span> <span class="dot"></span> </div> <div class="icon info"></div> <div class="icon success"> <span class="line tip"></span> <span class="line long"></span> <div class="placeholder"></div> <div class="fix"></div> </div> <div class="icon custom"></div> <h2>Title</h2><p>Text</p><button class="cancel" tabIndex="2">Cancel</button><button class="confirm" tabIndex="1">OK</button></div>',
			sweetWrap = document.createElement('div');

		sweetWrap.innerHTML = sweetHTML;

		// For readability: check sweet-alert.html
		document.body.appendChild(sweetWrap);

		// For development use only!
		/*jQuery.ajax({
		 url: '../lib/sweet-alert.html', // Change path depending on file location
		 dataType: 'html'
		 })
		 .done(function(html) {
		 jQuery('body').append(html);
		 });*/
	}



	/*
	 * Global sweetAlert function
	 */

	window.sweetAlert = window.swal = function() {

		// Default parameters
		var params = {
			title: '',
			text: '',
			type: null,
			allowOutsideClick: false,
			showCancelButton: false,
			closeOnConfirm: true,
			closeOnCancel: true,
			confirmButtonText: 'OK',
			confirmButtonColor: '#AEDEF4',
			cancelButtonText: 'Cancel',
			imageUrl: null,
			imageSize: null
		};

		if (arguments[0] === undefined) {
			window.console.error('sweetAlert expects at least 1 attribute!');
			return false;
		}


		switch (typeof arguments[0]) {

			case 'string':
				params.title = arguments[0];
				params.text  = arguments[1] || '';
				params.type  = arguments[2] || '';

				break;

			case 'object':
				if (arguments[0].title === undefined) {
					window.console.error('Missing "title" argument!');
					return false;
				}

				params.title              = arguments[0].title;
				params.text               = arguments[0].text || params.text;
				params.type               = arguments[0].type || params.type;
				params.allowOutsideClick  = arguments[0].allowOutsideClick || params.allowOutsideClick;
				params.showCancelButton   = arguments[0].showCancelButton !== undefined ? arguments[0].showCancelButton : params.showCancelButton;
				params.closeOnConfirm     = arguments[0].closeOnConfirm !== undefined ? arguments[0].closeOnConfirm : params.closeOnConfirm;
				params.closeOnCancel      = arguments[0].closeOnCancel !== undefined ? arguments[0].closeOnCancel : params.closeOnCancel;

				// Show "Confirm" instead of "OK" if cancel button is visible
				params.confirmButtonText  = (params.showCancelButton) ? 'Confirm' : params.confirmButtonText;

				params.confirmButtonText  = arguments[0].confirmButtonText || params.confirmButtonText;
				params.confirmButtonColor = arguments[0].confirmButtonColor || params.confirmButtonColor;
				params.cancelButtonText   = arguments[0].cancelButtonText || params.cancelButtonText;
				params.imageUrl           = arguments[0].imageUrl || params.imageUrl;
				params.imageSize          = arguments[0].imageSize || params.imageSize;
				params.doneFunction       = arguments[1] || null;

				break;

			default:
				window.console.error('Unexpected type of argument! Expected "string" or "object", got ' + typeof arguments[0]);
				return false;

		}

		setParameters(params);
		fixVerticalPosition();
		openModal();


		// Modal interactions
		var modal = getModal();

		// Mouse interactions
		var onButtonEvent = function(e) {

			var target = e.target || e.srcElement,
				targetedConfirm    = (target.className === 'confirm'),
				modalIsVisible     = hasClass(modal, 'visible'),
				doneFunctionExists = (params.doneFunction && modal.getAttribute('data-has-done-function') === 'true');

			switch (e.type) {
				case ("mouseover"):
					if (targetedConfirm) {
						e.target.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.04);
					}
					break;
				case ("mouseout"):
					if (targetedConfirm) {
						e.target.style.backgroundColor = params.confirmButtonColor;
					}
					break;
				case ("mousedown"):
					if (targetedConfirm) {
						e.target.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.14);
					}
					break;
				case ("mouseup"):
					if (targetedConfirm) {
						e.target.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.04);
					}
					break;
				case ("focus"):
					var $confirmButton = modal.querySelector('button.confirm'),
						$cancelButton  = modal.querySelector('button.cancel');

					if (targetedConfirm) {
						$cancelButton.style.boxShadow = 'none';
					} else {
						$confirmButton.style.boxShadow = 'none';
					}
					break;
				case ("click"):
					if (targetedConfirm && doneFunctionExists && modalIsVisible) { // Clicked "confirm"

						params.doneFunction(true);

						if (params.closeOnConfirm) {
							closeModal();
						}
					} else if (doneFunctionExists && modalIsVisible) { // Clicked "cancel"

						// Check if callback function expects a parameter (to track cancel actions)
						var functionAsStr          = String(params.doneFunction).replace(/\s/g, '');
						var functionHandlesCancel  = functionAsStr.substring(0, 9) === "function(" && functionAsStr.substring(9, 10) !== ")";

						if (functionHandlesCancel) {
							params.doneFunction(false);
						}

						if (params.closeOnCancel) {
							closeModal();
						}
					} else {
						closeModal();
					}

					break;
			}
		};

		var $buttons = modal.querySelectorAll('button');
		for (var i = 0; i < $buttons.length; i++) {
			$buttons[i].onclick     = onButtonEvent;
			$buttons[i].onmouseover = onButtonEvent;
			$buttons[i].onmouseout  = onButtonEvent;
			$buttons[i].onmousedown = onButtonEvent;
			//$buttons[i].onmouseup   = onButtonEvent;
			$buttons[i].onfocus     = onButtonEvent;
		}

		// Remember the current document.onclick event.
		previousDocumentClick = document.onclick;
		document.onclick = function(e) {
			var target = e.target || e.srcElement;

			var clickedOnModal = (modal === target),
				clickedOnModalChild = isDescendant(modal, e.target),
				modalIsVisible = hasClass(modal, 'visible'),
				outsideClickIsAllowed = modal.getAttribute('data-allow-ouside-click') === 'true';

			if (!clickedOnModal && !clickedOnModalChild && modalIsVisible && outsideClickIsAllowed) {
				closeModal();
			}
		};


		// Keyboard interactions
		var $okButton = modal.querySelector('button.confirm'),
			$cancelButton = modal.querySelector('button.cancel'),
			$modalButtons = modal.querySelectorAll('button:not([type=hidden])');


		function handleKeyDown(e) {
			var keyCode = e.keyCode || e.which;

			if ([9,13,32,27].indexOf(keyCode) === -1) {
				// Don't do work on keys we don't care about.
				return;
			}

			var $targetElement = e.target || e.srcElement;

			var btnIndex = -1; // Find the button - note, this is a nodelist, not an array.
			for (var i = 0; i < $modalButtons.length; i++) {
				if ($targetElement === $modalButtons[i]) {
					btnIndex = i;
					break;
				}
			}

			if (keyCode === 9) {
				// TAB
				if (btnIndex === -1) {
					// No button focused. Jump to the confirm button.
					$targetElement = $okButton;
				} else {
					// Cycle to the next button
					if (btnIndex === $modalButtons.length - 1) {
						$targetElement = $modalButtons[0];
					} else {
						$targetElement = $modalButtons[btnIndex + 1];
					}
				}

				stopEventPropagation(e);
				$targetElement.focus();
				setFocusStyle($targetElement, params.confirmButtonColor); // TODO

			} else {
				if (keyCode === 13 || keyCode === 32) {
					if (btnIndex === -1) {
						// ENTER/SPACE clicked outside of a button.
						$targetElement = $okButton;
					} else {
						// Do nothing - let the browser handle it.
						$targetElement = undefined;
					}
				} else if (keyCode === 27 && !($cancelButton.hidden || $cancelButton.style.display === 'none')) {
					// ESC to cancel only if there's a cancel button displayed (like the alert() window).
					$targetElement = $cancelButton;
				} else {
					// Fallback - let the browser handle it.
					$targetElement = undefined;
				}

				if ($targetElement !== undefined) {
					fireClick($targetElement, e);
				}
			}
		}

		previousWindowKeyDown = window.onkeydown;
		window.onkeydown = handleKeyDown;

		function handleOnBlur(e) {
			var $targetElement = e.target || e.srcElement,
				$focusElement = e.relatedTarget,
				modalIsVisible = hasClass(modal, 'visible');

			if (modalIsVisible) {
				var btnIndex = -1; // Find the button - note, this is a nodelist, not an array.

				if ($focusElement !== null) {
					// If we picked something in the DOM to focus to, let's see if it was a button.
					for (var i = 0; i < $modalButtons.length; i++) {
						if ($focusElement === $modalButtons[i]) {
							btnIndex = i;
							break;
						}
					}

					if (btnIndex === -1) {
						// Something in the dom, but not a visible button. Focus back on the button.
						$targetElement.focus();
					}
				} else {
					// Exiting the DOM (e.g. clicked in the URL bar);
					lastFocusedButton = $targetElement;
				}
			}
		}

		$okButton.onblur = handleOnBlur;
		$cancelButton.onblur = handleOnBlur;

		window.onfocus = function() {
			// When the user has focused away and focused back from the whole window.
			window.setTimeout(function() {
				// Put in a timeout to jump out of the event sequence. Calling focus() in the event
				// sequence confuses things.
				if (lastFocusedButton !== undefined) {
					lastFocusedButton.focus();
					lastFocusedButton = undefined;
				}
			}, 0);
		};
	};


	/*
	 * Set type, text and actions on modal
	 */

	function setParameters(params) {
		var modal = getModal();

		var $title = modal.querySelector('h2'),
			$text = modal.querySelector('p'),
			$cancelBtn = modal.querySelector('button.cancel'),
			$confirmBtn = modal.querySelector('button.confirm');

		// Title
		$title.innerHTML = escapeHtml(params.title).split("\n").join("<br>");

		// Text
		$text.innerHTML = escapeHtml(params.text || '').split("\n").join("<br>");
		if (params.text) {
			show($text);
		}

		// Icon
		hide(modal.querySelectorAll('.icon'));
		if (params.type) {
			var validType = false;
			for (var i = 0; i < alertTypes.length; i++) {
				if (params.type === alertTypes[i]) {
					validType = true;
					break;
				}
			}
			if (!validType) {
				window.console.error('Unknown alert type: ' + params.type);
				return false;
			}
			var $icon = modal.querySelector('.icon.' + params.type);
			show($icon);

			// Animate icon
			switch (params.type) {
				case "success":
					addClass($icon, 'animate');
					addClass($icon.querySelector('.tip'), 'animateSuccessTip');
					addClass($icon.querySelector('.long'), 'animateSuccessLong');
					break;
				case "error":
					addClass($icon, 'animateErrorIcon');
					addClass($icon.querySelector('.x-mark'), 'animateXMark');
					break;
				case "warning":
					addClass($icon, 'pulseWarning');
					addClass($icon.querySelector('.body'), 'pulseWarningIns');
					addClass($icon.querySelector('.dot'), 'pulseWarningIns');
					break;
			}

		}

		// Custom image
		if (params.imageUrl) {
			var $customIcon = modal.querySelector('.icon.custom');

			$customIcon.style.backgroundImage = 'url(' + params.imageUrl + ')';
			show($customIcon);

			var _imgWidth  = 80,
				_imgHeight = 80;

			if (params.imageSize) {
				var imgWidth  = params.imageSize.split('x')[0];
				var imgHeight = params.imageSize.split('x')[1];

				if (!imgWidth || !imgHeight) {
					window.console.error("Parameter imageSize expects value with format WIDTHxHEIGHT, got " + params.imageSize);
				} else {
					_imgWidth  = imgWidth;
					_imgHeight = imgHeight;

					$customIcon.css({
						'width': imgWidth + 'px',
						'height': imgHeight + 'px'
					});
				}
			}
			$customIcon.setAttribute('style', $customIcon.getAttribute('style') + 'width:' + _imgWidth + 'px; height:' + _imgHeight + 'px');
		}

		// Cancel button
		modal.setAttribute('data-has-cancel-button', params.showCancelButton);
		if (params.showCancelButton) {
			$cancelBtn.style.display = 'inline-block';
		} else {
			hide($cancelBtn);
		}

		// Edit text on cancel and confirm buttons
		if (params.cancelButtonText) {
			$cancelBtn.innerHTML = escapeHtml(params.cancelButtonText);
		}
		if (params.confirmButtonText) {
			$confirmBtn.innerHTML = escapeHtml(params.confirmButtonText);
		}

		// Set confirm button to selected background color
		$confirmBtn.style.backgroundColor = params.confirmButtonColor;

		// Set box-shadow to default focused button
		setFocusStyle($confirmBtn, params.confirmButtonColor);

		// Allow outside click?
		modal.setAttribute('data-allow-ouside-click', params.allowOutsideClick);

		// Done-function
		var hasDoneFunction = (params.doneFunction) ? true : false;
		modal.setAttribute('data-has-done-function', hasDoneFunction);
	}


	/*
	 * Set hover, active and focus-states for buttons (source: http://www.sitepoint.com/javascript-generate-lighter-darker-color)
	 */

	function colorLuminance(hex, lum) {
		// Validate hex string
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		lum = lum || 0;

		// Convert to decimal and change luminosity
		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}

		return rgb;
	}

	function hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) : null;
	}

	// Add box-shadow style to button (depending on its chosen bg-color)
	function setFocusStyle($button, bgColor) {
		var rgbColor = hexToRgb(bgColor);
		$button.style.boxShadow = '0 0 2px rgba(' + rgbColor +', 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)';
	}



	/*
	 * Animations
	 */

	function openModal() {
		var modal = getModal();
		fadeIn(getOverlay(), 10);
		show(modal);
		addClass(modal, 'showSweetAlert');
		removeClass(modal, 'hideSweetAlert');

		previousActiveElement = document.activeElement;
		var $okButton = modal.querySelector('button.confirm');
		$okButton.focus();

		setTimeout(function() {
			addClass(modal, 'visible');
		}, 500);
	}

	function closeModal() {
		var modal = getModal();
		fadeOut(getOverlay(), 5);
		fadeOut(modal, 5);
		removeClass(modal, 'showSweetAlert');
		addClass(modal, 'hideSweetAlert');
		removeClass(modal, 'visible');


		// Reset icon animations

		var $successIcon = modal.querySelector('.icon.success');
		removeClass($successIcon, 'animate');
		removeClass($successIcon.querySelector('.tip'), 'animateSuccessTip');
		removeClass($successIcon.querySelector('.long'), 'animateSuccessLong');

		var $errorIcon = modal.querySelector('.icon.error');
		removeClass($errorIcon, 'animateErrorIcon');
		removeClass($errorIcon.querySelector('.x-mark'), 'animateXMark');

		var $warningIcon = modal.querySelector('.icon.warning');
		removeClass($warningIcon, 'pulseWarning');
		removeClass($warningIcon.querySelector('.body'), 'pulseWarningIns');
		removeClass($warningIcon.querySelector('.dot'), 'pulseWarningIns');


		// Reset the page to its previous state
		window.onkeydown = previousWindowKeyDown;
		document.onclick = previousDocumentClick;
		if (previousActiveElement) {
			previousActiveElement.focus();
		}
		lastFocusedButton = undefined;
	}


	/*
	 * Set "margin-top"-property on modal based on its computed height
	 */

	function fixVerticalPosition() {
		var modal = getModal();

		modal.style.marginTop = getTopMargin(getModal());
	}



	/*
	 * If library is injected after page has loaded
	 */

	(function () {
		if (document.readyState === "complete" || document.readyState === "interactive") {
			initialize();
		} else {
			if (document.addEventListener) {
				document.addEventListener('DOMContentLoaded', function factorial() {
					document.removeEventListener('DOMContentLoaded', arguments.callee, false);
					initialize();
				}, false);
			} else if (document.attachEvent) {
				document.attachEvent('onreadystatechange', function() {
					if (document.readyState === 'complete') {
						document.detachEvent('onreadystatechange', arguments.callee);
						initialize();
					}
				});
			}
		}
	})();

})(window, document);
