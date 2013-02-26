
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
        var ichangeinactive=true;
        if(inactive)ichangeinactive=false;
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
        if(ichangeinactive)
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
		extractColorPalette();
		initializeColorPalette();
		inactive = false;
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
        var palettelist=$("<div class='palettelist'>");
        moddiv.append(palettelist);
		palettediv.append(moddiv);
        repopulatePaletteList();
        
        var addcolordiv=$("<div class='addcolor'><span style='font-weight:bold;'>Add Color</span></div>");
        addcolordiv.append("<div style='margin:1ex 0;'>Color name : <input name='colorname' /></div>");
        addcolordiv.append("<button>Add</button>");
        addcolordiv.find("button").button();
        addcolordiv.find("button").click(function(){
            var colorname=$(addcolordiv).find("input[name=colorname]").val();
            if(colorname==undefined || colorname.trim()=="")return;
            changePaletteColor(colorname,"#ffffff");
            repopulatePaletteList();
        });
        palettediv.append(addcolordiv);

	    palettediv.append("<h3>Select predefined Color Palette</h3>");
        palettediv.append("<div class='palettegallery'>");
        repopulatePaletteGallery();

        var addgaldiv=$("<div class='addcolorgallery'><span style='font-weight:bold;'>Add Gallery</span></div>");
        addgaldiv.append("<div>Theme Name: <input name='themename'/></div>");
        addgaldiv.append("<button>Add</button>");
        addgaldiv.find("button").button();
        addgaldiv.find("button").click(function(){
            var thename=$(addgaldiv).find("input[name=themename]").val();
            if(thename==undefined || thename.trim()=="")return;
            for(var i in palettegallery){
                if(palettegallery[i].name==thename)return;
            }
            var newpalette={name:thename,colors:{}};
            for(color in palette){
                newpalette.colors[color]=palette[color];
            }
            palettegallery.push(newpalette);
            repopulatePaletteGallery();
        });

        palettediv.append(addgaldiv);
		
	}
	
    function repopulatePaletteGallery(){
        var galdiv=palettediv.find(".palettegallery");
        galdiv.empty();
        for(index in palettegallery){
            var itemdiv=$("<div themename='"+palettegallery[index].name+"' class='palettethemeitem'>");
            var removegal=$("<div class='removecolor'>");
            removegal.click(function(){
                var themename=$(this).parent().attr("themename");
                var tindex=0;
                while(tindex<palettegallery.length){
                    if(palettegallery[tindex].name==themename){
                        break;
                    }
                    tindex++;
                }
                if(tindex==palettegallery.length){
                    console.log("cannot find theme "+themename);
                }else{
                    palettegallery.splice(tindex,1);
                }
                repopulatePaletteGallery();
            });
            itemdiv.append(removegal);
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

    function repopulatePaletteList(){
        var palettelist=palettediv.find(".palettelist");
        palettelist.empty();
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
            var remove=$("<div class='removecolor'>");
            remove.click(function(){
                var colorname=$(this).parent().find("input").attr("colorname");
                delete palette[colorname];
                repopulatePaletteList();
            });
            citem.append(remove);
			citem.append(input);
			citem.append(label);
			palettelist.append(citem);
		}
    }

	function extractColorPalette(){
		var extractor=/\/\*\s*Color Palette\s*\n([^*]*)\n\s*\*\//mg;
		var match=extractor.exec(oldstyle);
		if(match){
			var palettedata=match[1];
			try {
				palettedata= JSON.parse(palettedata);
			} catch (e) {
				console.log("Invalid palette data->" + e.toString());
				return;
			}
			palette=palettedata.colors;
            $.extend(true,palettegallery,palettedata.palettegallery);
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
				colors:palette,
                palettegallery:palettegallery
		};
		var inputdata={};
		for(inputid in colorinputs){
			if(colorinputs[inputid].color!=""){
				inputdata[inputid]=colorinputs[inputid].color;
			}
		}
		palettedata.inputs=inputdata;
		
		var css=thecss;
		palettedata=JSON.stringify(palettedata,null,4);
		palettedata="/* Color Palette \n"+palettedata+"\n*/";
		
		var extractor=/\/\*\s*Color Palette\s*\n([^*]*)\n\s*\*\//mg;
		var match=extractor.exec(thecss);
		if(match){
			css=css.replace(extractor,palettedata);
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
        repopulatePaletteList();
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

