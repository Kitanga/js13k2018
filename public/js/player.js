// ES5 only
'use strict';

// Player properties starting with position and dimension
// start player in center of default world size
var player_x = world_width/2;
var player_y = world_height/2;
var player_width = 16;
var player_height = 16;
var player_shouldRender = true;
var player_screen = document.createElement('canvas');
var player_screenCtx = player_screen.getContext('2d');
var player_shouldTrack = false;
var player_track_x = 0;
var player_track_y = 0;
var player_texture = util_createCanvas(player_width, player_height, function (cx) {
    T_plotRoundedRect(cx, {
        borderRadius: 3,
        shouldFill: true,
        color: "blue"
    });
});
var player_textureCtx = player_texture.getContext('2d');

// Player methods
function player_update(dt) {

}

function player_render(dt) {
    if (player_shouldRender) {
        player_screenCtx.drawImage(player_texture, player_x-player_width/2, player_y-player_height/2);
    }
}