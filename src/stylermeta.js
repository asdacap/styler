
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
