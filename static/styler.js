
/*
 * Copyright 2012 Muhd Amirul Ashraf bin Mohd Fauzi <asdacap@gmail.com>
 * You may not redistribute/reverse engineer this code or use this code 
 * on any other website without prior written notice saying that you 
 * may do so from me. This code is given AS IS and WITHOUT ANY WARRANTY 
 * that it will work just fine. I am not liable for any damage caused 
 * by this code.
 * 
 * 
 * Styler main function
 * Usage: 
 * var mystyle=Styler({
 * 		css:thecss,
 * 		container:thecontainer,
 * 		iframe:previewiframe,
 * 		basecss:thebasecss,
 * 		predeflayout:"",
 * 		searchlayout:true,
 * 		palettegallery:thepalettegallery,
 * 		palette:thepalette,
 * 		preparse:true
 * })
 * 
 * 'thecss' is the css that you want to edit.
 * 'thecontainer' is a jquery object which styler will use.
 * 'previewiframe' is a jquery object of an iframe which the content will be styled with the css
 * 'thebasecss' is a defaulr css that parse before 'thecss'. Used to predefine style in the control.
 * 'predeflayout' is the layout of the control. The layout of the control may also be put in the css if 'searchlayout' is true.
 * 'thepalettegallery' is a list of color palette use in color palette tab.
 * 'palette' is the initial palette
 * 'preparse' if true will call updateCSS. Beware that updateCss has some asyncronous stuff running. Careful not tu run updateCss if preparse is true.
 * to obtained updated css, symply call mystyle.getNewCss()
 * 
 */
$.widget(
				'styler.StylerSlider',
				{
					options : {
						min : 0,
						max : 100,
						postfix : 'px',
						nopostfixchange : false,
						cssprop : '',
						selector : '',
						unitselector : [],
						registercss : true,
						stylerobj : {},
						label : true,
						sliderops : {},
						decimalpoint : 2
					},
					_create : function() {
						var that = this;
						var cssprop = that.options.cssprop;
						var unitselector = that.options.unitselector;
						if (cssprop == '') {
							throw 'cssprop must not be empty';
						}

						var selectorstring = "";
						if (unitselector.length != 0) {
							selectorstring = "<select class='unitselector'>";
							var i = 0;
							while (i < unitselector.length) {
								selectorstring = selectorstring + "<option>"
										+ unitselector[i].name + "</option>";
								i = i + 1;
							}
							selectorstring = selectorstring + "</select>";
						}

						if (that.options.label) {
							$(this.element)
									.append(
											"<p><label for='"
													+ cssprop
													+ "'>"
													+ cssprop
													+ "</label><input class='sliderpreval' type=text name='"
													+ cssprop + "'></input>"
													+ selectorstring + "</p>");
						} else {
							$(this.element).append(
									"<input class='sliderpreval' type=text name='"
											+ cssprop + "'></input>"
											+ selectorstring + "<br />");
						}
						$(this.element)
								.append(
										"<input type='text' class='minunit minmax'/><div class='cssslider'></div><input type='text' class='maxunit minmax'/>");
						var theslider = $(this.element).children(".cssslider");
						var theinput = $(this.element).find(
								"[name=" + cssprop + "]");
						var theunitselector = $(this.element).find(
								'.unitselector');
						var theminunit = $(this.element).find('input.minunit');
						var themaxunit = $(this.element).find('input.maxunit');

						theminunit.val(that.options.min);
						themaxunit.val(that.options.max);

						function sliderchange() {
							var min = parseInt(theminunit.val(), 10);
							var max = parseInt(themaxunit.val(), 10);
							var different = max - min;
							var currentvalue = min
									+ different
									* (parseInt(theslider.slider('value'), 10) / 1000);
							currentvalue = currentvalue
									.toFixed(that.options.decimalpoint);
							var thetext = currentvalue + that.options.postfix;
							theinput.val(thetext);
							that._trigger('change', 0, thetext);
						}

						theminunit.change(sliderchange);
						themaxunit.change(sliderchange);

						theslider.slider($.extend({}, {
							max : 1000,
							min : 0,
							step : 0.1,
							change : sliderchange,
							slide : sliderchange
						}, this.options.sliderops));

						if (unitselector.length != 0) {
							theunitselector.change(function() {
								var thename = theunitselector.val();
								var i = 0;
								while (i < unitselector.length) {
									if (unitselector[i].name == thename) {
										that.postfix(unitselector[i].postfix,
												true);
										that._trigger('change', 0, that
												.string());
									}
									i = i + 1;
								}
							});
						}

						theinput
								.change(function() {
									var extractor = /(\d+)([^\s\d]*)/;
									var thetext = theinput.val();

									if (!extractor.test(thetext)) {
										that._trigger('change', 0, thetext);
										return;
									}

									var thepostfix = extractor.exec(thetext)[2];
									var thenumber = parseFloat(extractor
											.exec(thetext)[1]);

									that.postfix(thepostfix);
									var min = parseFloat(theminunit.val(), 10)
									var max = parseFloat(themaxunit.val(), 10)

									if (min > thenumber) {
										theminunit
												.val(parseFloat(thenumber, 10));
										var min = parseFloat(theminunit.val(),
												10)
									}
									if (max < thenumber) {
										themaxunit
												.val(parseFloat(thenumber, 10));
										var max = parseFloat(themaxunit.val(),
												10)
									}

									var different = max - min;
									var difval = parseFloat(thenumber)
											- parseFloat(min);
									var percentage = difval * 1000 / different

									theslider.slider('value', percentage);

								});

						if (this.options.registercss) {
							function changehandler(event, string) {
								if (that.options.cssprop != '') {
									that.options.stylerobj.modifycss(that.options.selector,
											that.options.cssprop, string
													.toString());
								}
							}

							if (!this.options.change) {
								this.options.change = changehandler;
							}

							function csshandler(csstring) {
								that.string(csstring);
							}

							this.options.stylerobj.registercsshandler(that.options.selector, cssprop,
									csshandler);
						}
					},
					postfix : function(newpostfix, nounit) {
						if (newpostfix == undefined) {
							return this.options.postfix;
						}

						if (this.options.nopostfixchange
								&& this.options.unitselector.length == 0) {
							return;
						}
						if (this.options.nopostfixchange) {
							var isok = false;
							var i = 0;
							var unitselector = this.options.unitselector;
							while (i < unitselector.length) {
								if (unitselector[i].postfix == newpostfix) {
									isok = true;
								}
								i = i + 1;
							}
							if (!isok) {
								return;
							}
						}

						var theslider = $(this.element).children(".cssslider");
						var theminunit = $(this.element).find('input.minunit');
						var themaxunit = $(this.element).find('input.maxunit');

						var min = parseFloat(theminunit.val(), 10)
						var max = parseFloat(themaxunit.val(), 10)

						this.options.postfix = newpostfix;
						var theinput = $(this.element).find(
								"[name=" + this.options.cssprop + "]");
						var thetext = ((max - min) * theslider.slider('value')
								/ 1000 + min)
								+ this.options.postfix;
						theinput.val(thetext);
						if (!nounit && this.options.unitselector.length != 0) {
							var theunitselector = $(this.element).find(
									'.unitselector');
							var unitselector = this.options.unitselector;
							var i = 0;
							while (i < unitselector.length) {
								if (unitselector[i].postfix == newpostfix) {
									theunitselector.val(unitselector[i].name);
								}
								i = i + 1;
							}
						}
					},
					string : function(newval) {
						if (newval == undefined) {
							return $(this.element).find(
									"[name=" + this.options.cssprop + "]")
									.val();
						}
						var extractor = /([\d.]+)([^\s\d.]*)/;
						var numbernopostfix = /^\s*[\d.]+\s*$/;

						var thepostfix;
						var thenumber;

						if (numbernopostfix.test(newval)) {
							var number = parseFloat(newval, 10);
							thepostfix = this.options.postfix;
							thenumber = number;
						} else {
							$(this.element).find(
									"[name=" + this.options.cssprop + "]").val(
									newval);
							if (!extractor.test(newval)) {
								return;
							}

							thepostfix = extractor.exec(newval)[2];
							thenumber = parseFloat(extractor.exec(newval)[1],
									10);
						}

						this.postfix(thepostfix);
						var theslider = $(this.element).children(".cssslider");
						var theminunit = $(this.element).find('input.minunit');
						var themaxunit = $(this.element).find('input.maxunit');

						var min = parseFloat(theminunit.val(), 10)
						var max = parseFloat(themaxunit.val(), 10)

						if (min > thenumber) {
							theminunit.val(parseFloat(thenumber, 10));
							var min = parseFloat(theminunit.val(), 10)
						}
						if (max < thenumber) {
							themaxunit.val(parseFloat(thenumber, 10));
							var max = parseFloat(themaxunit.val(), 10)
						}

						var different = max - min;
						var difval = parseFloat(thenumber) - parseFloat(min);
						var percentage = difval * 1000 / different

						theslider.slider('value', percentage);
					}
				});

styler_meta={};

