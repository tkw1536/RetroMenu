# RetroMenu

A retro-styled menu in JavaScript, HTML & CSS. Originally developed for [POKE THE GAME](https://github.com/Poke-the-Game/Poke).

## Usage & Example

RetroMenu depends on [jQuery](https://jquery.com) only.

To use it include the JavaScript and CSS files and jQuery.

```html
<!-- Include jQuery -->
<script type="text/javascript" src="/path/to/jquery.js"></script>

<!-- Include RetroMenu -->
<script type="text/javascript" src="/path/to/retroMenu.js"></script>
<link rel="stylesheet" type="text/css" href="/path/to/retroMenu.css">
```

Both files can be found in the src/ directory.

```js
RetroMenu.confirm_dialog("Are you OK?", function(response){
    //Asks the user to answer with yes or no.
    if(response){
        RetroMenu.alert_dialog("That's great!"); //If you do not give a callback, the dialog will stay open forever.
    } else {
        RetroMenu.alert_dialog("You should better go see a doctor. ");
    }
});
```

You might also want to use a cool font such as [Press Start 2P](https://www.google.com/fonts/specimen/Press+Start+2P), but you will need to set that up yourself. Just apply it to the ```.RetroMenu``` selector.

A complete (simple) example can be found in index.html.

A full documentation can be found under doc or generated using [JSDoc](https://github.com/jsdoc3/jsdoc):  
```bash
rm -rf doc && jsdoc -c jsdoc.json
```

## License

Licensed under MIT.

```
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
```
