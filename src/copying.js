/*
 * Copyright 2012 Muhd Amirul Ashraf bin Mohd Fauzi <asdacap@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