function initbuilders() {

	function radiobuilder(theval) {
		function builder(stylerobj,option) {
			var selector=option.selector;
			var cssproperty=option.css;
			var values = theval;
			if (option && option.values) {
				$.extend(values, option.values);
			}
			_counter = _counter + 1;
			var uid = selector.replace(" ", "_")
					+ cssproperty.replace(" ", "_") + _counter.toString();
			var container = $("<div id='" + uid + "' style='inline-block'>");
			for ( var index in values) {
				var value = values[index];
				var chid = uid + value.replace(" ", "_");
				var radiobutton = $("<input></input>");
				radiobutton.attr("id", chid);
				radiobutton.attr("value", value);
				radiobutton.attr("type", "radio");
				radiobutton.attr("name", uid + "radio");
				var label = $("<label>");
				label.text(value);
				label.attr("for", chid);
				container.append(radiobutton);
				container.append(label);
			}
			container.buttonset();
			container.find("input").change(function() {
				stylerobj.modifycss(selector, cssproperty, $(this).val());
			});
			function handler(csstring) {
				var theinput = container.find("input[value=" + csstring + "]");

				if (theinput.length == 0) {
					console
							.log("Warning, trying to set unknown value to input->"
									+ csstring);
					return;
				}

				container.find("input[checked=checked]").attr("checked",
						"false");
				container.find("input")[0].checked = true;
				var theinput = container.find("input[value=" + csstring + "]");
				theinput.attr("checked", true);
				$(theinput).button("refresh");
				$(container).buttonset("refresh");
			}
			stylerobj.registercsshandler(selector, cssproperty, handler);
			return container;
		}
		return builder;
	}

	function foursliderbuilder(defoption) {
		function thebuilder(stylerobj,prefoption) {
			var selector=prefoption.selector;
			var cssproperty=prefoption.css;
			var css=cssproperty;
			var option = {
				min : 0,
				max : 100,
				unitselector : [ {
					name : "Percent",
					postfix : "%"
				}, {
					name : "Pixel",
					postfix : "px"
				} ]
			}
			$.extend(option, defoption, prefoption, {
				registercss : false
			});
			_counter += 1;
			var counter = _counter.toString();
			var container = $("<div>");
			var ul = $("<ul>");
			ul.append("<li><a href='#single_" + counter + "'>All</a></li>");
			if (!option.nodoubletab) {
				ul.append("<li><a href='#double_" + counter
						+ "'>Horizontal/Vertical</a></li>");
			}
			ul.append("<li><a href='#quad_" + counter
					+ "'>Top/Right/Bottom/Left</a></li>");

			var labels = {
				all : css + "-all",
				horizontal : css + "-horizontal",
				vertical : css + "-vertical",
				top : css + "-top",
				right : css + "-right",
				bottom : css + "-bottom",
				left : css + "-left"
			}
			$.extend(labels, option.labels);

			var topval = "";
			var rightval = "";
			var bottomval = "";
			var leftval = "";
			function reapply() {
				var thestring = topval + " " + rightval + " " + bottomval + " "
						+ leftval;
				stylerobj.modifycss(selector, css, thestring)
			}

			var topslider = $("<div id='vertical_" + counter + "'>");
			var rightslider = $("<div id='vertical_" + counter + "'>");
			var bottomslider = $("<div id='vertical_" + counter + "'>");
			var leftslider = $("<div id='vertical_" + counter + "'>");
			var verticalslider = $("<div id='vertical_" + counter + "'>");
			var horizontalslider = $("<div id='horizontal_" + counter + "'>");
			var singleslider = $("<div id='single_" + counter + "'>");

			var singletab = $("<div id='single_" + counter
					+ "' style='padding:1ex;'>");
			singletab.append(singleslider);
			var doubletab = $("<div id='double_" + counter
					+ "' style='padding:1ex;'>");
			doubletab.append(verticalslider);
			doubletab.append(horizontalslider);
			var quadtab = $("<div id='quad_" + counter
					+ "' style='padding:1ex;'>");
			quadtab.append(topslider);
			quadtab.append(rightslider);
			quadtab.append(bottomslider);
			quadtab.append(leftslider);

			container.append(ul);
			container.append(singletab);
			if (!option.nodoubletab) {
				container.append(doubletab);
			}
			container.append(quadtab);
			container.tabs();

			function handler(text) {
				numberlist = text.split(" ");
				if (numberlist.length == 0) {
					console
							.log("Error, someone call setstring with an empty string.");
					return;
				}
				if (numberlist.length == 1) {
					singleslider.StylerSlider("string", numberlist[0]);
					container.tabs('option','active', 0);
					return;
				}
				if (numberlist.length == 2) {
					verticalslider.StylerSlider("string", numberlist[0]);
					horizontalslider.StylerSlider("string", numberlist[1]);
					container.tabs('option','active', 1);
					return;
				}
				if (numberlist.length == 4) {
					topslider.StylerSlider("string", numberlist[0]);
					rightslider.StylerSlider("string", numberlist[1]);
					bottomslider.StylerSlider("string", numberlist[2]);
					leftslider.StylerSlider("string", numberlist[3]);
					container.tabs('option','active', 2);
					return;
				}
			}
			stylerobj.registercsshandler(selector, css, handler);

			topslider.StylerSlider($.extend({}, {
				cssprop : labels.top,
				change : function(event, text) {
					topval = topslider.StylerSlider("string");
					reapply();
				}
			}, option));
			rightslider.StylerSlider($.extend({}, {
				cssprop : labels.right,
				change : function(event, text) {
					rightval = rightslider.StylerSlider("string");
					reapply();
				}
			}, option));
			bottomslider.StylerSlider($.extend({}, {
				cssprop : labels.bottom,
				change : function(event, text) {
					bottomval = bottomslider.StylerSlider("string");
					reapply();
				}
			}, option));
			leftslider.StylerSlider($.extend({}, {
				cssprop : labels.left,
				change : function(event, text) {
					leftval = leftslider.StylerSlider("string");
					reapply();
				}
			}, option));

			verticalslider.StylerSlider($.extend({}, {
				cssprop : labels.vertical,
				change : function(event, text) {
					topslider.StylerSlider('string', text);
					bottomslider.StylerSlider('string', text);
				}
			}, option));
			horizontalslider.StylerSlider($.extend({}, {
				cssprop : labels.horizontal,
				change : function(event, text) {
					rightslider.StylerSlider('string', text);
					leftslider.StylerSlider('string', text);
				}
			}, option));

			singleslider.StylerSlider($.extend({}, {
				cssprop : labels.all,
				change : function(event, text) {
					verticalslider.StylerSlider('string', text);
					horizontalslider.StylerSlider('string', text);
				}
			}, option));
			return container;
		}
		return thebuilder;
	}

	function selectionbuilder(values) {
		function builder(stylerobj,option) {
			var selector=option.selector;
			var cssproperty=option.css;
			var container = $("<select>");
			for ( var index in values) {
				var value = values[index];
				container.append("<option>" + value + "</option>");
			}
			container.change(function() {
				stylerobj.modifycss(selector, cssproperty, $(this).val());
			});
			function handler(csstring) {
				container.val(csstring);
			}
			stylerobj.registercsshandler(selector, cssproperty, handler);
			return container;
		}
		return builder;
	}

	function defaultbuilder(stylerobj,option) {
		var selector=option.selector;
		var cssproperty=option.css;
		var theinput = $("<input class='default'>");
		$(theinput).change(function() {
			stylerobj.modifycss(selector, cssproperty, $(theinput).val());
		});
		function handler(csstring) {
			$(theinput).val(csstring);
		}
		stylerobj.registercsshandler(selector, cssproperty, handler);
		return theinput;
	}
	function checkbox(stylerobj,option) {
		var selector=option.selector;
		var cssproperty=option.css;
		var checkval = option.checked;
		var uncheckval = option.unchecked;
		var theinput = $("<input type='checkbox'>");
		$(theinput).change(function() {
			var togive;
			if (theinput.attr("checked")) {
				togive = checkval;
			} else {
				togive = uncheckval;
			}
			stylerobj.modifycss(selector, cssproperty, togive);
		});
		function handler(csstring) {
			if (csstring == checkval) {
				theinput.attr("checked", "checked");
			} else {
				theinput.attr("checked", "");
			}
		}
		stylerobj.registercsshandler(selector, cssproperty, handler)
		return theinput;
	}

	function boxshadowbuilder(stylerobj,options) {
		var selector=options.selector;
		var cssprop=options.css;

		var container = $("<div class='ui-corner-all ui-widget-content' style='padding:1ex'>");
		var shadowoverall = $('<input></input>');
		var shadowcolorinput = $('<input class="colorinput"></input>');
		var shadowhorizontaloffsetslider = $('<div>');
		var shadowverticaloffsetslider = $('<div>');
		var shadowblurdistanceslider = $('<div>');
		var shadowspreaddistanceslider = $('<div>');
		var shadowinsetcheckbox = $('<input type="checkbox">');

		container.append("Overall shadow:").append(shadowoverall).append(
				"<br />Color:").append(shadowcolorinput).append(
				shadowhorizontaloffsetslider)
				.append(shadowverticaloffsetslider).append(
						shadowblurdistanceslider).append(
						shadowspreaddistanceslider).append("Inset:").append(
						shadowinsetcheckbox);

		var shadow_inset = "";
		var shadow_color = "#000";
		var shadow_horizontal_offset = "0px";
		var shadow_vertical_offset = "0px";
		var shadow_blur_distance = "0px";
		var shadow_spread_distance = "0px";

		function shadowhandler(csstring) {
			var split = csstring.split(" ");
			var curindex = 0;
			if (split[curindex].toLowerCase() == "inset") {
				shadow_inset = "inset";
				shadowinsetcheckbox.attr("checked", "checked");
				curindex += 1;
			}
			var horizoff = split[curindex];
			curindex += 1;
			shadow_horizontal_offset = horizoff;
			shadowhorizontaloffsetslider.StylerSlider('string', horizoff);

			var vertoff = split[curindex];
			curindex += 1;
			shadow_vertical_offset = vertoff;
			shadowverticaloffsetslider.StylerSlider('string', vertoff);

			var endcolor = /#.*/;

			if (!endcolor.test(split[curindex])) {
				var shadowblur = split[curindex];
				curindex += 1;
				shadow_blur_distance = shadowblur;
				shadowblurdistanceslider.StylerSlider('string', shadowblur);
			}

			if (!endcolor.test(split[curindex])) {
				var shadowspread = split[curindex];
				curindex += 1;
				shadow_spread_distance = shadowspread;
				shadowspreaddistanceslider.StylerSlider('string', shadowspread);
			}

			var shadowcolor = split[curindex];
			shadowcolorinput.val(shadowcolor);
			shadowcolorinput.css("background-color",shadowcolor);

		}

		stylerobj.registercsshandler(selector, "box-shadow", shadowhandler);

		function shadow_changed(csstring) {
			stylerobj.modifycss(selector, 'box-shadow', csstring);
		}

		function shadow_overall_changed() {
			var fullstring = shadow_inset + " " + shadow_horizontal_offset
					+ " " + shadow_vertical_offset + " " + shadow_blur_distance
					+ " " + shadow_spread_distance + " " + shadow_color;
			shadow_changed(fullstring);
			shadowoverall.val(fullstring);
		}

		function shadow_color_change(csstring) {
			shadow_color = csstring;
			shadow_overall_changed();
		}

		function shadow_horizontal_offset_change(csstring) {
			shadow_horizontal_offset = csstring;
			shadow_overall_changed();
		}

		function shadow_vertical_offset_change(csstring) {
			shadow_vertical_offset = csstring;
			shadow_overall_changed();
		}

		function shadow_blur_distance_change(csstring) {
			shadow_blur_distance = csstring;
			shadow_overall_changed();
		}

		function shadow_spread_distance_change(csstring) {
			shadow_spread_distance = csstring;
			shadow_overall_changed();
		}

		function shadow_inset_change(csstring) {
			shadow_inset = csstring;
			shadow_overall_changed();
		}

		shadowoverall.change(function() {
			shadow_changed(shadowoverall.val());
		})

		shadowinsetcheckbox.change(function() {
			if (shadowinsetcheckbox.attr("checked")) {
				shadow_inset_change("inset");
			} else {
				shadow_inset_change("");
			}
		});

		shadowhorizontaloffsetslider.StylerSlider({
			min : -50,
			max : 50,
			cssprop : 'shadow_horizontal_offset',
			registercss : false,
			change : function(event, string) {
				shadow_horizontal_offset_change(string);
			}
		})

		shadowverticaloffsetslider.StylerSlider({
			min : -30,
			max : 30,
			cssprop : 'shadow_vertical_offset',
			registercss : false,
			change : function(event, string) {
				shadow_vertical_offset_change(string);
			}
		})

		shadowblurdistanceslider.StylerSlider({
			min : -30,
			max : 30,
			cssprop : 'shadow_blur_distance',
			registercss : false,
			change : function(event, string) {
				shadow_blur_distance_change(string);
			}
		});

		shadowspreaddistanceslider.StylerSlider({
			min : -30,
			max : 30,
			cssprop : 'shadow_spread_distance',
			registercss : false,
			change : function(event, string) {
				shadow_spread_distance_change(string);
			}
		});

		var shadowinputid=selector+cssprop;
		shadowcolorinput.click(function(){
			showColorChooser(shadowcolorinput,shadowinputid,stylerobj);
			return false;
		});
		stylerobj.registerColorInput(shadowinputid,shadowcolorinput);

		shadowcolorinput.change(function() {
			shadowcolorinput.css('backgroundColor', shadowcolorinput.val());
			shadow_color_change(shadowcolorinput.val());
		});

		return container;
	}
	function colourbuilder(stylerobj,option) {
		
		var selector=option.selector;
		var cssprop=option.css;
		var input = $("<input class='colorinput'>");
		var inputid=selector+cssprop;
		stylerobj.registerColorInput(inputid,input);
		input.click(function(){
			showColorChooser(input,inputid,stylerobj);
			return false;
		});
		
		function handler(csstring) {
			console.log("color picker change to->" + csstring);
			input.val(csstring);
			$(input).css("background-color", csstring);
		}

		stylerobj.registercsshandler(selector, cssprop, handler);

		input.change(function() {
			var csstring = input.val();
			input.css('backgroundColor', csstring);
			stylerobj.modifycss(selector, cssprop, csstring);
		});

		return input;
	}

	function textshadowbuilder(stylerobj,option) {
		var selector=option.selector;
		var cssprop=option.css;

		var textshadowcolorinput = $('<input class="colorinput">');
		var textshadowhoffsetslider = $('<div>');
		var textshadowvoffsetslider = $('<div>');
		var textshadowblurslider = $('<div>');
		var container = $("<div>");
		container.append("Text-shadow color:").append(textshadowcolorinput)
				.append(textshadowhoffsetslider)
				.append(textshadowvoffsetslider).append(textshadowblurslider);

		var text_shadow_h_offset = "0px";
		var text_shadow_v_offset = "0px";
		var text_shadow_blur = "0px";
		var text_shadow_color = "#000000";

		function reset_text_shadow() {
			var fullstring = text_shadow_h_offset + " " + text_shadow_v_offset
					+ " " + text_shadow_blur + " " + text_shadow_color;
			stylerobj.modifycss(selector, "text-shadow", fullstring);
		}

		function text_shadow_handler(csstring) {
			var split = csstring.split(" ");
			var curindex = 0;

			var horizoff = split[curindex];
			curindex += 1;
			text_shadow_h_offset = horizoff;
			textshadowhoffsetslider.StylerSlider('string', horizoff);

			var vertoff = split[curindex];
			curindex += 1;
			text_shadow_v_offset = vertoff;
			textshadowvoffsetslider.StylerSlider('string', vertoff);

			var endcolor = /#.*/;

			if (!endcolor.test(split[curindex])) {
				var shadowblur = split[curindex];
				curindex += 1;
				text_shadow_blur = shadowblur;
				textshadowblurslider.StylerSlider('string', shadowblur);
			}

			var shadowcolor = split[curindex];
			textshadowcolorinput.val(shadowcolor);
			textshadowcolorinput.css("background-color",shadowcolor);

		}

		stylerobj.registercsshandler(selector, 'text-shadow', text_shadow_handler);

		textshadowhoffsetslider.StylerSlider({
			min : -50,
			max : 50,
			nopostfixchange : true,
			cssprop : 'text-shadow-hoffset',
			registercss : false,
			change : function(event, csstring) {
				text_shadow_h_offset = csstring;
				reset_text_shadow();
			}
		});

		textshadowvoffsetslider.StylerSlider({
			min : -50,
			max : 50,
			nopostfixchange : true,
			cssprop : 'text-shadow-voffset',
			registercss : false,
			change : function(event, csstring) {
				text_shadow_v_offset = csstring;
				reset_text_shadow();
			}
		});

		textshadowblurslider.StylerSlider({
			min : 0,
			max : 50,
			nopostfixchange : true,
			cssprop : 'text-shadow-blur',
			registercss : false,
			change : function(event, csstring) {
				text_shadow_blur = csstring;
				reset_text_shadow();
			}
		});

		var textshadowinputid=selector+cssprop;
		textshadowcolorinput.click(function(){
			showColorChooser(textshadowcolorinput,textshadowinputid,stylerobj);
			return false;
		});
		stylerobj.registerColorInput(textshadowinputid,textshadowcolorinput);

		textshadowcolorinput.change(function() {
			textshadowcolorinput.css('backgroundColor', textshadowcolorinput
					.val());
			text_shadow_color = (textshadowcolorinput.val());
			reset_text_shadow();
		});

		return container;
	}

	function backgroundrepeatbuilder(stylerobj,option) {
		var selector=option.selector;
		var cssprop=option.css;
		
		var container = $("<div>");
		var backgroundimagerepeatx = $('<input type="checkbox">');
		var backgroundimagerepeaty = $('<input type="checkbox">');
		container.append("repeat-x : ");
		container.append(backgroundimagerepeatx);
		container.append("<br />").append("repeat-y : ");
		container.append(backgroundimagerepeaty);
		var background_image_repeat_x = "";
		var background_image_repeat_y = "";
		function background_image_repeat_reload() {
			var repeatx = (background_image_repeat_x == "repeat-x");
			var repeaty = (background_image_repeat_y == "repeat-y");

			var fullstring = "no-repeat";

			if (repeaty) {
				fullstring = "repeat-y";
			}

			if (repeatx) {
				fullstring = "repeat-x";
			}

			if (repeaty && repeatx) {
				fullstring = "repeat";
			}
			stylerobj.modifycss(selector, 'background-repeat', fullstring);
		}

		function backgroundimagerepeathandler(csstring) {
			var trimmed = $.trim(csstring);
			if (trimmed == 'no-repeat') {
				background_image_repeat_x = "";
				background_image_repeat_y = "";
				backgroundimagerepeatx.prop('checked', false);
				backgroundimagerepeaty.prop('checked', false);
			}
			if (trimmed == 'repeat') {
				background_image_repeat_x = "repeat-x";
				background_image_repeat_y = "repeat-y";
				backgroundimagerepeatx.prop('checked', true);
				backgroundimagerepeaty.prop('checked', true);
			}
			if (trimmed == 'repeat-x') {
				background_image_repeat_x = "repeat-x";
				backgroundimagerepeatx.prop('checked', true);
				background_image_repeat_y = "";
				backgroundimagerepeaty.prop('checked', false);
			}
			if (trimmed == 'repeat-y') {
				background_image_repeat_y = "repeat-y";
				backgroundimagerepeaty.prop('checked', true);
				background_image_repeat_x = "";
				backgroundimagerepeatx.prop('checked', false);
			}
		}
		stylerobj.registercsshandler(selector, 'background-repeat',
				backgroundimagerepeathandler);

		function background_image_repeat_x_change(csstring) {
			background_image_repeat_x = csstring;
			background_image_repeat_reload();
		}

		function background_image_repeat_y_change(csstring) {
			background_image_repeat_y = csstring;
			background_image_repeat_reload();
		}

		backgroundimagerepeatx.change(function() {
			if (backgroundimagerepeatx.attr("checked")) {
				background_image_repeat_x_change("repeat-x");
			} else {
				background_image_repeat_x_change("");
			}
		});

		backgroundimagerepeaty.change(function() {
			if (backgroundimagerepeaty.attr("checked")) {
				background_image_repeat_y_change("repeat-y");
			} else {
				background_image_repeat_y_change("");
			}
		});

		return container;
	}

	function backgroundurlbuilder(stylerobj,option) {
		var selector=option.selector;
		var cssproperty=option.css;
			
		var backgroundimageurlinput = $("<input style='width:100%;'>");
		var extractor = /url\((.*)\)/;
		$(backgroundimageurlinput).change(function() {
			var theurl = backgroundimageurlinput.val();
			if (extractor.test(theurl)) {
				stylerobj.modifycss(selector, 'background-image', theurl);
			} else {
				stylerobj.modifycss(selector, 'background-image', "url(" + theurl + ")");
			}
		});
		function handler(csstring) {
			if (extractor.test(csstring)) {
				backgroundimageurlinput.val(extractor.exec(csstring)[1]);
			} else {
				backgroundimageurlinput.val(csstring);
			}
		}
		stylerobj.registercsshandler(selector, cssproperty, handler);

		var container = $("<div>");
		container.append(backgroundimageurlinput);
		return container;
	}
	function sliderbuilder(defoption) {
		function innerbuilder(stylerobj,option) {
			var selector=option.selector;
			var cssprop=option.css;
			
			var predefoption = {
				cssprop : cssprop,
				selector : selector,
				registercss : true,
				stylerobj:stylerobj,
				label : false,
				unitselector : [ {
					name : "Percent",
					postfix : "%"
				}, {
					name : "Pixel",
					postfix : "px"
				} ]
			};
			var newoption = $.extend({}, predefoption, defoption, option);
			var thediv = $("<span>");
			thediv.StylerSlider(newoption);
			return thediv;
		}
		return innerbuilder;
	}

	function backgroundsizebuilder(stylerobj,option) {
		
		var selector=option.selector;
		var cssprop=option.css;
		
		var slideroption = {
			cssprop : cssprop,
			selector : selector,
			registercss : false,
			label : false,
			unitselector : [ {
				name : "Percent",
				postfix : "%"
			}, {
				name : "Pixel",
				postfix : "px"
			} ]
		};

		var height = "100%";
		var width = "100%";
		var state = "custom";

		_counter = _counter + 1;
		var uid = "background_size" + _counter;
		var radiobutton = $("<div></div>");

		var radid = "radio_" + uid + "_custom";
		radiobutton
				.append("<input id='" + radid + "' type='radio' name='radio_"
						+ uid + "' value='custom'/><label for='" + radid
						+ "'>custom</label>");
		var radid = "radio_" + uid + "_cover";
		radiobutton.append("<input id='" + radid
				+ "' type='radio' name='radio_" + uid
				+ "' value='cover'/><label for='" + radid + "'>cover</label>");
		var radid = "radio_" + uid + "_contain";
		radiobutton.append("<input id='" + radid
				+ "' type='radio' name='radio_" + uid
				+ "' value='contain'/><label for='" + radid
				+ "'>contain</label>");
		$(radiobutton).buttonset();

		var customcontainer = $("<div>")
		function enablecustom() {
			console.log("custom enabled");
			customcontainer.find("div").removeAttr("disabled");
			customcontainer.find("input").removeAttr("disabled");
		}

		function disablecustom() {
			console.log("custom disabled");
			customcontainer.find("div").attr("disabled", "disabled");
			customcontainer.find("input").attr("disabled", "disabled");
		}

		$(radiobutton).find("input[type=radio]").change(function() {
			var thevalue = $(this).val();
			if (thevalue == "custom") {
				enablecustom();
			} else {
				disablecustom();
			}
			state = thevalue;
			reapply();
		});

		function get_cssstring() {
			if (state == "custom") {
				return width + " " + height;
			}
			return state;
		}

		function reapply() {
			stylerobj.modifycss(selector, cssprop, get_cssstring());
		}

		var heightslider = $("<div>");
		$(heightslider).StylerSlider($.extend({}, slideroption, {
			change : function(event, csstring) {
				height = csstring;
				reapply();
			}
		}));

		var widthslider = $("<div>");
		$(widthslider).StylerSlider($.extend({}, slideroption, {
			change : function(event, csstring) {
				width = csstring;
				reapply();
			}
		}));

		function reapplytocontrol() {
			if (state == "custom") {
				enablecustom();
			} else {
				disablecustom();
			}
			$(heightslider).StylerSlider('string', height);
			$(widthslider).StylerSlider('string', width);
			$(radiobutton).find("input[type=radio]").attr("checked", "");
			$(radiobutton).find("input[type=radio][value=" + state + "]").attr(
					"checked", "checked");
			$(radiobutton).buttonset("refresh");
		}

		function handler(css) {
			var theex = /\s*([^\s]+)\s+([^\s]+)\s*/;
			var match = theex.exec(css);
			if (match) {
				height = match[2];
				width = match[1];
				state = "custom";
				reapplytocontrol();
			} else {
				state = css;
				reapplytocontrol();
			}
		}

		stylerobj.registercsshandler(selector, cssprop, handler);

		var container = $("<div>");
		container.append(radiobutton);

		customcontainer.append("<span>height:</span>").append(heightslider)
				.append("<span>width:</span>").append(widthslider).append(
						"<br />");

		container.append(customcontainer);

		disablecustom();

		return container;
	}

	styler_meta.predefcustomcss = {
		"text" : {
			"type":"emptygroup",
			"name" : "text",
			"controls" : [ {
				"css" : "font-family"
			}, {
				"css" : "font-size"
			}, {
				"css" : "text-align"
			}, {
				"css" : "font-style"
			}, {
				"css" : "font-weight"
			}, {
				"css" : "text-decoration"
			}, {
				"css" : "text-transform"
			} ]
		},
		"background" : {
			"type":"emptygroup",
			"name" : "background",
			"controls" : [ {
				"css" : "background-color"
			}, {
				"css" : "background-attachment"
			}, {
				"css" : "background-origin"
			}, {
				"css" : "background-image"
			}, {
				"css" : "background-size"
			}, {
				"css" : "background-repeat"
			} ]
		},
		"border" : {
			"type":"emptygroup",
			"name" : "border",
			"controls" : [ {
				"css" : "border-style"
			}, {
				"css" : "border-color"
			}, {
				"css" : "border-width"
			} ]
		}
	};

	styler_meta.nolabel = [ "text", "border", "background" ]
	styler_meta.nobr = [ "checkbox", "colourbuilder" ]

	styler_meta.predefbuilders = {
		"border-color" : colourbuilder,
		"border-width" : foursliderbuilder({
			postfix : "px",
			min : 0,
			max : 20
		}),
		"border-style" : selectionbuilder([ "none", "hidden", "dotted",
				"dashed", "solid", "double", "groove", "ridge", "inset",
				"outset", "inherit" ]),
		"border-radius" : foursliderbuilder({
			nodoubletab : true,
			labels : {
				all : "all",
				top : "top-left",
				right : "top-right",
				bottom : "bottom-right",
				left : "bottom-left"
			}
		}),
		"border-top-left-radius" : sliderbuilder({
			min : 0,
			max : 100,
			postfix : "px"
		}),
		"border-top-right-radius" : sliderbuilder({
			min : 0,
			max : 100,
			postfix : "px"
		}),
		"border-bottom-left-radius" : sliderbuilder({
			min : 0,
			max : 100,
			postfix : "px"
		}),
		"border-bottom-right-radius" : sliderbuilder({
			min : 0,
			max : 100,
			postfix : "px"
		}),
		"box-shadow" : boxshadowbuilder,
		"background-color" : colourbuilder,
		"background-attachment" : radiobuilder([ "inherit", "scroll", "fixed" ]),
		"background-origin" : radiobuilder([ "padding-box", "border-box",
				"content-box" ]),
		"background-image" : backgroundurlbuilder,
		"background-size" : backgroundsizebuilder,
		"background-repeat" : backgroundrepeatbuilder,
		"color" : colourbuilder,
		"margin" : foursliderbuilder({
			postfix : "px"
		}),
		"margin-top" : sliderbuilder({
			min : 0,
			max : 100,
			postfix : "px"
		}),
		"margin-right" : sliderbuilder({
			min : 0,
			max : 100,
			postfix : "px"
		}),
		"margin-bottom" : sliderbuilder({
			min : 0,
			max : 100,
			postfix : "px"
		}),
		"margin-left" : sliderbuilder({
			min : 0,
			max : 100,
			postfix : "px"
		}),
		"padding" : foursliderbuilder({
			postfix : "px"
		}),
		"padding-top" : sliderbuilder({
			min : 0,
			max : 100,
			postfix : "px"
		}),
		"padding-right" : sliderbuilder({
			min : 0,
			max : 100,
			postfix : "px"
		}),
		"padding-bottom" : sliderbuilder({
			min : 0,
			max : 100,
			postfix : "px"
		}),
		"padding-left" : sliderbuilder({
			min : 0,
			max : 100,
			postfix : "px"
		}),
		"width" : sliderbuilder({
			min : 0,
			max : 100,
			postfix : "%"
		}),
		"height" : sliderbuilder({
			min : 0,
			max : 100,
			postfix : "%"
		}),
		"opacity" : sliderbuilder({
			min : 0,
			max : 1,
			postfix : "",
			nopostfixchange : true
		}),
		"font-family" : selectionbuilder([ "inherit",
				"Impact, Charcoal, sans-serif",
				"‘Palatino Linotype’, ‘Book Antiqua’, Palatino, serif",
				"Tahoma, Geneva, sans-serif", "Century Gothic, sans-serif",
				"‘Lucida Sans Unicode’, ‘Lucida Grande’, sans-serif",
				"‘Arial Black’, Gadget, sans-serif",
				"‘Times New Roman’, Times, serif",
				"‘Arial Narrow’, sans-serif", "Verdana, Geneva, sans-serif",
				"Copperplate Gothic Light, sans-serif",
				"‘Lucida Console’, Monaco, monospace",
				"Gill Sans / Gill Sans MT, sans-serif",
				"‘Trebuchet MS’, Helvetica, sans-serif",
				"‘Courier New’, Courier, monospace",
				"Arial, Helvetica, sans-serif", "Georgia, Serif",
				"'Comic Sans MS', cursive, sans-serif",
				"'Bookman Old Style', serif", "Garamond, serif",
				"Symbol, sans-serif", "Webdings, sans-serif",
				"Wingdings, 'Zapf Dingbats', sans-serif" ]),
		"font-style" : radiobuilder([ "inherit", "normal", "italic", "oblique" ]),
		"font-variant" : radiobuilder([ "inherit", "normal", "small-caps" ]),
		"font-weight" : radiobuilder([ "inherit", "normal", "bold", "bolder",
				"lighter" ]),
		"font-size" : sliderbuilder({
			min : 0,
			max : 150,
			postfix : "%"
		}),
		"text-align" : radiobuilder([ "inherit", "left", "center", "right",
				"justify" ]),
		"text-decoration" : radiobuilder([ "inherit", "none", "underline",
				"overline", "line-through", "blink" ]),
		"text-indent" : sliderbuilder({
			min : 0,
			max : 300,
			postfix : "px"
		}),
		"text-transform" : radiobuilder([ "inherit", "none", "capitalize",
				"uppercase", "lowercase" ]),
		"text-shadow" : textshadowbuilder
	};

	styler_meta.builders = {
		"checkbox" : checkbox,
		"color" : colourbuilder,
		"slider" : sliderbuilder({}),
		"fourslider" : foursliderbuilder({}),
		"radio" : radiobuilder({}),
		"backgroundurlbuilder" : backgroundurlbuilder
	}
	
	styler_meta.defaultvalues = {
			"border-color" : "transparent",
			"border-width" : "0",
			"border-style" : "none",
			"border-top-left-radius" : "0px",
			"border-top-right-radius" : "0px",
			"border-bottom-right-radius" : "0px",
			"border-bottom-left-radius" : "0px",
			"box-shadow" : "0px 0px 0px 0px #000000",
			"background-color" : "transparent",
			"background-image" : "none",
			"background-repeat" : "repeat",
			"background-size" : "auto auto",
			"margin-top" : "0",
			"margin-right" : "0",
			"margin-bottom" : "0",
			"margin-left" : "0",
			"padding" : "0",
			"width" : "auto",
			"height" : "auto",
			"opacity" : "1",
			"font-family" : "inherit",
			"font-style" : "normal",
			"font-variant" : "normal",
			"font-weight" : "normal",
			"font-size" : "100%",
			"text-align" : "left",
			"text-decoration" : "none",
			"text-indent" : "0px",
			"text-transform" : "none",
			"text-shadow" : "0px 0px 0px #000000"
		}

}
var _counter = 0;
initbuilders();
// ------------------------end builders definition-----------------------------

