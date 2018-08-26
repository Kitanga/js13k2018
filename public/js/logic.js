// Use ES5, no ES6
'use strict';

var mouse_x = 0;
var mouse_y = 0;

window.onload = function () {
    /* canvas_offsetTop = canvas.offsetTop; */
    /* canvas_offsetLeft = canvas.offsetLeft; */
};

/** @type {function(Event)} */
canvas.onclick = function (event) {
    // Get the current mouse position
    mouse_x = event.pageX /* - canvas_offsetLeft */ ;
    mouse_y = event.pageY /* - canvas_offsetTop */ ;

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

/**
 * Cellular automata for Terrain Generation
 * @param width desired width in tiles
 * @param height desired height in tiles
 * 
 * @returns {[][]} a two Dimensional Array containing a generated world
 * */

function cellularAutomata(width, height) {
    // Setup variables
    var chanceToLive = 0.43;
    var birthLimit = 4;
    var deathLimit = 3;
    var steps = 2;

    var map = new Array(height);
    // Fill the map
    for (var ix = map.length; ix--;) {
        map[ix] = new Array(width);
        for (var kx = width; kx--;) {
            // It set's the tile to true if it has a chance to live
            map[ix][kx] = rnd() > chanceToLive ? 1 : 0;
            // map
        }
    }


    // Start processing array
    var countAliveNeighbours = function (x, y) {
        var count = 0;
        for (var ix = -1; ix < 2; ix += 1) {
            for (var kx = -1; kx < 2; kx += 1) {
                // 
                if (ix !== 0 && kx !== 0) {
                    if (map[y + ix] && map[y + ix][x + kx]) {
                        count++;
                    }
                }
            }
        }
        return count;
    };
    var process = function () {
        var map2 = new Array(height);
        console.log(map2);

        for (var ix = height; ix--;) {
            map2[ix] = new Array(width);
            for (var kx = width; kx--;) {
                var nCount = countAliveNeighbours(kx, ix);
                if (map[ix][kx]) {
                    if (nCount < deathLimit) {
                        map2[ix][kx] = 0;
                    } else {
                        map2[ix][kx] = 1;                        
                    }
                } else {
                    if (nCount > birthLimit) {
                        map2[ix][kx] = 1;
                    } else {
                        map2[ix][kx] = 0;                        
                    }
                }
            }
        }
        return map2;
    };
    var generateMap = function () {
        for (var ix = steps; ix--;) {
            map = process();
        }
    };
    var renderMap = function () {
        ctx.fillStyle = "black";
        for (var ix = height; ix--;) {
            for (var kx = width; kx--;) {
                if (map[ix][kx]) {
                    // console.log("draw at ", kx, ix);
                    T_setPixel(ctx, kx, ix);
                } else {
                    // console.log(map);
                }
            }
        }
    };

    generateMap();
    renderMap();

    return map;
}

