$.widget("styler.StylerSlider",{options:{min:0,max:100,postfix:"px",nopostfixchange:!1,cssprop:"",selector:"",unitselector:[],registercss:!0,stylerobj:{},label:!0,sliderops:{},decimalpoint:2},_create:function(){function c(){var a=parseInt(m.val(),10),b=parseInt(A.val(),10)-a,a=a+b*(parseInt(B.slider("value"),10)/1E3),a=a.toFixed(d.options.decimalpoint),a=a+d.options.postfix;C.val(a);d._trigger("change",0,a)}var d=this,g=d.options.cssprop,e=d.options.unitselector;if(""==g)throw"cssprop must not be empty";
var h="";if(0!=e.length){for(var h="<select class='unitselector'>",f=0;f<e.length;)h=h+"<option>"+e[f].name+"</option>",f+=1;h+="</select>"}d.options.label?$(this.element).append("<p><label for='"+g+"'>"+g+"</label><input class='sliderpreval' type=text name='"+g+"'></input>"+h+"</p>"):$(this.element).append("<input class='sliderpreval' type=text name='"+g+"'></input>"+h+"<br />");$(this.element).append("<input type='text' class='minunit minmax'/><div class='cssslider'></div><input type='text' class='maxunit minmax'/>");
var B=$(this.element).children(".cssslider"),C=$(this.element).find("[name="+g+"]"),z=$(this.element).find(".unitselector"),m=$(this.element).find("input.minunit"),A=$(this.element).find("input.maxunit");m.val(d.options.min);A.val(d.options.max);m.change(c);A.change(c);B.slider($.extend({},{max:1E3,min:0,step:0.1,change:c,slide:c},this.options.sliderops));0!=e.length&&z.change(function(){for(var a=z.val(),b=0;b<e.length;)e[b].name==a&&(d.postfix(e[b].postfix,!0),d._trigger("change",0,d.string())),
b+=1});C.change(function(){var a=/(\d+)([^\s\d]*)/,b=C.val();if(a.test(b)){var j=a.exec(b)[2],a=parseFloat(a.exec(b)[1]);d.postfix(j);j=parseFloat(m.val(),10);b=parseFloat(A.val(),10);j>a&&(m.val(parseFloat(a,10)),j=parseFloat(m.val(),10));b<a&&(A.val(parseFloat(a,10)),b=parseFloat(A.val(),10));j=1E3*(parseFloat(a)-parseFloat(j))/(b-j);B.slider("value",j)}else d._trigger("change",0,b)});this.options.registercss&&(h=function(a,b){""!=d.options.cssprop&&d.options.stylerobj.modifycss(d.options.selector,
d.options.cssprop,b.toString())},this.options.change||(this.options.change=h),this.options.stylerobj.registercsshandler(d.options.selector,g,function(a){d.string(a)}))},postfix:function(c,d){if(void 0==c)return this.options.postfix;if(!(this.options.nopostfixchange&&0==this.options.unitselector.length)){if(this.options.nopostfixchange){for(var g=!1,e=0,h=this.options.unitselector;e<h.length;)h[e].postfix==c&&(g=!0),e+=1;if(!g)return}var e=$(this.element).children(".cssslider"),h=$(this.element).find("input.minunit"),
g=$(this.element).find("input.maxunit"),h=parseFloat(h.val(),10),f=parseFloat(g.val(),10);this.options.postfix=c;g=$(this.element).find("[name="+this.options.cssprop+"]");e=(f-h)*e.slider("value")/1E3+h+this.options.postfix;g.val(e);if(!d&&0!=this.options.unitselector.length){g=$(this.element).find(".unitselector");h=this.options.unitselector;for(e=0;e<h.length;)h[e].postfix==c&&g.val(h[e].name),e+=1}}},string:function(c){if(void 0==c)return $(this.element).find("[name="+this.options.cssprop+"]").val();
var d=/([\d.]+)([^\s\d.]*)/,g;if(/^\s*[\d.]+\s*$/.test(c))c=parseFloat(c,10),g=this.options.postfix;else{$(this.element).find("[name="+this.options.cssprop+"]").val(c);if(!d.test(c))return;g=d.exec(c)[2];c=parseFloat(d.exec(c)[1],10)}this.postfix(g);g=$(this.element).children(".cssslider");var d=$(this.element).find("input.minunit"),e=$(this.element).find("input.maxunit"),h=parseFloat(d.val(),10),f=parseFloat(e.val(),10);h>c&&(d.val(parseFloat(c,10)),h=parseFloat(d.val(),10));f<c&&(e.val(parseFloat(c,
10)),f=parseFloat(e.val(),10));c=1E3*(parseFloat(c)-parseFloat(h))/(f-h);g.slider("value",c)}});styler_meta={};
function initbuilders(){function c(c){return function(d,z){var m=z.selector,A=z.css;z&&z.values&&$.extend(c,z.values);_counter+=1;var a=m.replace(" ","_")+A.replace(" ","_")+_counter.toString(),b=$("<div id='"+a+"' style='inline-block'>"),j;for(j in c){var g=c[j],e=a+g.replace(" ","_"),f=$("<input></input>");f.attr("id",e);f.attr("value",g);f.attr("type","radio");f.attr("name",a+"radio");var h=$("<label>");h.text(g);h.attr("for",e);b.append(f);b.append(h)}b.buttonset();b.find("input").change(function(){d.modifycss(m,A,
$(this).val())});d.registercsshandler(m,A,function(a){var j=b.find("input[value="+a+"]");0==j.length?console.log("Warning, trying to set unknown value to input->"+a):(b.find("input[checked=checked]").attr("checked","false"),b.find("input")[0].checked=!0,j=b.find("input[value="+a+"]"),j.attr("checked",!0),$(j).button("refresh"),$(b).buttonset("refresh"))});return b}}function d(c){return function(d,g){function m(){d.modifycss(A,a,q+" "+u+" "+p+" "+v)}var A=g.selector,a=g.css,b={min:0,max:100,unitselector:[{name:"Percent",
postfix:"%"},{name:"Pixel",postfix:"px"}]};$.extend(b,c,g,{registercss:!1});_counter+=1;var j=_counter.toString(),e=$("<div>"),f=$("<ul>");f.append("<li><a href='#single_"+j+"'>All</a></li>");b.nodoubletab||f.append("<li><a href='#double_"+j+"'>Horizontal/Vertical</a></li>");f.append("<li><a href='#quad_"+j+"'>Top/Right/Bottom/Left</a></li>");var h={all:a+"-all",horizontal:a+"-horizontal",vertical:a+"-vertical",top:a+"-top",right:a+"-right",bottom:a+"-bottom",left:a+"-left"};$.extend(h,b.labels);
var q="",u="",p="",v="",s=$("<div id='vertical_"+j+"'>"),n=$("<div id='vertical_"+j+"'>"),t=$("<div id='vertical_"+j+"'>"),l=$("<div id='vertical_"+j+"'>"),y=$("<div id='vertical_"+j+"'>"),k=$("<div id='horizontal_"+j+"'>"),E=$("<div id='single_"+j+"'>"),r=$("<div id='single_"+j+"' style='padding:1ex;'>");r.append(E);var G=$("<div id='double_"+j+"' style='padding:1ex;'>");G.append(y);G.append(k);j=$("<div id='quad_"+j+"' style='padding:1ex;'>");j.append(s);j.append(n);j.append(t);j.append(l);e.append(f);
e.append(r);b.nodoubletab||e.append(G);e.append(j);e.tabs();d.registercsshandler(A,a,function(K){numberlist=K.split(" ");0==numberlist.length?console.log("Error, someone call setstring with an empty string."):1==numberlist.length?(E.StylerSlider("string",numberlist[0]),e.tabs("option","active",0)):2==numberlist.length?(y.StylerSlider("string",numberlist[0]),k.StylerSlider("string",numberlist[1]),e.tabs("option","active",1)):4==numberlist.length&&(s.StylerSlider("string",numberlist[0]),n.StylerSlider("string",
numberlist[1]),t.StylerSlider("string",numberlist[2]),l.StylerSlider("string",numberlist[3]),e.tabs("option","active",2))});s.StylerSlider($.extend({},{cssprop:h.top,change:function(){q=s.StylerSlider("string");m()}},b));n.StylerSlider($.extend({},{cssprop:h.right,change:function(){u=n.StylerSlider("string");m()}},b));t.StylerSlider($.extend({},{cssprop:h.bottom,change:function(){p=t.StylerSlider("string");m()}},b));l.StylerSlider($.extend({},{cssprop:h.left,change:function(){v=l.StylerSlider("string");
m()}},b));y.StylerSlider($.extend({},{cssprop:h.vertical,change:function(K,k){s.StylerSlider("string",k);t.StylerSlider("string",k)}},b));k.StylerSlider($.extend({},{cssprop:h.horizontal,change:function(K,k){n.StylerSlider("string",k);l.StylerSlider("string",k)}},b));E.StylerSlider($.extend({},{cssprop:h.all,change:function(K,L){y.StylerSlider("string",L);k.StylerSlider("string",L)}},b));return e}}function g(c){return function(d,e){var m=e.selector,g=e.css,a=$("<select>"),b;for(b in c)a.append("<option>"+
c[b]+"</option>");a.change(function(){d.modifycss(m,g,$(this).val())});d.registercsshandler(m,g,function(b){a.val(b)});return a}}function e(c,d){var e=d.selector,g=d.css,f=$("<input class='colorinput'>"),a=e+g;c.registerColorInput(a,f);f.click(function(){showColorChooser(f,a,c);return!1});c.registercsshandler(e,g,function(b){console.log("color picker change to->"+b);f.val(b);$(f).css("background-color",b)});f.change(function(){var b=f.val();f.css("backgroundColor",b);c.modifycss(e,g,b)});return f}
function h(c,d){var e=d.selector,f=d.css,g=$("<input style='width:100%;'>"),a=/url\((.*)\)/;$(g).change(function(){var b=g.val();a.test(b)?c.modifycss(e,"background-image",b):c.modifycss(e,"background-image","url("+b+")")});c.registercsshandler(e,f,function(b){a.test(b)?g.val(a.exec(b)[1]):g.val(b)});f=$("<div>");f.append(g);return f}function f(c){return function(d,e){var f=$.extend({},{cssprop:e.css,selector:e.selector,registercss:!0,stylerobj:d,label:!1,unitselector:[{name:"Percent",postfix:"%"},
{name:"Pixel",postfix:"px"}]},c,e),g=$("<span>");g.StylerSlider(f);return g}}styler_meta.predefcustomcss={text:{type:"emptygroup",name:"text",controls:[{css:"font-family"},{css:"font-size"},{css:"text-align"},{css:"font-style"},{css:"font-weight"},{css:"text-decoration"},{css:"text-transform"}]},background:{type:"emptygroup",name:"background",controls:[{css:"background-color"},{css:"background-attachment"},{css:"background-origin"},{css:"background-image"},{css:"background-size"},{css:"background-repeat"}]},
border:{type:"emptygroup",name:"border",controls:[{css:"border-style"},{css:"border-color"},{css:"border-width"}]}};styler_meta.nolabel=["text","border","background"];styler_meta.nobr=["checkbox","colourbuilder"];styler_meta.predefbuilders={"border-color":e,"border-width":d({postfix:"px",min:0,max:20}),"border-style":g("none hidden dotted dashed solid double groove ridge inset outset inherit".split(" ")),"border-radius":d({nodoubletab:!0,labels:{all:"all",top:"top-left",right:"top-right",bottom:"bottom-right",
left:"bottom-left"}}),"border-top-left-radius":f({min:0,max:100,postfix:"px"}),"border-top-right-radius":f({min:0,max:100,postfix:"px"}),"border-bottom-left-radius":f({min:0,max:100,postfix:"px"}),"border-bottom-right-radius":f({min:0,max:100,postfix:"px"}),"box-shadow":function(c,e){function d(){var k=p+" "+s+" "+n+" "+t+" "+l+" "+v;c.modifycss(f,"box-shadow",k);b.val(k)}var f=e.selector,g=e.css,a=$("<div class='ui-corner-all ui-widget-content' style='padding:1ex'>"),b=$("<input></input>"),j=$('<input class="colorinput"></input>'),
h=$("<div>"),w=$("<div>"),x=$("<div>"),q=$("<div>"),u=$('<input type="checkbox">');a.append("Overall shadow:").append(b).append("<br />Color:").append(j).append(h).append(w).append(x).append(q).append("Inset:").append(u);var p="",v="#000",s="0px",n="0px",t="0px",l="0px";c.registercsshandler(f,"box-shadow",function(k){k=k.split(" ");var b=0;"inset"==k[b].toLowerCase()&&(p="inset",u.attr("checked","checked"),b+=1);var a=k[b],b=b+1;s=a;h.StylerSlider("string",a);a=k[b];b+=1;n=a;w.StylerSlider("string",
a);a=/#.*/;if(!a.test(k[b])){var c=k[b],b=b+1;t=c;x.StylerSlider("string",c)}a.test(k[b])||(a=k[b],b+=1,l=a,q.StylerSlider("string",a));k=k[b];j.val(k);j.css("background-color",k)});b.change(function(){var k=b.val();c.modifycss(f,"box-shadow",k)});u.change(function(){p=u.attr("checked")?"inset":"";d()});h.StylerSlider({min:-50,max:50,cssprop:"shadow_horizontal_offset",registercss:!1,change:function(k,b){s=b;d()}});w.StylerSlider({min:-30,max:30,cssprop:"shadow_vertical_offset",registercss:!1,change:function(k,
b){n=b;d()}});x.StylerSlider({min:-30,max:30,cssprop:"shadow_blur_distance",registercss:!1,change:function(b,a){t=a;d()}});q.StylerSlider({min:-30,max:30,cssprop:"shadow_spread_distance",registercss:!1,change:function(b,a){l=a;d()}});var y=f+g;j.click(function(){showColorChooser(j,y,c);return!1});c.registerColorInput(y,j);j.change(function(){j.css("backgroundColor",j.val());v=j.val();d()});return a},"background-color":e,"background-attachment":c(["inherit","scroll","fixed"]),"background-origin":c(["padding-box",
"border-box","content-box"]),"background-image":h,"background-size":function(c,d){function e(){console.log("custom enabled");v.find("div").removeAttr("disabled");v.find("input").removeAttr("disabled")}function f(){console.log("custom disabled");v.find("div").attr("disabled","disabled");v.find("input").attr("disabled","disabled")}function g(){c.modifycss(a,b,"custom"==x?w+" "+h:x)}var a=d.selector,b=d.css,j={cssprop:b,selector:a,registercss:!1,label:!1,unitselector:[{name:"Percent",postfix:"%"},{name:"Pixel",
postfix:"px"}]},h="100%",w="100%",x="custom";_counter+=1;var q="background_size"+_counter,u=$("<div></div>"),p="radio_"+q+"_custom";u.append("<input id='"+p+"' type='radio' name='radio_"+q+"' value='custom'/><label for='"+p+"'>custom</label>");p="radio_"+q+"_cover";u.append("<input id='"+p+"' type='radio' name='radio_"+q+"' value='cover'/><label for='"+p+"'>cover</label>");p="radio_"+q+"_contain";u.append("<input id='"+p+"' type='radio' name='radio_"+q+"' value='contain'/><label for='"+p+"'>contain</label>");
$(u).buttonset();var v=$("<div>");$(u).find("input[type=radio]").change(function(){var b=$(this).val();"custom"==b?e():f();x=b;g()});var s=$("<div>");$(s).StylerSlider($.extend({},j,{change:function(b,a){h=a;g()}}));var n=$("<div>");$(n).StylerSlider($.extend({},j,{change:function(b,a){w=a;g()}}));c.registercsshandler(a,b,function(b){var a=/\s*([^\s]+)\s+([^\s]+)\s*/.exec(b);a?(h=a[2],w=a[1],x="custom"):x=b;"custom"==x?e():f();$(s).StylerSlider("string",h);$(n).StylerSlider("string",w);$(u).find("input[type=radio]").attr("checked",
"");$(u).find("input[type=radio][value="+x+"]").attr("checked","checked");$(u).buttonset("refresh")});j=$("<div>");j.append(u);v.append("<span>height:</span>").append(s).append("<span>width:</span>").append(n).append("<br />");j.append(v);f();return j},"background-repeat":function(c,d){function e(){var b="repeat-x"==j,a="repeat-y"==h,d="no-repeat";a&&(d="repeat-y");b&&(d="repeat-x");a&&b&&(d="repeat");c.modifycss(f,"background-repeat",d)}var f=d.selector,g=$("<div>"),a=$('<input type="checkbox">'),
b=$('<input type="checkbox">');g.append("repeat-x : ");g.append(a);g.append("<br />").append("repeat-y : ");g.append(b);var j="",h="";c.registercsshandler(f,"background-repeat",function(c){c=$.trim(c);"no-repeat"==c&&(h=j="",a.prop("checked",!1),b.prop("checked",!1));"repeat"==c&&(j="repeat-x",h="repeat-y",a.prop("checked",!0),b.prop("checked",!0));"repeat-x"==c&&(j="repeat-x",a.prop("checked",!0),h="",b.prop("checked",!1));"repeat-y"==c&&(h="repeat-y",b.prop("checked",!0),j="",a.prop("checked",!1))});
a.change(function(){j=a.attr("checked")?"repeat-x":"";e()});b.change(function(){h=b.attr("checked")?"repeat-y":"";e()});return g},color:e,margin:d({postfix:"px"}),"margin-top":f({min:0,max:100,postfix:"px"}),"margin-right":f({min:0,max:100,postfix:"px"}),"margin-bottom":f({min:0,max:100,postfix:"px"}),"margin-left":f({min:0,max:100,postfix:"px"}),padding:d({postfix:"px"}),"padding-top":f({min:0,max:100,postfix:"px"}),"padding-right":f({min:0,max:100,postfix:"px"}),"padding-bottom":f({min:0,max:100,
postfix:"px"}),"padding-left":f({min:0,max:100,postfix:"px"}),width:f({min:0,max:100,postfix:"%"}),height:f({min:0,max:100,postfix:"%"}),opacity:f({min:0,max:1,postfix:"",nopostfixchange:!0}),"font-family":g("inherit;Impact, Charcoal, sans-serif;\u2018Palatino Linotype\u2019, \u2018Book Antiqua\u2019, Palatino, serif;Tahoma, Geneva, sans-serif;Century Gothic, sans-serif;\u2018Lucida Sans Unicode\u2019, \u2018Lucida Grande\u2019, sans-serif;\u2018Arial Black\u2019, Gadget, sans-serif;\u2018Times New Roman\u2019, Times, serif;\u2018Arial Narrow\u2019, sans-serif;Verdana, Geneva, sans-serif;Copperplate Gothic Light, sans-serif;\u2018Lucida Console\u2019, Monaco, monospace;Gill Sans / Gill Sans MT, sans-serif;\u2018Trebuchet MS\u2019, Helvetica, sans-serif;\u2018Courier New\u2019, Courier, monospace;Arial, Helvetica, sans-serif;Georgia, Serif;'Comic Sans MS', cursive, sans-serif;'Bookman Old Style', serif;Garamond, serif;Symbol, sans-serif;Webdings, sans-serif;Wingdings, 'Zapf Dingbats', sans-serif".split(";")),
"font-style":c(["inherit","normal","italic","oblique"]),"font-variant":c(["inherit","normal","small-caps"]),"font-weight":c(["inherit","normal","bold","bolder","lighter"]),"font-size":f({min:0,max:150,postfix:"%"}),"text-align":c(["inherit","left","center","right","justify"]),"text-decoration":c("inherit none underline overline line-through blink".split(" ")),"text-indent":f({min:0,max:300,postfix:"px"}),"text-transform":c(["inherit","none","capitalize","uppercase","lowercase"]),"text-shadow":function(c,
d){function e(){c.modifycss(f,"text-shadow",x+" "+q+" "+u+" "+p)}var f=d.selector,g=d.css,a=$('<input class="colorinput">'),b=$("<div>"),j=$("<div>"),h=$("<div>"),w=$("<div>");w.append("Text-shadow color:").append(a).append(b).append(j).append(h);var x="0px",q="0px",u="0px",p="#000000";c.registercsshandler(f,"text-shadow",function(c){c=c.split(" ");var d=0,e=c[d],d=d+1;x=e;b.StylerSlider("string",e);e=c[d];d+=1;q=e;j.StylerSlider("string",e);/#.*/.test(c[d])||(e=c[d],d+=1,u=e,h.StylerSlider("string",
e));c=c[d];a.val(c);a.css("background-color",c)});b.StylerSlider({min:-50,max:50,nopostfixchange:!0,cssprop:"text-shadow-hoffset",registercss:!1,change:function(b,a){x=a;e()}});j.StylerSlider({min:-50,max:50,nopostfixchange:!0,cssprop:"text-shadow-voffset",registercss:!1,change:function(b,a){q=a;e()}});h.StylerSlider({min:0,max:50,nopostfixchange:!0,cssprop:"text-shadow-blur",registercss:!1,change:function(b,a){u=a;e()}});var v=f+g;a.click(function(){showColorChooser(a,v,c);return!1});c.registerColorInput(v,
a);a.change(function(){a.css("backgroundColor",a.val());p=a.val();e()});return w}};styler_meta.builders={checkbox:function(c,d){var e=d.selector,f=d.css,g=d.checked,a=d.unchecked,b=$("<input type='checkbox'>");$(b).change(function(){var d;d=b.attr("checked")?g:a;c.modifycss(e,f,d)});c.registercsshandler(e,f,function(a){a==g?b.attr("checked","checked"):b.attr("checked","")});return b},color:e,slider:f({}),fourslider:d({}),radio:c({}),backgroundurlbuilder:h};styler_meta.defaultvalues={"border-color":"transparent",
"border-width":"0","border-style":"none","border-top-left-radius":"0px","border-top-right-radius":"0px","border-bottom-right-radius":"0px","border-bottom-left-radius":"0px","box-shadow":"0px 0px 0px 0px #000000","background-color":"transparent","background-image":"none","background-repeat":"repeat","background-size":"auto auto","margin-top":"0","margin-right":"0","margin-bottom":"0","margin-left":"0",padding:"0",width:"auto",height:"auto",opacity:"1","font-family":"inherit","font-style":"normal",
"font-variant":"normal","font-weight":"normal","font-size":"100%","text-align":"left","text-decoration":"none","text-indent":"0px","text-transform":"none","text-shadow":"0px 0px 0px #000000"}}var _counter=0;initbuilders();function RGBToHSL(c,d,g){var e=Math.min(c,d,g),h=Math.max(c,d,g),f=h-e,B=0,C=0,z=(e+h)/2;0!=f&&(C=0.5>z?f/(h+e):f/(2-h-e),B=60*(c==h?(d-g)/f:d==h?2+(g-c)/f:4+(c-d)/f));0>B&&(B+=360);return[B,C,z]}function HSLToRGB(c,d,g){if(0==d)return[g,g,g];d=0.5>g?g*(1+d):g+d-g*d;g=2*g-d;c/=360;c=[(c+1/3)%1,c,(c+2/3)%1];for(var e=0;3>e;++e)c[e]=c[e]<1/6?g+6*(d-g)*c[e]:0.5>c[e]?d:c[e]<2/3?g+6*(d-g)*(2/3-c[e]):g;return c}function roundNumber(c,d){return Math.round(c*Math.pow(10,d))/Math.pow(10,d)}
void 0==window.staticpath&&(window.staticpath="/static/colorpicker/");
function initColorChooser(){function c(b,a,k,c){b=RGBToHSL(b/255,a/255,k/255);s=b[0];n=100*b[1];t=100*b[2];l=c;h();f()}function d(b,a,k){return c(parseInt(b,16),parseInt(a,16),parseInt(k,16),1)}function g(){y||e(p.val())}function e(b){if(/^\s*$/.test(b))r=0;else{var a=/^\s*#([0-o9a-fA-F]{6})\s*$/;if(a=a.exec(b))r=0,d(a[1].slice(0,2),a[1].slice(2,4),a[1].slice(4,6));else if(a=/^\s*#([0-o9a-fA-F]{3})\s*$/,a=a.exec(b))r=1,d(a[1].slice(0,1),a[1].slice(1,2),a[1].slice(2,3));else if(a=/^\s*rgb\((\d+),(\d+),(\d+)\)\s*$/,
a=a.exec(b))r=2,c(a[1],a[2],a[3],1);else if(a=/^\s*rgba\((\d+),(\d+),(\d+),([\d\.]+)\)\s*$/,a=a.exec(b))r=3,c(a[1],a[2],a[3],a[4]);else if(a=/^\s*hsl\((\d+),(\d+)%?,(\d+)%?\)\s*$/,a=a.exec(b)){r=4;b=a[2];var k=a[3];s=a[1];n=b;lighness=k;l=1;h();f()}else a=/^\s*hsla\((\d+),(\d+)%?,(\d+)%?,([\d\.]+)\)\s*$/,(a=a.exec(b))?(r=5,b=a[2],k=a[3],s=a[1],n=b,lighness=k,l=1,h(),f()):(console.log("WARNING unknown color value.->"+b),r=0)}}function h(){var a=u.getContext("2d");a.fillStyle="white";a.fillRect(0,0,
100,100);for(var b=a.getImageData(0,0,100,100),k=b.data,c=0;100>c;c++)for(var d=0;100>d;d++){var e=HSLToRGB(s,d/100,(100-c)/100);e[0]*=255;e[1]*=255;e[2]*=255;k[4*(100*c+d)]=e[0];k[4*(100*c+d)+1]=e[1];k[4*(100*c+d)+2]=e[2];k[4*(100*c+d)+3]=255}a.putImageData(b,0,0)}function f(){a.find("input[name=hue]").val(s);a.find("input[name=saturation]").val(n);a.find("input[name=lightness]").val(t);a.find("input[name=alpha]").val(l);var b=function(a){p.val(a);p.css("background-color",a);y=!0;p.change();y=!1},
k=HSLToRGB(s,n/100,t/100),c=Math.floor(255*k[0]),d=Math.floor(255*k[1]),k=Math.floor(255*k[2]);if(1!=l){if(0==r||1==r||2==r)r=3;4==r&&(r=5)}else 3==r&&(r=0),5==r&&(r=4);0==r||1==r?(c=c.toString(16),1==c.length&&(c="0"+c),d=d.toString(16),1==d.length&&(d="0"+d),k=k.toString(16),1==k.length&&(k="0"+k),b("#"+c+d+k)):2==r?b("rgb("+c+","+d+","+k+")"):3==r?(c="rgba("+c+","+d+","+k+","+l+")",b(c)):4==r?(c="hsl("+s+","+n+"%,"+t+"%)",b(c)):5==r&&(c="hsla("+s+","+n+"%,"+t+"%,"+l+")",b(c))}function B(){j.css("background-color",
"hsla("+s+","+n+"%,"+t+"%,"+l+")");var a=b.get(0).getContext("2d");a.save();a.fillStyle="#777";a.fillRect(0,0,200,200);a.drawImage(w,5,5,190,190);a.drawImage(x,50,50,100,100);a.globalAlpha=l;a.drawImage(u,50,50,100,100);a.globalAlpha=1;a.save();a.translate(100,100);a.rotate(s*Math.PI/180);a.lineWidth=2;a.beginPath();a.moveTo(0,-95);a.lineTo(0,-77);a.stroke();a.closePath();a.restore();var k=100-t,c=n;a.beginPath();a.arc(50+c,50+k,3,0,2*Math.PI);a.lineWidth=1;a.stroke();a.closePath();a.drawImage(q,
5,205);k=a.createLinearGradient(5,0,195,0);k.addColorStop(0,"hsla("+s+","+n+"%,"+t+"%,0)");k.addColorStop(1,"hsla("+s+","+n+"%,"+t+"%,1)");a.fillStyle=k;a.fillRect(5,205,190,20);a.beginPath();a.moveTo(5+190*l,205);a.lineTo(5+190*l,225);a.lineWidth=2;a.stroke();a.closePath();a.restore()}function C(){B();setTimeout(C,100)}function z(){a.slideUp(A());$(document).unbind("click",z);p&&(p.unbind("change",g),p=!1);E=k=void 0}function m(){G=!1;a.find(".innercontainer").animate({left:0},500)}function A(){a.width(285);
a.find(".palettelist").empty();m()}$("#colorchooser").length||$("body").append("<div id='colorchooser'>\n        <div class='innercontainer'>\n        <canvas class='colorcanvas' width=\"200\" height=\"230\"></canvas>\n        <div class='sidebox'>\n            <div class='backboxtile'></div>\n            <div class='previewbox'></div>\n            <div class='comparebox'></div>\n            <div class='inputbox'>\n            <span class='label'>Hue:</span><br />\n            <input name='hue'></input><br />\n            <span class='label'>Saturation:</span><br />\n            <input name='saturation'></input><br />\n            <span class='label'>Lightness:</span><br />\n            <input name='lightness'></input><br />\n            <span class='label'>Alpha:</span><br />\n            <input name='alpha'></input><br />\n            </div>\n        </div>\n        <div class='palettebox'>\n            <div class='paletteicon'></div>\n            <div class='palettelist'>\n                \n            </div>\n        </div>\n        </div>\n        </div>");
var a=$("#colorchooser"),b=a.find(".colorcanvas"),j=a.find(".previewbox"),D=a.find(".comparebox"),w=new Image;w.src=staticpath+"huecircle.png";var x=new Image;x.src=staticpath+"backtile.png";var q=new Image;q.src=staticpath+"alphatile.png";var u=document.createElement("canvas");u.width=100;u.height=100;var p=!1,v=5,s=45,n=100,t=50,l=1,y=!1,k,E,r=0;h();a.find(".inputbox input").change(function(){if(/[\d\.]+/.test(a.find("input[name=hue]").val())){var b=parseInt(a.find("input[name=hue]").val(),0);0<
b&&360>b&&(s=b,h())}/[\d\.]+/.test(a.find("input[name=saturation]").val())&&(b=parseInt(a.find("input[name=saturation]").val(),0),0<b&&100>b&&(n=b));/[\d\.]+/.test(a.find("input[name=lightness]").val())&&(b=parseInt(a.find("input[name=lightness]").val(),0),0<b&&100>b&&(t=b));/[\d\.]+/.test(a.find("input[name=alpha]").val())&&(b=parseFloat(a.find("input[name=alpha]").val()),0<b&&1>b&&(l=b))});C();b.bind("mousedown",function(a){function c(){k&&E&&E.setInputColor(k,"")}function d(a,b){var k=Math.atan2(a,
b),k=180*k/Math.PI,k=k+90;0>k&&(k+=360);s=Math.floor(k);h();B();f();c()}var e=b.offset(),g=a.pageX-e.left;a=a.pageY-e.top;var e=g-100,j=a-100,r=Math.sqrt(e*e+j*j);if(95>r&&77<r)return d(j,e),b.bind("mousemove",function(a){var k=b.offset();d(a.pageY-k.top-100,a.pageX-k.left-100)}),g=function(){b.unbind("mouseup");b.unbind("mouseout");b.unbind("mousemove")},b.bind("mouseup",g),b.bind("mouseout",g),!1;if(50<g&&150>g&&50<a&&150>a)return n=g-50,t=100-(a-50),B(),f(),c(),b.bind("mousemove",function(a){var k=
b.offset(),d=a.pageY-k.top;a=a.pageX-k.left-50;0>a&&(a=0);100<a&&(a=100);d-=50;0>d&&(d=0);100<d&&(d=100);n=a;t=100-d;B();f();c();return!1}),g=function(){b.unbind("mouseup");b.unbind("mouseout");b.unbind("mousemove")},b.bind("mouseup",g),b.bind("mouseout",g),!1;if(5<g&&195>g&&205<a&&225>a)return l=(g-5)/190,l=roundNumber(l,3),f(),c(),b.bind("mousemove",function(a){var k=b.offset();a=a.pageX-k.left-5;0>a&&(a=0);190<a&&(a=190);l=a/190;l=roundNumber(l,3);f();c();return!1}),g=function(){b.unbind("mouseup");
b.unbind("mouseout");b.unbind("mousemove")},b.bind("mouseup",g),b.bind("mouseout",g),!1});B();a.click(function(){return!1});var G=!1;a.find(".paletteicon").click(function(){G?m():(G=!0,a.find(".innercontainer").animate({left:-200},500))});showColorChooser=function(b,c,d){function f(){if(void 0!=c){k=c;E=d;a.width(310);var h=E.getPalette(),j=E.getCurrentColorName(k),r;for(r in h){var l=$("<div class='paletteitem'>"),n=$("<div class='paletteitembox'>");n.attr("title",r);r==j&&l.toggleClass("selected");
n.css("background-color",h[r]);l.append(n);l.append("<span class='colorname'>"+r+"<span>");l.append("<br />");l.click(function(){var b=$(this).find(".colorname").text();E.setInputColor(k,b);var c=E.getPalette();e(c[b]);a.find(".palettelist .selected").toggleClass("selected");$(this).toggleClass("selected")});a.find(".palettelist").append(l)}}h=b.offset();j=h.left;r=h.top+b.outerHeight()+v;j=j-a.outerWidth()/2+b.outerWidth()/2;j+a.outerWidth()>$(window).width()&&(j=$(window).width()-a.outerWidth());
0>j&&(j=0);r+a.outerHeight()>$(window).height()&&(r=h.top-a.outerHeight());0>r&&(r=0);a.css("left",j);a.css("top",r);p=b;a.slideDown();$(document).click(z);p.bind("change",g);D.css("background-color",p.val());e(p.val())}p&&p[0]==b[0]||(p&&p!=b?a.slideUp(f):f())}}initColorChooser();function Styler(c){function d(a,b){if(void 0!=a.type&&"control"!=a.type)return g(a,b);b&&(a=$.extend({},b,a));if(!a.selector|!a.css)console.log("Minimum control component is not given.");else{a.name||(a.name=a.css);var c=a.name,e=a.css;if(a.container){var f={type:a.container,name:c,controls:[a]};a.container=void 0;return g(f,b)}var f=$("<div class='styler_control'>"),h,j;a.builder?(j=a.builder,h=styler_meta.builders[a.builder]):styler_meta.predefbuilders[a.css]?(j=styler_meta.predefbuilders[a.css].name,
h=styler_meta.predefbuilders[a.css]):styler_meta.predefcustomcss?(j="predef",h=void 0):(j="defaultbuilder",h=defaultbuilder);-1==styler_meta.nolabel.indexOf(e)&&(f.append("<span>"+c+" : </span>"),-1==styler_meta.nobr.indexOf(j)&&f.append("<br />"));if(h)try{f.append(h(q,a))}catch(l){console.log("Error on builder "+j+" ->"+l)}else c=$.extend(!0,{},styler_meta.predefcustomcss[a.css]),c.name=a.name,a.name=void 0,f.append(d(c,a));return f}}function g(a,b){var c=$.extend({},b,a.defaultprop),e=a.controls,
g=$("<div>");void 0==a.type&&(a.type="emptygroup");if("bordergroup"==a.type){g=$("<div class='styler_group ui-corner-all ui-widget-content'>");a.name&&g.append("<h3>"+a.name+"</h3>");for(var f in e)try{g.append(d(e[f],c))}catch(h){console.log("Error building control->"+h.toString())}return g}if("emptygroup"==a.type||"group"==a.type){g=$("<div>");a.name&&g.append("<h3>"+a.name+"</h3>");for(f in e)try{g.append(d(e[f],c))}catch(j){console.log("Error building control->"+j.toString())}return g}if("accordion"==
a.type){v+=1;var l="accordion"+v.toString(),g=$("<div class='styler_accordian_group'>"),e=a.controls,n=$("<h3 class='"+l+"'><a href='#'>"+(a.name?a.name:"no-title")+"</a></h3>"),t=$("<div class='cont'></div>");for(f in e)try{$(t).append(d(e[f],c))}catch(p){console.log("Error building control->"+p.toString())}g.append(n);g.append(t);$(g).accordion({active:!1,autoHeight:!0,heightStyle:"content",header:"h3."+l,collapsible:!0});return g}}function e(a){var c="\n/*--CSS statement below is generated by Styler. Please do not remove this comment--*/\n",
d=b;j.contents().find(".preview_container").toggleClass("preview_container");var e=/\/\*--CSS statement below is generated by Styler. Please do not remove this comment--\*\/([\s\S]*)/.exec(b);if(e){var c=e[0],g=/([\s\S]*)\n\/\*--CSS statement above is generated by Styler. Please do not remove this comment--\*\//,f=g.exec(e[1]);f&&(c=g.exec(e[0])[0],e=f);var e=e[1],h;for(h in w)if(f=RegExp(h+"[ ]*{[^{}]*}").exec(e)){var g=f[0],f=/([^}]*)}/.exec(f[0])[1],p=w[h],m;for(m in p)if(p.hasOwnProperty(m)){var q=
m+":"+p[m]+";",s=RegExp("([\\s;]+)"+m+" *:[^:;]*;");if(s.test(f))var u=s.exec(f)[1],f=f.replace(s,u+q);else f=f+q+"\n"}f+="}";e=e.replace(g,f)}else{f="\n"+h+"{\n";p=w[h];for(m in p)p.hasOwnProperty(m)&&(q=m+":"+p[m]+";\n",f+=q);f+="}";e+=f}d=d.replace(c,"/*--CSS statement below is generated by Styler. Please do not remove this comment--*/"+e+"\n/*--CSS statement above is generated by Styler. Please do not remove this comment--*/")}else{for(h in w){f="\n"+h+"{\n";p=w[h];for(m in p)p.hasOwnProperty(m)&&
(q=m+":"+p[m]+";\n",f+=q);f+="}";c+=f}d=d+c+"\n/*--CSS statement above is generated by Styler. Please do not remove this comment--*/"}h={colors:t,palettegallery:l};m={};for(inputid in n)""!=n[inputid].color&&(m[inputid]=n[inputid].color);h.inputs=m;m=d;h=JSON.stringify(h,null,4);h="/* Color Palette \n"+h+"\n*/";c=/\/\*\s*Color Palette\s*\n([^*]*)\n\s*\*\//mg;b=m=c.exec(d)?m.replace(c,h):m+"\n"+h;if(a)for(var x in w){a=w[x];for(var y in a)a.hasOwnProperty(y)&&$(j).contents().find(x).css(y,"")}return b}
function h(a){b="";D={};w={};n={};t=$.extend(!0,{},m.palette);l=m.palettegallery;A.empty();A.append();b=a;x=!0;A.html("<div class='mainloading'><br /><br /><br /><br /><h3>Parsing</h3>Please wait...</div>");setTimeout(s,100)}function f(){var a=y.find(".palettegallery");a.empty();for(index in l){var b=$("<div themename='"+l[index].name+"' class='palettethemeitem'>"),c=$("<div class='removecolor'>");c.click(function(){for(var a=$(this).parent().attr("themename"),b=0;b<l.length&&l[b].name!=a;)b++;b==
l.length?console.log("cannot find theme "+a):l.splice(b,1);f()});b.append(c);for(colorname in l[index].colors)b.append("<div class='colorbox' style='background-color:"+l[index].colors[colorname]+"'></div>");b.append("<span class='name'>"+l[index].name+"</span>");b.click(function(){var a=$(this).attr("themename"),b;for(index in l)l[index].name==a&&(b=l[index].colors);for(colorname in b)C(colorname,b[colorname]);B()});a.append(b)}}function B(){var a=y.find(".palettelist");a.empty();for(colorname in t){var b=
$("<div class='palettecoloritem'></div>"),c=$("<input class='colorinput'>");c.css("background-color",t[colorname]);c.val(t[colorname]);c.attr("colorname",colorname);c.change(function(){var a=$(this).attr("colorname");C(a,$(this).val())});c.click(function(){showColorChooser($(this));return!1});var d=$("<span>"+colorname+"</span>"),e=$("<div class='removecolor'>");e.click(function(){var a=$(this).parent().find("input").attr("colorname");delete t[a];B()});b.append(e);b.append(c);b.append(d);a.append(b)}}
function C(a,b){t[a]=b;y.find("input[colorname='"+a+"']").val(b);y.find("input[colorname='"+a+"']").css("background-color",b);for(var c in n)n[c].color==a&&(n[c].input.val(b),n[c].input.change())}var z={css:"",iframe:$("<iframe>"),basecss:"",container:$("<div>"),predeflayout:{},searchlayout:!0,palettegallery:[{name:"default",colors:{foreground:"#000",foreground2:"#011969",background:"#ADE7FF",background2:"#B1D1DE",border:"#0C506B",highlight:"#FF110D"}},{name:"purple",colors:{foreground:"#000",foreground2:"#870047",
background:"#E768AB",background2:"#E73A95",border:"#9c2765",highlight:"#98ed00"}}],palette:{foreground:"#000",foreground2:"#011969",background:"#ADE7FF",background2:"#B1D1DE",border:"#0C506B",highlight:"#FF110D"},preparse:!0},m=$.extend({},z,c),A=m.container,a=m.basecss,b=m.css,j=m.iframe,D={},w={},x=!1,q={},u=m.predeflayout,p=m.searchlayout;q.modifycss=function(a,b,c,d){if(!x||d)console.log("change "+b+" for "+a+"->"+c),""!=a&&(""!=a&&!d)&&(j.contents().find(a).css(b,c),w[a]||(w[a]={}),w[a][b]=""==
c||c=={}?"delete":c)};q.registercsshandler=function(a,b,c){D[a]||(D[a]={});D[a][b]&&console.log("for some reason, this handler already exist->"+a+" css->"+b);D[a][b]=c};$("#savebutton").click(function(){e()});var v=0,s=function(){var c=function(a){h=!0;for(page in a){j+=1;var b="tab-"+page.replace(/\s/g,"_"),b=b+"uid"+j.toString(),c=$("<div id='"+b+"'></div>");e.append("<li><a href='#"+b+"'>"+page+"</a></li>");c.append(g(a[page]));d.append(c)}},d=$("<div>"),e=$("<ul>"),h=!1,j=0;u&&c(u);if(p)for(var m=
/\/\*\s*layout\s*\n([^*]*)\n\s*\*\//mg,q;q=m.exec(b);){q=q[1];var s;try{s=JSON.parse(q)}catch(w){console.log("Invalid layout->"+w.toString())}c(s)}h||(e.append("<li><a href='#taberror'>Error</a></li>"),d.append("<div id='taberror'><h3>No valid styler layout found.</h3>The css does not contain Styler layout description. Therefore styler is not available.</div>"));e.append("<li><a href='#stylercolortab' class='stylercolortab'>Color</a></li>");colortab=$("<div id='stylercolortab'>");colortab.append(y);
d.append(colortab);d.prepend(e);$(d).tabs();A.html(d);for(var v in D)for(var z in D[v])for(var J in styler_meta.defaultvalues)if(z==J)D[v][z](styler_meta.defaultvalues[J]);x=!0;c=a+b.replace(/\/\*[\s\S]*?\*\//mg,"\n");for(m=RegExp("s*([^}]+?)s*{([^{}]*)}","mg");v=m.exec(c);){s=$.trim(v[1]);v=v[2];for(z=/([^:;]+):([^:;]*|[^:;]*\([^;]*\))[^:;]*\;/g;q=z.exec(v);)if(J=$.trim(q[1]),q=$.trim(q[2]),D[s]&&D[s][J])D[s][J](q)}x=x=!1;a:if(c=/\/\*\s*Color Palette\s*\n([^*]*)\n\s*\*\//mg.exec(b)){console.log("Palette data detected");
c=c[1];try{c=JSON.parse(c)}catch(M){console.log("Invalid palette data->"+M.toString());break a}t=c.colors;$.extend(!0,l,c.palettegallery);c=c.inputs;for(inputid in c){var F=c[inputid];for(inputid2 in n)inputid==inputid2&&(n[inputid2].color=F)}for(F in t)C(F,t[F])}y.empty();F=$("<div>");F.append("<h3>Modify Color Palette</h3>");c=$("<div class='palettelist'>");F.append(c);y.append(F);B();var H=$("<div class='addcolor'><span style='font-weight:bold;'>Add Color</span></div>");H.append("<div style='margin:1ex 0;'>Color name : <input name='colorname' /></div>");
H.append("<button>Add</button>");H.find("button").button();H.find("button").click(function(){var a=$(H).find("input[name=colorname]").val();void 0==a||""==a.trim()||(C(a,"#ffffff"),B())});y.append(H);y.append("<h3>Select predefined Color Palette</h3>");y.append("<div class='palettegallery'>");f();var I=$("<div class='addcolorgallery'><span style='font-weight:bold;'>Add Gallery</span></div>");I.append("<div>Theme Name: <input name='themename'/></div>");I.append("<button>Add</button>");I.find("button").button();
I.find("button").click(function(){var a=$(I).find("input[name=themename]").val();if(!(void 0==a||""==a.trim())){for(var b in l)if(l[b].name==a)return;a={name:a,colors:{}};for(color in t)a.colors[color]=t[color];l.push(a);f()}});y.append(I)};q.getNewCss=e;q.updateCss=h;var n={},t=$.extend(!0,{},m.palette),l=m.palettegallery,y=$("<div class='palettetab'>");q.getCurrentColorName=function(a){return void 0==n[a]?(console.log("WARNING color input not registered ->"+a),""):n[a].color};q.setInputColor=function(a,
b){if(void 0==n[a])return console.log("WARNING color input not registered ->"+a),"";n[a].color=b;$(n[a].input).val(t[b]);$(n[a].input).css("background-color",t[b])};q.registerColorInput=function(a,b){n[a]={input:b,color:""}};q.getPalette=function(){return t};m.preparse&&h(b);return q};
