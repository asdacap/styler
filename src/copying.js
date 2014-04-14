/*
 * Copyright 2014 Muhd Amirul Ashraf bin Mohd Fauzi <asdacap@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
