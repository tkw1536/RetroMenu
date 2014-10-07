

$(function(){

    /** Simple Example for RetroMenu.
    * @name RetroMenu.example
    * @function
    */
    RetroMenu.example = function(){
        //do stuff
        window.myMenu = new RetroMenu("RetroMenu Demo");

        myMenu.confirm("Is it OK to continue?",  "<a href='about:blank' target='_blank'>Link 1</a> - <a href='about:blank' target='_blank'>Link 2</a>", function(conf){console.log(conf); this.destroy(); });
    }

    //Run the example
    RetroMenu.example();
})
