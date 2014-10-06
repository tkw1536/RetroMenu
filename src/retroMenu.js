/*
Copyright (c) 2014 Tom Wiesing

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var RetroMenu;

(function($){

    /**
    * Creates a new RetroMenu instance.
    *
    * @param {string} [title] - Title to use for all dialogs.
    * @param {JSDoc} [hook_element = document.body] - jQuery element to apply all hooks to.
    *
    * @class RetroMenu
    */
    RetroMenu = function(title, hook_element){

        //parse the arguments
        if(arguments.length == 0){
            title = "";
            hook_element = document.body;
        } else if(argument.length == 1){
            if(typeof title !== "string"){
                hook_element = title;
                title = "";
            } else {
                hook_element = document.body;
            }
        }

        /**
        * The title which is displayed on this menu.
        *
        * @type {string}
        * @name RetroMenu#_title
        * @private
        */
        this._title = title;
        this._hook_element = hook_element;
    };


    //check that we have jQuery
    if(!$){
        console.error("RetroMenu depends on jQuery. ");
    }

})(jQuery);
