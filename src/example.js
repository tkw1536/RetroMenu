

$(function(){

    /** Simple Example for RetroMenu.
    * @name RetroMenu.example
    * @function
    */
    RetroMenu.example = function(){
        //do stuff
        window.myMenu = new RetroMenu("RetroMenu Demo");

        myMenu.prompt("What is your name?", function(res){console.log(res); this.destroy(); });
    }

    //Run the example
    RetroMenu.example();
})
