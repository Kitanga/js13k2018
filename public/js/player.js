// ES5 only
'use strict';

// Player properties starting with position and dimension
var player_x = 0;
var player_y = 0;
var player_width = 52;
var player_height = 52;
var player_shouldRender = true;
var player_screen = document.createElement('canvas');
var player_screenCtx = player_screen.getContext('2d');
var player_shouldTrack = false;
var player_track_x = 0;
var player_track_y = 0;
var player_texture = util_createCanvas(player_width, player_height, function (cx) {
    Thoran_plotRoundedRect(cx, {
        borderRadius: 7,
        shouldFill: true
    });
});
var player_textureCtx = player_texture.getContext('2d');

// Player methods
function player_update(dt) {

}

function player_render(dt) {
    if (player_shouldRender) {
        player_screenCtx.drawImage(player_texture, player_x, player_y);
    }
}