function RGBToHSL(r, g, b) {
    var
    min = Math.min(r, g, b),
    max = Math.max(r, g, b),
    diff = max - min,
    h = 0, s = 0, l = (min + max) / 2;
    if (diff != 0) {
        s = l < 0.5 ? diff / (max + min) : diff / (2 - max - min);

        h = (r == max ? (g - b) / diff : g == max ? 2 + (b - r) / diff : 4 + (r - g) / diff) * 60;
    }
    if(h<0){
        h=h+360;
    }
    return [h, s, l];
}

function HSLToRGB(h,s,l) {
    if (s == 0) {
        return [l, l, l];
    }

    var temp2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var temp1 = 2 * l - temp2;

    h /= 360;

    var
    rtemp = (h + 1 / 3) % 1,
    gtemp = h,
    btemp = (h + 2 / 3) % 1,
    rgb = [rtemp, gtemp, btemp],
    i = 0;

    for (; i < 3; ++i) {
        rgb[i] = rgb[i] < 1 / 6 ? temp1 + (temp2 - temp1) * 6 * rgb[i] : rgb[i] < 1 / 2 ? temp2 : rgb[i] < 2 / 3 ? temp1 + (temp2 - temp1) * 6 * (2 / 3 - rgb[i]) : temp1;
    }

    return rgb;
}

