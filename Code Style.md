# Code Style

## File structure

Make sure a js file is created and added to the index.html. The Javascript file must have `'use strict';` at the top of the line.

----

## Underscore notation

### Variables

Let's say we were creating a player object the normal way we would do something like this:

```javascript
var player = {
    x: 3,
    y: 4,

    width: 3,
    height: 4
}
```

Now in underscore notation we'll do this instead:

```javascript
var player_x = 3;
var player_y = 4;

var player_width = 3;
var player_height = 4;
```

You can also use the `util_setVar` function. Though you should **not** use this function to instantiate any variables you want at start up. For that you should **do the above**.

`util_setVar`

```javascript
// Definitely don't do this for the player
util_setVar('player', {
    // Player position
    x: 0,
    y: 0,

    // Player dimension
    width: 25,
    height: 25,

    // Player canvas
    canvas: util_createCanvas(0, 0),
    ctx: player_canvas.getContext('2d'),

    // Player texture
    texture: util_renderToCanvas(player_width, player_height, util_Primitive_Circle),
    textureCtx: player_texture.getContext('2d'),

    shouldRender: true
});
```

### Functions

Functions should never be declared as expressions, but always as a named function:

```javascript
// DON'T do this
var player_update = function() {
    // ...
}

// But DO this instead
function player_update() {
    // ...
}
```

----


## For loops

Try as much as possible to use a reverse `for` loop and always use `ix` as the index and `kx` for secondary index. **DO NOT USE POST INCREMENTALS/DECREMENTALS (i.e. ++ix/--ix).**  Always use `--ix` or `++ix;`.

```javascript
// So this...
for (var ix = numberOfLoops; ix -= 1;) {}

// ...and this...
for (var ix = numberOfLoops; --ix;) {
    for (var kx = anotherNumberOfLoops; --kx;) {
        // ...
    }
}

// ...is fine.
```

## Warning

By having almost all variables on window, you can easily have a memory leak. Just be careful.