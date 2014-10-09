

$(function(){

    /** When called, registers all the example code on the demo page.
    * @name RetroMenu.example
    * @function
    */
    RetroMenu.example = function(){
        window.myMenu = new RetroMenu("RetroMenu Demo");

        $("#example1").click(function(e){
            e.preventDefault();

            //show a nice dialog
            RetroMenu.alert_dialog("Message", "I am a nice message. ", function(){
                //destroy it on enter
                this.destroy();
            });

        });

        $("#example2").click(function(e){
            e.preventDefault();

            RetroMenu.confirm_dialog("Confirm me", "Are you OK?", function(response){
                this.destroy();

                //Asks the user to answer with yes or no.
                if(response){
                    RetroMenu.alert_dialog("Response", "That's great!", function(){this.destroy(); });
                } else {
                    RetroMenu.alert_dialog("Response", "You should better go see a doctor. ", function(){this.destroy(); });
                }
            })
        });
        }

    //call it now!
    RetroMenu.example();
})
