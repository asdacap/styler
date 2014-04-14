Styler
======

In short, A JS Based HTML Style editor that modify CSS in the background. Or in another word, a kinda WYSIWYG css editor. 

License
=======

Styler is licensed under Apache Software License version 2. See NOTICE.

Usage
=====

Styler main function

    Usage: 
    var mystyle=Styler({
    		css:thecss,
    		container:thecontainer,
    		iframe:previewiframe,
    		basecss:thebasecss,
    		predeflayout:"",
    		searchlayout:true,
    		palettegallery:thepalettegallery,
    		palette:thepalette,
    		preparse:true
    })
    
    'thecss' is the css that you want to edit.
    'thecontainer' is a jquery object which styler will use.
    'previewiframe' is a jquery object of an iframe which the content will be styled with the css
    'thebasecss' is a default css that parse before 'thecss'. Used to predefine style in the control.
    'predeflayout' is the layout of the control. The layout of the control may also be put in the css if 'searchlayout' is true.
    'thepalettegallery' is a list of color palette use in color palette tab.
    'palette' is the initial palette
    'preparse' if true will call updateCSS. Beware that updateCss has some asyncronous stuff running. Careful not tu run updateCss if preparse is true.
    to obtained updated css, symply call mystyle.getNewCss()
