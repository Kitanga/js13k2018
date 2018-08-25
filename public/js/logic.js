// Use ES5, no ES6
'use strict';

var mouse_x = 0;
var mouse_y = 0;

window.onload = function() {
    /* canvas_offsetTop = canvas.offsetTop; */
    /* canvas_offsetLeft = canvas.offsetLeft; */
};

/** @type {function(Event)} */
canvas.onclick = function(event) {
    // Get the current mouse position
    mouse_x = event.pageX/* - canvas_offsetLeft */;
    mouse_y = event.pageY/* - canvas_offsetTop */;

    // Tell the renderer that the player should start being rendered and that the player should also move towards the last mouse click
    player_shouldRender = true;
    player_shouldTrack = true;
};

/**
 * Updates game objects
 * 
 * @param {number} dt Delta time
 */
function T_update(dt) {
    player_update(dt);
}

/**
 * Renders game objects
 * 
 * @param {number} dt Delta time
 */
function T_render(dt) {
    player_render(dt);
}