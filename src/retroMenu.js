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
            throw new Error("RetroMenu accepts at most 3 arguments. ");
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

        //disable all event handlers.
        this._display_element
        .off("click.RetroMenu");

        //start the hooks
        this
        .stop_hooks()
        .start_hooks();

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
            } else if(key == RetroMenu.keyCodes.W){
                hook_element.trigger(RetroMenu.keyActions.UP);
            } else if(key == RetroMenu.keyCodes.DOWN){
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

    //
    // DIALOG Boxes
    //

    /**
    * Shows an alert box.
    *
    * @param {string} text - Text to alert the user to.
    * @param {jQuery} [msg_div] - Message element to also add.
    * @param {RetroMenu~alertCallback} [next] - Callback when the user confirms the message. If omitted, alert does not close until manually closed.
    *
    * @function
    * @instance
    * @name alert
    * @memberof RetroMenu
    * @return {RetroMenu} - this for chaining
    */
    RetroMenu.prototype.alert = function(text, msg_div, next){

        if(typeof msg_div == "function"){
            //we do not have a msg
            next =  msg_div;
            msg_div = "";
        }

        if(typeof next == "undefined"){
            //the next function is nothing.
            next = false;
        }

        var me = this;

        //re-init
        this.init();

        //and the hook element
        var hook_element = this._hook_element;

        //create the alert div
        var alert_div = $("<div>").appendTo(this._display_element);


        //create the elements.
        alert_div.append([
            //the text
            $("<div>").text(text).on("click", function(){alert_div.find("form").submit(); }),
            msg_div,
            $("<form>")
            .append(
                $("<input type='submit' value='&nbsp; '>")
            ).on("submit", function(event){
                //ok stop things.
                event.preventDefault();

                if(typeof next == "function"){

                    //remove the div
                    alert_div.remove();

                    //and re-init
                    me.init();

                    //and make the callback
                    next.call(me);
                } else {
                    //Nothing is next => never close
                    return;
                }
            })
        ]);

        //focus whenever we click, and now also focus
        this._display_element
        .on("click.RetroMenu.alert", function(){
            alert_div.find("input[type=submit]").focus();
        })
        .click();

        return this;
    };

    /**
    * Shows an alert dialog using a new RetroMenu Instance.
    *
    * @param {string} title - Title to use for this dialog box.
    * @param {string} text - Text to alert the user to.
    * @param {jQuery} [msg_div] - Message element to also add.
    * @param {RetroMenu~alertCallback} [next] - Callback when the user confirms the message. If omitted, alert does not close until manually closed.
    *
    * @function
    * @name RetroMenu.alert_dialog
    * @static
    * @return {RetroMenu} - newly created RetroMenu
    */
    RetroMenu.alert_dialog = function(title, text, msg_div, next){
        //Create a new menu
        var m = new RetroMenu(title);

        //and show an alert
        return m.alert(text, msg_div, next);
    }

    /**
    * Callback for results form alert dialogs.
    * @callback RetroMenu~alertCallback
    * @this {RetroMenu} - the RetroMenu instance the alert dialog was called on.
    */

    /**
    * Shows an prompt box.
    *
    * @param {string} text - Text to prompt the user for.
    * @param {string} [def = ""] - The default response to start with.
    * @param {boolean} [hide_input = False] - Should input be hidden (password prompt)
    * @param {jQuery} [msg_div] - Message element to also add.
    * @param {RetroMenu~promptCallback} [next] - Callback when the user confirms the message. If omitted, alert does not close until manually closed.
    *
    * @function
    * @instance
    * @name prompt
    * @memberof RetroMenu
    * @return {RetroMenu} - this for chaining
    */
    RetroMenu.prototype.prompt = function(text, def, hide_input, msg_div, next){


        //first handle all the argument cases
        console.log(arguments);

        throw new Error("Error: Arguments unimplemented! ");
        return; 


        var me = this;

        //re-init
        this.init();

        //and the hook element
        var hook_element = this._hook_element;

        //create the alert div
        var prompt_div = $("<div>").appendTo(this._display_element);

        var the_input = $("<input type='text'>");

        //Make the input
        if(hide_input){
            the_input.attr("type", "password");
        }

        //create the elements.
        prompt_div.append([
            //the text
            $("<div>").text(text).on("click", function(){alert_div.find("form").submit(); }),
            msg_div,
            $("<form>")
            .append(
                the_input,
                $("<input type='submit' value='&nbsp; '>")
            ).on("submit", function(event){
                //ok stop things.
                event.preventDefault();

                if(typeof next == "function"){

                    //remove the div
                    prompt_div.remove();

                    //and re-init
                    me.init();

                    //and make the callback
                    next.call(me, the_input.val());
                } else {
                    //Nothing is next => never close
                    return;
                }
            })
        ]);

        //focus whenever we click, and now also focus
        this._display_element
        .on("click.RetroMenu.prompt", function(){
            the_input.focus();
        })
        .click();

        return this;
    };


    /**
    * Callback for results for prompt dialogs.
    * @callback RetroMenu~promptCallback
    * @param {string} result - The result the user enters in the prompt.
    * @this {RetroMenu} - the RetroMenu instance the alert dialog was called on.
    */

    /**
    * Shows a select box.
    *
    * @param {string} text - Text to alert the user to.
    * @param {string[]} options - Options to make the user select from.
    * @param {jQuery} [msg_div] - Message element to also add.
    * @param {number} [startIndex = 0] - Index to start with.
    * @param {RetroMenu~selectCallback} [next] - Callback when the user confirms the message. If omitted, select does not close until manually closed.
    *
    * @function
    * @instance
    * @name select
    * @memberof RetroMenu
    * @return {RetroMenu} - this for chaining
    */
    RetroMenu.prototype.select = function(text, options, msg_div, startIndex, next){

        if(typeof msg_div == "function"){
            //we do not have a msg
            next =  msg_div;
            startIndex = 0;
            msg_div = "";
        } else if(typeof msg_div == "number"){
            //we only have a start index
            next = startIndex;
            startIndex = msg_div;
            msg_div = "";
        } else if(typeof startIndex == "function"){
            //we have no startIndex
            next = startIndex;
            startIndex = 0;
        }

        if(typeof next == "undefined"){
            //the next function is nothing.
            next = false;
        }

        if(options.length >= 0 && (typeof startIndex !== "number" || startIndex < 0 || startIndex % 1 != 0 || startIndex >= options.length)){
            //startIndex must be a positve number
            throw new Error("startIndex must be a non-negative integer no longer than the options list. ");
            return;
        }

        var me = this;

        //starting index
        var currentIndex = startIndex;

        //re-init
        this.init();

        //and the hook element
        var hook_element = this._hook_element;

        //create the alert div
        var select_div = $("<div>").appendTo(this._display_element);

        //here we make selections
        var selectableElement = $("<div>");

        var redraw = function(){
            selectableElement.empty();

            options.map(function(e, i){

                var timeout = -1;

                var $span = $("<span>").text(e).click(function(){
                    //on click, we select this one.


                    if(timeout !== -1){
                        clearTimeout(timeout);
                        timeout = -1;
                        select_div.find("form").submit();
                    } else {
                        timeout = setTimeout(function(){
                            redraw();
                            timeout = -1;
                        }, RetroMenu.dblclick_timeout );

                        //set the index and only redraw after the timeout.
                        currentIndex = i;
                    }
                });

                //append To the selectable element.
                selectableElement.append(
                    $span, "<br />"
                )

                //if its the current index, we are active.
                if(i == currentIndex){
                    $span.addClass("active");
                }
            })
        };

        //redraw once
        redraw();

        //create the elements.
        select_div.append([
            //the text
            $("<div>").text(text).on("click", function(){select_div.find("form").submit(); }),
            msg_div,
            selectableElement,
            $("<form>")
            .append(
                $("<input type='submit' value='&nbsp; '>")
            ).on("submit", function(event){
                //ok stop things.
                event.preventDefault();

                if(typeof next == "function"){

                    //remove the div
                    select_div.remove();

                    //and re-init
                    me.init();

                    //and make the callback
                    next.call(me, currentIndex, options[currentIndex]);
                } else {
                    //Nothing is next => never close
                    return;
                }
            })
        ]);

        //focus whenever we click, and now also focus
        this._display_element
        .on("click.RetroMenu.select", function(){
            select_div.find("input[type=submit]").focus();
        })
        .click();

        this._hook_element
        .on(RetroMenu.keyActions.UP, function(){
            currentIndex--;
            if(currentIndex < 0){
                currentIndex += options.length;
            }

            redraw();
        })
        .on(RetroMenu.keyActions.DOWN, function(){
            currentIndex++;
            if(currentIndex >= options.length){
                currentIndex -= options.length;
            }

            redraw();
        });

        return this;
    };

    /**
    * Shows a select dialog using a new RetroMenu Instance.
    *
    * @param {string} title - Title to use for this dialog box.
    * @param {string} text - Text to alert the user to.
    * @param {string[]} options - Options to make the user select from.
    * @param {jQuery} [msg_div] - Message element to also add.
    * @param {number} [startIndex = 0] - Index to start with.
    * @param {RetroMenu~selectCallback} [next] - Callback when the user confirms the message. If omitted, select does not close until manually closed.
    *
    * @function
    * @name RetroMenu.select_dialog
    * @static
    * @return {RetroMenu} - newly created RetroMenu
    */
    RetroMenu.select_dialog = function(title, text, options, msg_div, startIndex, next){
        //Create a new menu
        var m = new RetroMenu(title);

        //and show an alert
        return m.select(text, options, msg_div, startIndex, next);
    }

    /**
    * Callback for results form select dialogs.
    * @callback RetroMenu~selectCallback
    * @param {number} index - Index selected by the user.
    * @param {string} value - Value selected by the user.
    * @this {RetroMenu} - the RetroMenu instance the alert dialog was called on.
    */


    /**
    * Shows a confirm box.
    *
    * @param {string} text - Text to alert the user to.
    * @param {string[]} options - Options to make the user select from.
    * @param {jQuery} [msg_div] - Message element to also add.
    * @param {string} [startIndex = True] - Default to start with
    * @param {RetroMenu~confirmCallback} [next] - Callback when the user confirms the message. If omitted, select does not close until manually closed.
    *
    * @function
    * @instance
    * @name confirm
    * @memberof RetroMenu
    * @return {RetroMenu} - this for chaining
    */
    RetroMenu.prototype.confirm = function(text, msg_div, startIndex, next){

        if(typeof msg_div == "function"){
            //we do not have a msg
            next =  msg_div;
            startIndex = true;
            msg_div = "";
        } else if(typeof msg_div == "boolean"){
            //we only have a start index
            next = startIndex;
            startIndex = msg_div;
            msg_div = "";
        } else if(typeof startIndex == "function"){
            //we have no startIndex
            next = startIndex;
            startIndex = true;
        }

        if(typeof next == "undefined"){
            //the next function is nothing.
            callback = false;
        } else {
            //make the correct callback.
            callback = function(e, i){
                return next.call(this, i == 0);
            }
        }

        return this.select(text, [RetroMenu.confirm_true, RetroMenu.confirm_false], msg_div, startIndex?0:1, callback);
    }

    /**
    * Shows a confirm dialog using a new RetroMenu Instance.
    *
    * @param {string} title - Title to use for this dialog box.
    * @param {string} text - Text to alert the user to.
    * @param {string[]} options - Options to make the user select from.
    * @param {jQuery} [msg_div] - Message element to also add.
    * @param {string} [startIndex = True] - Default to start with
    * @param {RetroMenu~confirmCallback} [next] - Callback when the user confirms the message. If omitted, select does not close until manually closed.
    *
    * @function
    * @name RetroMenu.confirm_dialog
    * @static
    * @return {RetroMenu} - newly created RetroMenu
    */
    RetroMenu.confirm_dialog = function(title, text, msg_div, startIndex, next){
        var m = new RetroMenu(title);

        return m.confirm(text, msg_div, startIndex, next);
    }

    /**
    * Callback for results form select dialogs.
    * @callback RetroMenu~confirmCallback
    * @param {boolean} confirm - Did the user confirm?
    * @this {RetroMenu} - the RetroMenu instance the alert dialog was called on.
    */


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
            $(this._display_element)
                .find("span.active").removeClass("tabbed").end()
            .click();
        } else {

            //we are now tabbed
            $(this._display_element).find("span.active").addClass("tabbed");

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

    /**
    * Timeout after which a click is considered a double click in ms.
    * @name RetroMenu.dblclick_timeout
    * @type {number}
    * @default 250
    * @static
    */
    RetroMenu.dblclick_timeout = 250;

    /**
    * String used as True for confirm dialogs.
    * @name RetroMenu.confirm_true
    * @type {string}
    * @default "OK"
    * @static
    */
    RetroMenu.confirm_true = "OK";
    /**
    * String used as False for confirm dialogs.
    * @name RetroMenu.confirm_false
    * @type {string}
    * @default "Cancel"
    * @static
    */
    RetroMenu.confirm_false = "Cancel";


    //check that we have jQuery
    if(!$){
        console.error("RetroMenu depends on jQuery. ");
    }

})(jQuery);
