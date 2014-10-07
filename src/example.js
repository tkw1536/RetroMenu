

$(function(){

    /** Simple Example for RetroMenu.
    * @name RetroMenu.example
    * @function
    */
    RetroMenu.example = function(){
        //do stuff
        window.myMenu = new RetroMenu("RetroMenu Demo");

        myMenu.select("Click to confinue",  ["OK", "Cancel", "3"], "<a href='about:blank' target='_blank'>Link 1</a> - <a href='about:blank' target='_blank'>Link 2</a>", function(index, value){console.log(index, value); this.destroy(); });
    }

    //Run the example
    RetroMenu.example();
})
