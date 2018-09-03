// ES5 only
'use strict';

// Player properties starting with position and dimension
// start player in center of default world size

player_texture = util_createCanvas(player_width, player_height, function (cx) {
    /*T_plotRoundedRect(cx, {
        borderRadius: 2,
        shouldFill: true,
        color: "blue"
    });
    don't know why this doesn't work, also when player width is small this may cause infinite loop
    */
    T_plotRectangle(
        cx, 
        {
        x: 0,
        y: 0,
        w: player_width,
        h: player_height,
        shouldFill: true,
        color: 'orange'
    })
});
player_textureCtx = player_texture.getContext('2d');

// Player methods
function player_update(dt) {
    
}

function player_render(dt) {
    if (player_shouldRender) {
        player_screenCtx.drawImage(player_texture, player_x-player_width/2, player_y-player_height/2);
    }
}