function roundNumber(num, dec) {
    var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
    return result;
}

if(window.staticpath==undefined){
	window.staticpath="/static/colorpicker/";
}

function initColorChooser(){
    
	if(!$("#colorchooser").length){
		var containerdata="\x3Cdiv id=\'colorchooser\'\x3E\n        \x3Cdiv class=\'innercontainer\'\x3E\n        \x3Ccanvas class=\'colorcanvas\' width=\"200\" height=\"230\"\x3E\x3C\x2Fcanvas\x3E\n        \x3Cdiv class=\'sidebox\'\x3E\n            \x3Cdiv class=\'backboxtile\'\x3E\x3C\x2Fdiv\x3E\n            \x3Cdiv class=\'previewbox\'\x3E\x3C\x2Fdiv\x3E\n            \x3Cdiv class=\'comparebox\'\x3E\x3C\x2Fdiv\x3E\n            \x3Cdiv class=\'inputbox\'\x3E\n            \x3Cspan class=\'label\'\x3EHue:\x3C\x2Fspan\x3E\x3Cbr \x2F\x3E\n            \x3Cinput name=\'hue\'\x3E\x3C\x2Finput\x3E\x3Cbr \x2F\x3E\n            \x3Cspan class=\'label\'\x3ESaturation:\x3C\x2Fspan\x3E\x3Cbr \x2F\x3E\n            \x3Cinput name=\'saturation\'\x3E\x3C\x2Finput\x3E\x3Cbr \x2F\x3E\n            \x3Cspan class=\'label\'\x3ELightness:\x3C\x2Fspan\x3E\x3Cbr \x2F\x3E\n            \x3Cinput name=\'lightness\'\x3E\x3C\x2Finput\x3E\x3Cbr \x2F\x3E\n            \x3Cspan class=\'label\'\x3EAlpha:\x3C\x2Fspan\x3E\x3Cbr \x2F\x3E\n            \x3Cinput name=\'alpha\'\x3E\x3C\x2Finput\x3E\x3Cbr \x2F\x3E\n            \x3C\x2Fdiv\x3E\n        \x3C\x2Fdiv\x3E\n        \x3Cdiv class=\'palettebox\'\x3E\n            \x3Cdiv class=\'paletteicon\'\x3E\x3C\x2Fdiv\x3E\n            \x3Cdiv class=\'palettelist\'\x3E\n                \n            \x3C\x2Fdiv\x3E\n        \x3C\x2Fdiv\x3E\n        \x3C\x2Fdiv\x3E\n        \x3C\x2Fdiv\x3E";
		$("body").append(containerdata);
	}
	
    var maincontainer=$("#colorchooser");
    var maincanvas=maincontainer.find(".colorcanvas");
    var previewbox=maincontainer.find('.previewbox');
    var comparebox=maincontainer.find('.comparebox');
    var huecircle=new Image();
    huecircle.src=staticpath+'huecircle.png';
    var backtile=new Image();
    backtile.src=staticpath+'backtile.png';
    var alphatile=new Image();
    alphatile.src=staticpath+'alphatile.png';
    
    var huebuffer=document.createElement("canvas");
    huebuffer.width=100;
    huebuffer.height=100;
    
    var maininput=false;
    var topmargin=5;
    
    var currenthue=45;
    var saturation=100;
    var lightness=50;
    var opacity=1;
    
    var inputchanging=false;
    
    var inputid;
    var stylerobj;
    
    //0-#FFFFFF 1-#FFF 2-rgb(255,255,255) 3-rgba(255,255,255,1) 4-hsl(0,100%,100%) 5-hsla(0,100%,100%,1)
    var mode=0;
    
    function putBack(){
        var rgb=HSLToRGB(currenthue,saturation/100,lightness/100);
        var r=Math.floor(rgb[0]*255);
        var g=Math.floor(rgb[1]*255);
        var b=Math.floor(rgb[2]*255);
        function applyInput(text){
            maininput.val(text);
            maininput.css("background-color",text);
            inputchanging=true;
            if(inputid){
            	
            }
            maininput.change();
            inputchanging=false;
        }
        if(opacity!=1){
            if(mode==0 || mode==1 || mode==2){
                mode=3;
            }
            if(mode==4){
                mode=5;
            }
        }else{
            if(mode==3){
                mode=0;
            }
            if(mode==5){
                mode=4;
            }
        }
        if(mode==0 || mode==1){
            r=r.toString(16);
            if(r.length==1){
                r="0"+r;
            }
            g=g.toString(16);
            if(g.length==1){
                g="0"+g;
            }
            b=b.toString(16);
            if(b.length==1){
                b="0"+b;
            }
            var text="#"+r+g+b;
            applyInput(text);
            return;
        }
        if(mode==2){
            var text="rgb("+r+","+g+","+b+")";
            applyInput(text);
            return;
        }
        if(mode==3){
            var text="rgba("+r+","+g+","+b+","+opacity+")";
            applyInput(text);
            return;
        }
        if(mode==4){
            var text="hsl("+currenthue+","+saturation+"%,"+lightness+"%)";
            applyInput(text);
            return;
        }
        if(mode==5){
            var text="hsla("+currenthue+","+saturation+"%,"+lightness+"%,"+opacity+")";
            applyInput(text);
            return;
        }
    }
    
    function fromRGBA(r,g,b,a){
        var hsl=RGBToHSL(r/255,g/255,b/255);
        currenthue=hsl[0];
        saturation=hsl[1]*100;
        lightness=hsl[2]*100;
        opacity=a;
        updateHueData();
        updateInput();
    }
    
    function fromHash(r,g,b){
        return fromRGBA(parseInt(r,16),parseInt(g,16),parseInt(b,16),1);
    }
    
    function fromHSLA(h,s,l,a){
        currenthue=h;
        saturation=s;
        lighness=l;
        opacity=1;
        updateHueData();
        updateInput();
    }
    
    function mainInputChange(){
        if(inputchanging){
            return;
        }
        parseValue(maininput.val());
    }
    
    function parseValue(text){
        if(/^\s*$/.test(text)){
            mode=0;
            return;
        }
        var tester=/^\s*#([0-o9a-fA-F]{6})\s*$/;
        var match;
        if(match=tester.exec(text)){
            mode=0;
            fromHash(match[1].slice(0,2),match[1].slice(2,4),match[1].slice(4,6));
            return;
        }
        tester=/^\s*#([0-o9a-fA-F]{3})\s*$/;
        match=undefined;
        if(match=tester.exec(text)){
            mode=1;
            fromHash(match[1].slice(0,1),match[1].slice(1,2),match[1].slice(2,3));
            return;
        }
        tester=/^\s*rgb\((\d+),(\d+),(\d+)\)\s*$/;
        match=undefined;
        if(match=tester.exec(text)){
            mode=2;
            fromRGBA(match[1],match[2],match[3],1);
            return;
        }
        tester=/^\s*rgba\((\d+),(\d+),(\d+),([\d\.]+)\)\s*$/;
        match=undefined;
        if(match=tester.exec(text)){
            mode=3;
            fromRGBA(match[1],match[2],match[3],match[4]);
            return;
        }
        tester=/^\s*hsl\((\d+),(\d+)%?,(\d+)%?\)\s*$/;
        match=undefined;
        if(match=tester.exec(text)){
            mode=4;
            fromHSLA(match[1],match[2],match[3],1);
            return;
        }
        tester=/^\s*hsla\((\d+),(\d+)%?,(\d+)%?,([\d\.]+)\)\s*$/;
        match=undefined;
        if(match=tester.exec(text)){
            mode=5;
            fromHSLA(match[1],match[2],match[3],match[4]);
            return;
        }
        console.log("WARNING unknown color value.->"+text);
        mode=0;
    }
    
    function updateHueData(){
        var ctx=huebuffer.getContext('2d');
        ctx.fillStyle='white';
        ctx.fillRect(0,0,100,100);
        var imgdata=ctx.getImageData(0,0,100,100);
        var data=imgdata.data;
        for(var y = 0; y < 100; y++) {
          for(var x = 0; x < 100; x++) {
            var rgb=HSLToRGB(currenthue,x/100,(100-y)/100);
            rgb[0]*=255;
            rgb[1]*=255;
            rgb[2]*=255;
            data[((100 * y) + x) * 4]=rgb[0];
            data[((100 * y) + x) * 4 + 1]=rgb[1];
            data[((100 * y) + x) * 4 + 2]=rgb[2];
            data[((100 * y) + x) * 4 + 3]=255;
          }
        }
        ctx.putImageData(imgdata,0,0);
    }
    updateHueData();
    
    function updateInput(){
        maincontainer.find("input[name=hue]").val(currenthue);
        maincontainer.find("input[name=saturation]").val(saturation);
        maincontainer.find("input[name=lightness]").val(lightness);
        maincontainer.find("input[name=alpha]").val(opacity);
        putBack();
    }
    
    function inputChange(){
        if(/[\d\.]+/.test(maincontainer.find("input[name=hue]").val())){
            var val=parseInt(maincontainer.find("input[name=hue]").val(),0);
            if(val>0 && val <360){
            currenthue=val;
            updateHueData();
            }
        }
        if(/[\d\.]+/.test(maincontainer.find("input[name=saturation]").val())){
            var val=parseInt(maincontainer.find("input[name=saturation]").val(),0);
            if(val>0 && val <100)
            saturation=val;
        }
        if(/[\d\.]+/.test(maincontainer.find("input[name=lightness]").val())){
            var val=parseInt(maincontainer.find("input[name=lightness]").val(),0);
            if(val>0 && val <100)
            lightness=val;
        }
        if(/[\d\.]+/.test(maincontainer.find("input[name=alpha]").val())){
            var val=parseFloat(maincontainer.find("input[name=alpha]").val());
            if(val>0 && val <1)
            opacity=val;
        }
    }
    maincontainer.find(".inputbox input").change(inputChange);
    
    function draw(){
        
        previewbox.css('background-color','hsla('+currenthue+','+saturation+'%,'+lightness+'%,'+opacity+')');
        
        var ctx=maincanvas.get(0).getContext("2d");
        ctx.save();
        
        ctx.fillStyle='#777';
        ctx.fillRect(0,0,200,200);
        
        ctx.drawImage(huecircle,5,5,190,190);
        ctx.drawImage(backtile,50,50,100,100);
        ctx.globalAlpha=opacity;
        ctx.drawImage(huebuffer,50,50,100,100);
        ctx.globalAlpha=1;
        
        ctx.save();
        ctx.translate(100,100);
        ctx.rotate(currenthue*Math.PI/180);
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.moveTo(0,-95);
        ctx.lineTo(0,-77);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        
        var they=100-lightness;
        var thex=saturation;
        ctx.beginPath();
        ctx.arc(50+thex,50+they,3,0,Math.PI*2);
        ctx.lineWidth=1;
        ctx.stroke();
        ctx.closePath();
        
        ctx.drawImage(alphatile,5,205);
        var gradient=ctx.createLinearGradient(5,0,195,0);
        gradient.addColorStop(0,'hsla('+currenthue+','+saturation+'%,'+lightness+'%,0)');
        gradient.addColorStop(1,'hsla('+currenthue+','+saturation+'%,'+lightness+'%,1)');
        ctx.fillStyle=gradient;
        ctx.fillRect(5,205,190,20);
        
        ctx.beginPath();
        ctx.moveTo(5+opacity*190,205);
        ctx.lineTo(5+opacity*190,225);
        ctx.lineWidth=2;
        ctx.stroke();
        ctx.closePath();
        
        ctx.restore();
    }
    
    function drawloop(){
        draw();
        setTimeout(drawloop,100);
    }
    drawloop();
    
    maincanvas.bind('mousedown',function(e){
    	
    	function removeCPLink(){
    		if(inputid && stylerobj){
    			stylerobj.setInputColor(inputid,"")
    		}
    	}
    	
        var offset=maincanvas.offset();
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        
        var mx=x-100;
        var my=y-100;
        //check if in hue circle
        
        function hueModify(y,x){
            var rad=Math.atan2(y,x);
            rad=rad*180/Math.PI;
            rad=rad+90;
            if(rad<0){
                rad=rad+360;
            }
            currenthue=Math.floor(rad);
            updateHueData();
            draw();
            updateInput();
            removeCPLink();
        }
        
        var radius=Math.sqrt(mx*mx+my*my);
        if(radius<95 && radius >77){
            hueModify(my,mx);
            
            maincanvas.bind('mousemove',function(e){
                var offset=maincanvas.offset();
                var x = e.pageX - offset.left;
                var y = e.pageY - offset.top;
                
                var mx=x-100;
                var my=y-100;
                hueModify(my,mx);
            });
            
            function unbind(){
                maincanvas.unbind('mouseup'); 
                maincanvas.unbind('mouseout'); 
                maincanvas.unbind('mousemove'); 
            }
            
            maincanvas.bind('mouseup',unbind);
            maincanvas.bind('mouseout',unbind);
            
            return false;
        }
        
        if(x>50 && x<150 && y>50 && y<150){
            
            function modify(x,y){
                saturation=x;
                lightness=100-y;
                draw();
                updateInput();
                removeCPLink();
            }
            
            modify(x-50,y-50);
            
            
            maincanvas.bind('mousemove',function(e){
                var offset=maincanvas.offset();
                var x = e.pageX - offset.left;
                var y = e.pageY - offset.top;
                
                var thex=x-50;
                if(thex<0){
                    thex=0;
                }
                if(thex>100){
                    thex=100;
                }
                var they=y-50;
                if(they<0){
                    they=0;
                }
                if(they>100){
                    they=100;
                }
                modify(thex,they);
                return false;
            });
            
            function unbind(){
                maincanvas.unbind('mouseup'); 
                maincanvas.unbind('mouseout'); 
                maincanvas.unbind('mousemove'); 
            }
            
            maincanvas.bind('mouseup',unbind);
            maincanvas.bind('mouseout',unbind);
            
            return false;
        }
        
        if(x>5 && x<195 && y>205 && y<225){
            
            function modifyo(x){
                opacity=x/190;
                opacity=roundNumber(opacity,3);
                updateInput();
                removeCPLink();
            }
            
            modifyo(x-5,y-205);
            
            maincanvas.bind('mousemove',function(e){
                var offset=maincanvas.offset();
                var x = e.pageX - offset.left;
                var y = e.pageY - offset.top;
                var thex=x-5;
                var they=y-205;
                if(thex<0){
                    thex=0;
                }
                if(thex>190){
                    thex=190;
                }
                modifyo(thex);
                return false;
            });
            
            function unbind(){
                maincanvas.unbind('mouseup'); 
                maincanvas.unbind('mouseout'); 
                maincanvas.unbind('mousemove'); 
            }
            
            maincanvas.bind('mouseup',unbind);
            maincanvas.bind('mouseout',unbind);
            
            return false;
        }
        
    });
    
    draw();
    
    maincontainer.click(function(){
        return false;
    });
    
    function hide(){
        maincontainer.slideUp(removePalette());
        $("body").unbind("click",hide);
        if(maininput){
	        maininput.unbind("change",mainInputChange);
	        maininput=false;
        }
        inputid=undefined;
        stylerobj=undefined;
    }
    
    var paletteboxshown=false;
    function showPalettebox(){
    	paletteboxshown=true;
    	maincontainer.find(".innercontainer").animate({left:-200},500);
    }
    
    function hidePalettebox(){
    	paletteboxshown=false;
    	maincontainer.find(".innercontainer").animate({left:0},500);
    }
    
    maincontainer.find(".paletteicon").click(function(){
    	if(paletteboxshown){
    		hidePalettebox();
    	}else{
    		showPalettebox();
    	}
    });
    
    function removePalette(){
    	maincontainer.width(285);
    	maincontainer.find(".palettelist").empty();
    	hidePalettebox();
    }
    
    function fetchPalette(){
    	maincontainer.width(310);
    	var palettecolors=stylerobj.getPalette();
    	var currentcolor=stylerobj.getCurrentColorName(inputid);
    	var palettename;
    	for(palettename in palettecolors){
    		var palettecontainer=$("<div class='paletteitem'>");
    		var previewbox=$("<div class='paletteitembox'>");
    		previewbox.attr("title",palettename);
    		if(palettename==currentcolor){
    			palettecontainer.toggleClass("selected");
    		}
    		previewbox.css("background-color",palettecolors[palettename]);
    		palettecontainer.append(previewbox);
    		palettecontainer.append("<span class='colorname'>"+palettename+"<span>");
    		palettecontainer.append("<br />");
    		palettecontainer.click(function(){
    			var thecolorname=$(this).find(".colorname").text();
    			stylerobj.setInputColor(inputid,thecolorname);
    			var thepallete=stylerobj.getPalette();
    			parseValue(thepallete[thecolorname]);
    			maincontainer.find(".palettelist .selected").toggleClass("selected");
    			$(this).toggleClass("selected");
    		});
    		maincontainer.find(".palettelist").append(palettecontainer);
    	}
    }
    
    showColorChooser=function(input,inputidp,stylerobjp){
        
        function initit(){
        	
        	if(inputidp!=undefined){
        		inputid=inputidp;
        		stylerobj=stylerobjp;
        		fetchPalette();
        	}
        	
            var offset=input.offset();
            var offx=offset.left;
            var offy=offset.top+input.outerHeight()+topmargin;
            
            offx=offx-maincontainer.outerWidth()/2+input.outerWidth()/2;
            
            if(offx+maincontainer.outerWidth()>$(window).width()){
                offx=$(window).width()-maincontainer.outerWidth();
            }
            if(offx<0){
                offx=0;
            }
            if(offy+maincontainer.outerHeight()>$(window).height()){
                offy=offset.top-maincontainer.outerHeight();
            }
            if(offy<0){
                offy=0;
            }
            
            maincontainer.css("left",offx);
            maincontainer.css("top",offy);
            maincontainer.slideDown();
            $("body").click(hide);
            maininput=input;
            maininput.bind('change',mainInputChange);
            comparebox.css("background-color",maininput.val());
            parseValue(maininput.val());
        }
        
        if(maininput==input){
            return;
        }
        if(maininput && maininput!=input){
            maincontainer.slideUp(initit);
            return;
        }
        initit();
    }
    
}

