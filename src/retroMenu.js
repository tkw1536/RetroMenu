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

    /** Creates a new RetroMenu instance.
     *
     * @param {string} [title] - Title to use for all dialogs.
     * @param {jQuery} [display_element = $("<div>")] - jQuery element to use for display. May be changed.
     * @param {jQuery} [hook_element = document.body] - jQuery element to apply all keyboard based hooks to.
     *
     * @name RetroMenu
     * @this {RetroMenu}
     * @Alias RetroMenu
     * @class
     */
    RetroMenu = function(title, display_element, hook_element){

        if(arguments.length == 0){
            //no arguments given
            title = "";
            display_element = $("<div>");
            hook_element = document.body;
        } else if(arguments.length == 1){
            if(typeof title !== "string"){
                //the title is not a string
                display_element = title;
                title = "";
            } else {
                //it is a string!
                display_element = $("<div>");
            }

            hook_element = document.body;
        } else if(arguments.length > 3){
            //we have too many arguments
            throw new Exception("RetroMenu accepts at most 3 arguments. ");
            return;
        }

        //store properties

        /**
        * Title of this RetroMenu.
        *
        * @type {string}
        * @name RetroMenu#_title
        * @private
        */
        this._title = title;

        /**
        * Element used for display.
        *
        * @type {jQuery}
        * @name RetroMenu#_display_element
        * @private
        */
        this._display_element = $(display_element);

        /**
        * Element all key-based hooks are applied to.
        *
        * @type {jQuery}
        * @name RetroMenu#_hook_element
        * @private
        */
        this._hook_element = $(hook_element);

        //init it
        this.init();
    };

    //
    // SET UP
    //

    /**
    * Returns the JSON-style source of this Vote.
    *
    * @function
    * @instance
    * @name init
    * @memberof RetroMenu
    * @return {RetroMenu} - this for chaining
    */
    RetroMenu.prototype.init = function(){

        //take our element and prepare it
        this._display_element
        .detach()
        .empty()

        //add the class and title to it
        .addClass("RetroMenu")
        .append(
            $("<h1>").text(this._title)
        )

        // and add it to the page
        .appendTo(document.body);

        //start the hacks
        this.start_hooks();

        return this;
    }

    /**
    * Returns the JSON-style source of this Vote.
    *
    * @function
    * @instance
    * @name destroy
    * @memberof RetroMenu
    * @return {RetroMenu} - this for chaining
    */
    RetroMenu.prototype.destroy = function(){

        //stop all the hooks
        this.stop_hooks();

        //take our element and detach it
        this._display_element
        .detach()
        .empty();

        return this;
    }

    //
    // Key Hooks and actions.
    //

    /**
    * Enables key hooking for this menu.
    *
    * @function
    * @instance
    * @name start_hooks
    * @memberof RetroMenu
    * @return {RetroMenu} - this for chaining
    */
    RetroMenu.prototype.start_hooks = function(){

        //me is this
        var me = this;

        //element to send hook events to.
        var hook_element = this._hook_element;

        //start the hooks
        this._hook_element
        .on("keydown.RetroMenu", function(event){

            //which key was pressed and were we shifting
            var key = event.which;
            var shifted = event.shiftKey;

            if(key == RetroMenu.keyCodes.UP){
                event.preventDefault();
                hook_element.trigger(RetroMenu.keyActions.UP);
            } else if(key == key == RetroMenu.keyCodes.W){
                hook_element.trigger(RetroMenu.keyActions.UP);
            } else if(key == key == RetroMenu.keyCodes.DOWN){
                event.preventDefault();
                hook_element.trigger(RetroMenu.keyActions.DOWN);
            } else if(key == RetroMenu.keyCodes.S){
                hook_element.trigger(RetroMenu.keyActions.DOWN);
            } else if(key == RetroMenu.keyCodes.TAB){
                event.preventDefault();
                if(shifted){
                    hook_element.trigger(RetroMenu.keyActions.SHIFT_TAB);
                } else {
                    hook_element.trigger(RetroMenu.keyActions.TAB);
                }
            }
        })

        //register shift tab etc
        .on(RetroMenu.keyActions.TAB, function(){
            me.tab(false);
        })
        .on(RetroMenu.keyActions.SHIFT_TAB, function(){
            me.tab(true);
        });

        return this;
    }

    /**
    * Stops key hooking for this menu.
    *
    * @function
    * @instance
    * @name stop_hooks
    * @memberof RetroMenu
    * @return {RetroMenu} - this for chaining
    */
    RetroMenu.prototype.stop_hooks = function(){

        //remove the hooks
        this._hook_element
        .off("keydown.RetroMenu")

        //no more tabbing
        .off(RetroMenu.keyActions.TAB)
        .off(RetroMenu.keyActions.SHIFT_TAB);

        return this;
    }

    /**
    * Performs a tab key press.
    * @param {Boolean} reverse - Should it be a shift_tab?
    *
    * @function
    * @instance
    * @name tab
    * @memberof RetroMenu
    * @return {RetroMenu} - this for chaining
    */
    RetroMenu.prototype.tab = function(reverse){

        //all the links
        var as = this._display_element.find("a");

        //find the current index (via active class)
        var index = (function(){
            for(var i=0;i<as.length;i++){
                if(as.eq(i).hasClass("active")) {
                    return i;
                }
            }

            return -1;
        })();

        //increase decrease things
        if(reverse){
            if(index == -1){
                index = as.length - 1;
            } else {
                index--;
            }
        } else {
            index++;
        }


        if(index >= as.length || index  == -1){
            //OK, thats it => return to the default;
            as.removeClass("active");

            //and we are back
            $(this._display_element).find("span.selected").removeClass("tabbed");
        } else {

            //we are now tabbed
            $(this._display_element).find("span.selected").addClass("tabbed");

            //we select the current one
            as.removeClass("active")
            .eq(index)
                .addClass("active")
                .focus();
        }

        return this;
    }

    //All the dialog types

    //
    // Constants
    //

    /**
     * KeyCodes used by RetroMenu.
     *
     * @memberof RetroMenu
     * @alias RetroMenu.keyCodes
     * @enum {number}
     */
    RetroMenu.keyCodes = {
        /** "Arrow up" key */
        "UP": 38,
        /** "Arrow down" key */
        "DOWN": 40,

        /** The W key */
        "W": 87,
        /** The D key */
        "D": 68,

        /** The TAB key */
        "TAB": 9
    };

    /**
     * Actions that can occur.
     *
     * @memberof RetroMenu
     * @alias RetroMenu.keyActions
     * @enum {string}
     */
    RetroMenu.keyActions = {
        /** Move up in the menu. */
        "UP": "RetroMenu.up",
        /** Move down in the menu. */
        "DOWN": "RetroMenu.down",

        /** Tab forward */
        "TAB": "RetroMenu.tab",
        /** Tab backward.  */
        "SHIFT_TAB": "RetroMenu.tab_shift",
    };

    //check that we have jQuery
    if(!$){
        console.error("RetroMenu depends on jQuery. ");
    }

})(jQuery);
