
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