initColorChooser();
function Styler(args){

	var defargs={
			css:"",
			iframe:$("<iframe>"),
			basecss:"",
			container:$("<div>"),
			predeflayout:{},
			searchlayout:true,
			palettegallery:[
				{
					name:"default",
					colors:{
						foreground:"#000",
						foreground2:"#011969",
						background:"#ADE7FF",
						background2:"#B1D1DE",
						border:"#0C506B",
						highlight:"#FF110D"
					}
				},
				{
					name:"purple",
					colors:{
						foreground:"#000",
						foreground2:"#870047",
						background:"#E768AB",
						background2:"#E73A95",
						border:"#9c2765",
						highlight:"#98ed00"
					}
				}
			                ],
			palette:{
				foreground:"#000",
				foreground2:"#011969",
				background:"#ADE7FF",
				background2:"#B1D1DE",
				border:"#0C506B",
				highlight:"#FF110D"
			},
			preparse:true
	}
	
	var parsearg=$.extend({},defargs,args);
	
	// css parsing and dom manipulation

	var mainbody = parsearg.container;
	var cssbase = parsearg.basecss;
	var oldstyle = parsearg.css;
	var selectorDict = [];
	var previewiframe = parsearg.iframe;
	var thehandlers = {};
	var changelog = {};
	var inactive = false;
	var stylerobj={};
	var predeflayout=parsearg.predeflayout;
	var searchlayout=parsearg.searchlayout;
	
	function modifycss(selector, css, csstring, noview) {
		if (inactive && !noview) {
			return;
		}
		console.log("change " + css + " for " + selector + "->" + csstring);
		if (selector == '') {
			return;
		}
		if (selector != "" && !noview) {
			previewiframe.contents().find(selector).css(css, csstring);
			if (!changelog[selector]) {
				changelog[selector] = {};
			}
			if (csstring == "" || csstring == {}) {
				changelog[selector][css] = 'delete';
			} else {
				changelog[selector][css] = csstring;
			}
		}
	}
	stylerobj.modifycss=modifycss;

	function applytocontrol(selector, css, csstring) {
		thehandlers[selector][css](csstring);
	}

	function registercsshandler(selector, css, thefunction) {
		if (!thehandlers[selector]) {
			thehandlers[selector] = {};
		}
		if (thehandlers[selector][css]) {
			console.log("for some reason, this handler already exist->" + selector
					+ " css->" + css);
		}
		thehandlers[selector][css] = thefunction;
	}
	stylerobj.registercsshandler=registercsshandler

	function ishandlerexist(selector, css) {
		if (thehandlers[selector]) {
			if (thehandlers[selector][css]) {
				return true;
			}
		}
		return false;
	}

	function reverse_css() {
		for ( var selector in changelog) {
			var properties = changelog[selector];
			for ( var property in properties) {
				if (properties.hasOwnProperty(property)) {
					$(previewiframe).contents().find(selector).css(property, "");
				}
			}
		}
	}

	function getnewcss() {

		var preappend = "/*--CSS statement below is generated by Styler. Please do not remove this comment--*/";
		var newgenerated = "\n"+preappend + "\n";
		var endappend = "\n/*--CSS statement above is generated by Styler. Please do not remove this comment--*/";
		var newstyle = oldstyle
		// new generetor.....................
		previewiframe.contents().find(".preview_container").toggleClass(
				"preview_container");
		var extractegenerated = /\/\*--CSS statement below is generated by Styler. Please do not remove this comment--\*\/([\s\S]*)/;
		var oldgenerated = extractegenerated.exec(oldstyle);

		var newfile = false;
		if (oldgenerated) {
			var oldvalue = oldgenerated[0];

			var endtag = /([\s\S]*)\n\/\*--CSS statement above is generated by Styler. Please do not remove this comment--\*\//;
			var endtagavailable = endtag.exec(oldgenerated[1]);
			if (endtagavailable) {
				oldvalue = endtag.exec(oldgenerated[0])[0];
				oldgenerated = endtagavailable;
			}

			var generatedportion = oldgenerated[1];
			for ( var selector in changelog) {
				var csspropertygroupextractor = new RegExp(selector
						+ "[ ]*{[^{}]*}");
				var selectorgroup = csspropertygroupextractor
						.exec(generatedportion);
				if (selectorgroup) {
					var oldgroup = selectorgroup[0];
					var closednewgroup = selectorgroup[0];
					var newgroup = /([^}]*)}/.exec(closednewgroup)[1];

					var properties = changelog[selector];
					for ( var property in properties) {
						if (properties.hasOwnProperty(property)) {
							var propertytext = property + ":"
									+ properties[property] + ";";
							// find current property in current group.
							// if exist replace with new one
							// if not create it and append.
							var theregex = new RegExp("([\\s;]+)" + property
									+ " *:[^:;]*;");
							if (theregex.test(newgroup)) {
								var prefix = theregex.exec(newgroup)[1];
								newgroup = newgroup.replace(theregex, prefix
										+ propertytext);
							} else {
								newgroup = newgroup + propertytext + "\n";
							}
						}
					}

					newgroup = newgroup + "}";

					generatedportion = generatedportion.replace(oldgroup, newgroup);

				} else {
					var newgroup = "\n" + selector + "{\n";
					var properties = changelog[selector];
					for ( var property in properties) {
						if (properties.hasOwnProperty(property)) {
							var propertytext = property + ":"
									+ properties[property] + ";\n";
							newgroup = newgroup + propertytext;
						}
					}
					newgroup = newgroup + "}";
					generatedportion = generatedportion + newgroup;
					// make new css group and put in the generated
				}

			}

			newstyle = newstyle.replace(oldvalue, preappend + generatedportion
					+ endappend);

		} else {
			for ( var selector in changelog) {
				var newgroup = "\n" + selector + "{\n";
				var properties = changelog[selector];
				for ( var property in properties) {
					if (properties.hasOwnProperty(property)) {
						var propertytext = property + ":" + properties[property]
								+ ";\n";
						newgroup = newgroup + propertytext;
					}
				}
				newgroup = newgroup + "}";
				newgenerated = newgenerated + newgroup;
				// make new css group and put in the generated
			}
			newstyle = newstyle + newgenerated + endappend;

		}

		return newstyle;
	}


	$('#savebutton').click(function() {
		savestyle();
	});

	function extract_properties() {
		inactive = true;
		// first exclude the comment.
		var commentfinder = /\/\*[\s\S]*?\*\//mg;
		var nocomment = cssbase + oldstyle.replace(commentfinder, "\n");
		// then find it
		var propertyextracter = new RegExp("\s*([^}]+?)\s*{([^{}]*)}", 'mg');
		var match;
		while (match = propertyextracter.exec(nocomment)) {
			var selector = $.trim(match[1]);
			var properties = match[2];
			var propertyextracter2g = /([^:;]+):([^:;]*|[^:;]*\([^;]*\))[^:;]*\;/g;
			var propmatch;
			while (propmatch = propertyextracter2g.exec(properties)) {
				var css = $.trim(propmatch[1]);
				var value = $.trim(propmatch[2]);
				if (ishandlerexist(selector, css)) {
					applytocontrol(selector, css, value);
				}
			}

		}

		inactive = false;
	}

	var accordioncounter = 0;
	function buildcontrol(property, defaultprop) {
		
			if(property.type != undefined){
				if(property.type != "control"){
					return buildgroup(property,defaultprop);
				}
			}
		
			if (defaultprop) {
				property = $.extend({}, defaultprop, property);
			}
			if (!property.selector | !property.css) {
				console.log("Minimum control component is not given.")
				return;
			}
			if (!property.name) {
				property.name = property.css;
			}
			var selector = property.selector;
			var name = property.name;
			var css = property.css;
			
			if(property.container){
				var tempcont={
						type:property.container,
						name:name,
						controls:[property]
				};
				property.container=undefined;
				return buildgroup(tempcont,defaultprop);
			}
			
			var thecontainer = $("<div class='styler_control'>");
			var thebuilder;
			var buildername;
			if (property.builder) {
				buildername = property.builder;
				thebuilder = styler_meta.builders[property.builder];
			} else if (styler_meta.predefbuilders[property.css]) {
				buildername = styler_meta.predefbuilders[property.css].name;
				thebuilder = styler_meta.predefbuilders[property.css];
			} else if (styler_meta.predefcustomcss) {
				buildername = "predef";
				thebuilder = undefined;
			} else {
				buildername = "defaultbuilder";
				thebuilder = defaultbuilder
			}

			if(styler_meta.nolabel.indexOf(css)==-1){
		    	thecontainer.append("<span>"+name+" : </span>");
		    	if(styler_meta.nobr.indexOf(buildername)==-1){
		    		thecontainer.append("<br />");
		    	}else{
		    	}
			}
			if (thebuilder) {
				try{
					thecontainer.append(thebuilder(stylerobj,property));
				}catch(e){
					console.log("Error on builder "+buildername+" ->"+e);
				}
				
			} else {
				var newproperties=$.extend(true,{},styler_meta.predefcustomcss[property.css]);
				newproperties.name=property.name;
				property.name=undefined;
				thecontainer.append(buildcontrol(newproperties,
						property));
			}
			return thecontainer;
	}
	
	function buildgroup(property, defaultprop) {
		var innerdefprop = $.extend({}, defaultprop, property.defaultprop);
		var controls = property.controls;
		var group=$("<div>");
		
		if( property.type == undefined ){
			property.type = "emptygroup";
		}
		
		if (property.type == "bordergroup" ) {
			group = $("<div class='styler_group ui-corner-all ui-widget-content'>");
			if (property.name) {
				group.append("<h3>" + property.name + "</h3>")
			}
			for ( var index in controls) {
				try{
					group.append(buildcontrol(controls[index], innerdefprop));
				}catch(e){
					console.log("Error building control->"+e.toString());
				}
			}
			return group;
		} else if (property.type == "emptygroup" || property.type == "group"){
			group = $("<div>");
			if (property.name) {
				group.append("<h3>" + property.name + "</h3>")
			}
			for ( var index in controls) {
				try{
					group.append(buildcontrol(controls[index], innerdefprop));
				}catch(e){
					console.log("Error building control->"+e.toString());
				}
			}
			return group;
		} else if (property.type == "accordion") {
			accordioncounter = accordioncounter + 1;
			var counter = accordioncounter;
			var headerclass = "accordion" + counter.toString();
			var group = $("<div class='styler_accordian_group'>");
			var controls = property.controls;
			var name;
			if (property.name) {
				name = property.name;
			} else {
				name = "no-title";
			}
			var header = $("<h3 class='" + headerclass + "'><a href='#'>" + name
					+ "</a></h3>");
			var content = $("<div class='cont'></div>");
			for ( var index in controls) {
				try{
					$(content).append(buildcontrol(controls[index], innerdefprop));
				}catch(e){
					console.log("Error building control->"+e.toString());
				}
			}
			group.append(header);
			group.append(content);
			$(group).accordion({
				active : false,
				autoHeight : true,
				heightStyle: "content",
				header : "h3." + headerclass,
				collapsible : true
			});
			return group;
		}
	}
	
	function buildlayout() {
		var tempdiv = $("<div>");
		var tabmenu = $("<ul>");
		var executed=false;
		var uid=0;
		function process_layout(layout){
			executed=true;
			for (page in layout) {
				uid+=1;
				var newid = "tab-" + page.replace(/\s/g, "_");
				newid=newid+"uid"+uid.toString();
				var thediv = $("<div id='" + newid + "'></div>");
				tabmenu.append("<li><a href='#" + newid + "'>" + page + "</a></li>");
				var properties = layout[page];
				thediv.append(buildgroup(properties));
				tempdiv.append(thediv);
			}
		}
		
		if(predeflayout){
			process_layout(predeflayout);
		}
		if(searchlayout){
			var thestringlayout;
			var layoutfinder = /\/\*\s*layout\s*\n([^*]*)\n\s*\*\//mg;
			var matches;
			while(matches = layoutfinder.exec(oldstyle)){
				var thelayout=matches[1];
				var layout;
				try {
					layout = JSON.parse(thelayout);
				} catch (e) {
					console.log("Invalid layout->" + e.toString());
				}
				process_layout(layout);
			}
		}
		if(!executed){
			tabmenu.append("<li><a href='#taberror'>Error</a></li>");
			tempdiv.append("<div id='taberror'><h3>No valid styler layout found.</h3>The css does not contain Styler layout description. Therefore styler is not available.</div>");
		}
		
		//-------------------color--------------------------------
		tabmenu.append("<li><a href='#stylercolortab' class='stylercolortab'>Color</a></li>");
		colortab=$("<div id='stylercolortab'>");
		colortab.append(palettediv);
		tempdiv.append(colortab);
		
		tempdiv.prepend(tabmenu);
		$(tempdiv).tabs();
		mainbody.html( tempdiv );
	}

	function reset_all() {
		for ( var selector in thehandlers) {
			for ( var css in thehandlers[selector]) {
				for ( var defcss in styler_meta.defaultvalues) {
					if (css == defcss) {
						thehandlers[selector][css](styler_meta.defaultvalues[defcss]);
					}
				}
			}
		}
	}
	
	function reset_state(){
		oldstyle="";
		selectorDict=[];
		thehandlers={};
		changelog={};
		colorinputs={};
		palette=$.extend(true,{},parsearg.palette);
		palettegallery=parsearg.palettegallery;
		mainbody.empty();
		mainbody.append()
	}

	var asyncstuff = function() {
		buildlayout();
		reset_all();
		extract_properties();
		inactive = false;
		extractColorPalette();
		initializeColorPalette();
	}

	function savestyle(revert) {
		var newstyle=getnewcss();
		newstyle=putColorPaletteData(newstyle);
		oldstyle = newstyle;
		if(revert){
			reverse_css();
		}
		return oldstyle;
	}
	
	function updateCss(css){
		reset_state();
		oldstyle = css;
		inactive = true;
		mainbody.html("<div class='mainloading'><br /><br /><br /><br /><h3>Parsing</h3>Please wait...</div>");
		setTimeout(asyncstuff, 100);
	}
	
	stylerobj.getNewCss=savestyle;
	stylerobj.updateCss=updateCss;
	
	
	//-----------color palette system-----------------
	
	//A dictionary of input id and {input:input,color:color}
	var colorinputs={};
	
	//A dictionary of colorname and value
	var palette=$.extend(true,{},parsearg.palette);
	
	var palettegallery=parsearg.palettegallery;
	var palettediv=$("<div class='palettetab'>");
	
	function initializeColorPalette(){
		palettediv.empty();
		var moddiv=$("<div>");
		moddiv.append("<h3>Modify Color Palette</h3>")
		for(colorname in palette){
			var citem=$("<div class='palettecoloritem'></div>");
			var input=$("<input class='colorinput'>");
			input.css("background-color",palette[colorname]);
			input.val(palette[colorname]);
			input.attr("colorname",colorname);
			input.change(function(){
				var cname=$(this).attr("colorname");
				changePaletteColor(cname,$(this).val());
			});
			input.click(function(){
				showColorChooser($(this));
				return false;
			});
			var label=$("<span>"+colorname+"</span>");
			citem.append(input);
			citem.append(label);
			moddiv.append(citem);
		}
		palettediv.append(moddiv);
		if(palettegallery.length!=0){
			var galdiv=$("<div>");
			galdiv.append("<h3>Select predefined Color Palette</h3>");
			for(index in palettegallery){
				var itemdiv=$("<div themename='"+palettegallery[index].name+"' class='palettethemeitem'>");
				for(colorname in palettegallery[index].colors){
					itemdiv.append("<div class='colorbox' style='background-color:"+palettegallery[index].colors[colorname]+"'></div>");
				}
				itemdiv.append("<span class='name'>"+palettegallery[index].name+"</span>");
				itemdiv.click(function(){
					changePaletteTheme($(this).attr("themename"));
				});
				galdiv.append(itemdiv);
			}
		}
		palettediv.append(galdiv);
		
	}
	
	function extractColorPalette(){
		var extractor=/\/\*\s*Color Palette\s*\n([^*]*)\n\s*\*\//mg;
		var match=extractor.exec(oldstyle);
		if(match){
			console.log("Palette data detected");
			var palettedata=match[1];
			try {
				palettedata= JSON.parse(palettedata);
			} catch (e) {
				console.log("Invalid palette data->" + e.toString());
				return;
			}
			palette=palettedata.colors;
			var colorinputscss=palettedata.inputs;
			for(inputid in colorinputscss){
				var colorname=colorinputscss[inputid];
				for(inputid2 in colorinputs){
					if(inputid==inputid2){
						colorinputs[inputid2].color=colorname;
					}
				}
			}
			for(colorname in palette){
				changePaletteColor(colorname,palette[colorname]);
			}
		}
	}
	
	function putColorPaletteData(thecss){
		var palettedata={
				colors:palette
		};
		var inputdata={};
		for(inputid in colorinputs){
			if(colorinputs[inputid].color!=""){
				inputdata[inputid]=colorinputs[inputid].color;
			}
		}
		palettedata.inputs=inputdata;
		
		var css=thecss;
		console.log(palettedata);
		palettedata=JSON.stringify(palettedata,null,4);
		palettedata="/* Color Palette \n"+palettedata+"\n*/";
		
		var extractor=/\/\*\s*Color Palette\s*\n([^*]*)\n\s*\*\//mg;
		var match=extractor.exec(thecss);
		if(match){
			css.replace(extractor,palettedata);
		}else{
			css=css+"\n"+palettedata;
		}
		return css;
	}
	
	function changePaletteTheme(themename){
		var theme;
		for(index in palettegallery){
			if(palettegallery[index].name==themename){
				theme=palettegallery[index].colors;
			}
		}
		for(colorname in theme){
			changePaletteColor(colorname,theme[colorname]);
		}
	}
	
	function changePaletteColor(colorname,value){
		palette[colorname]=value;
		palettediv.find("input[colorname='"+colorname+"']").val(value);
		palettediv.find("input[colorname='"+colorname+"']").css("background-color",value);
		for(var inputid in colorinputs){
			if(colorinputs[inputid].color==colorname){
				colorinputs[inputid].input.val(value);
				colorinputs[inputid].input.change();
			}
		}
	}
	
	function registerColorInput(uid,input){
		colorinputs[uid]={input:input,color:""};
	}
	
	function setInputColor(inputid,color){
		if(colorinputs[inputid]==undefined){
			console.log("WARNING color input not registered ->"+inputid)
			return "";
		}
		colorinputs[inputid].color=color;
		$(colorinputs[inputid].input).val(palette[color]);
		$(colorinputs[inputid].input).css("background-color",palette[color]);
	}
	
	function getCurrentColorName(inputid){
		if(colorinputs[inputid]==undefined){
			console.log("WARNING color input not registered ->"+inputid)
			return "";
		}
		return colorinputs[inputid].color;
	}
	
	function getPalette(){
		return palette;
	}
	
	stylerobj.getCurrentColorName=getCurrentColorName
	stylerobj.setInputColor=setInputColor;
	stylerobj.registerColorInput=registerColorInput;
	stylerobj.getPalette=getPalette;
	
	if(parsearg.preparse){
		updateCss(oldstyle);
	}
	return stylerobj;
}

