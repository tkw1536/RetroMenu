

$(function(){

    /** Simple Example for RetroMenu.
    * @name RetroMenu.example
    * @function
    */
    RetroMenu.example = function(){
        //do stuff
        window.myMenu = new RetroMenu("RetroMenu Demo");

        myMenu.select("Click to confinue",  ["OK", "Cancel"], "<a>Link 1</a> - <a>Link 2</a>", function(index, value){console.log(index); this.destroy(); });
    }

    //Run the example
    RetroMenu.example();
})
