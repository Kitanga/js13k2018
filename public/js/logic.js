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
var config1 = {
    chanceToLive: 0.43,
    birthLimit: 34,
    deathLimit: 22,
    steps: 5,
    range: -3
};
var config2 = {
    chanceToLive: 0.52,
    birthLimit: 34,
    deathLimit: 22,
    steps: 2,
    range: -3
};
var config3 = {
    chanceToLive: 0.61,
    birthLimit: 22,
    deathLimit: 17,
    steps: 2,
    range: -3
};
var config4 = {
    chanceToLive: 0.43,
    birthLimit: 30,
    deathLimit: 22,
    steps: 4,
    range: -3
};
var seaConfig = {
    chanceToLive: 0.33,
    birthLimit: 90,
    deathLimit: 72,
    steps: 5,
    range: -5
};
var seaConfig = {
    chanceToLive: 0.25,
    birthLimit: 107,
    deathLimit: 70,
    steps: 48,
    range: -6
};

/**
 * Cellular automata for Terrain Generation
 * @param width desired width in tiles
 * @param height desired height in tiles
 * 
 * @returns {[][]} a two Dimensional Array containing a generated world
 * */

function cellularAutomata(width, height) {
    // Setup variables
    var chanceToLive = config2.chanceToLive;
    var birthLimit = config2.birthLimit;
    var deathLimit = config2.deathLimit;
    var steps = config2.steps;
    var range = config2.range;
    // var length = config2.range * -1 + 1;

    var map = new Array(height);
    // Fill the map
    for (var ix = 0; ix < height; ix++) {
        map[ix] = new Array(width);
        for (var kx = 0; kx < width; kx++) {
            // It set's the tile to true if it has a chance to live
            map[ix][kx] = rnd() > chanceToLive ? 1 : 0;
            // map
        }
    }


    // Start processing array
    var countAliveNeighbours = function (x, y, range) {
        var count = 0;
        var length = range * -1 + 1;

        for (var ix = range; ix < length; ix++) {
            for (var kx = range; kx < length; kx++) {
                var neighbour_x = x + kx;
                var neighbour_y = y + ix;
                if (ix == 0 && kx == 0) {
                    //Do nothing, we don't want to add ourselves in!
                    continue;
                }
                //In case the index we're looking at it off the edge of the map
                else if (neighbour_x < 0 || neighbour_y < 0 || neighbour_x >= map[0].length || neighbour_y >= map.length) {
                    count = count + 1;
                }
                //Otherwise, a normal check of the neighbour
                else if (map[neighbour_y] && map[neighbour_y][neighbour_x]) {
                    count = count + 1;
                }
            }
        }
        return count;
    };
    var process = function (deathLimit, birthLimit, range) {
        var map2 = new Array(height);
        for (var ix = 0; ix < height; ix++) {
            map2[ix] = new Array(width);
            for (var kx = 0; kx < width; kx++) {
                var nCount = countAliveNeighbours(kx, ix, range);
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
            map = process(deathLimit/*  + ix */, birthLimit, range);
        }
        for (var ix = 1; ix--;) {
            map = process(4, 3, -1);
        }
        // Removes any loss specks
        for (var ix = 1; ix--;) {
            map = process(3, 9, -1);
        }

        // Create the beach pixels
        createBeaches(map);
    };
    var renderMap = function (map) {
        ctx.fillStyle = "blue";
        ctx.fillRect(0,0,width, height);
        
        // Draw the ground blocks
        ctx.fillStyle = "seaGreen";
        for (var ix = 0; ix < height; ix++) {
            for (var kx = 0; kx < width; kx++) {
                if (map[ix][kx]) {
                    T_setPixel(ctx, kx, ix);
                }
            }
        }

        // Draw the beach blocks
        ctx.fillStyle = "navajoWhite";
        for (var ix = 0; ix < height; ix++) {
            for (var kx = 0; kx < width; kx++) {
                if (map[ix][kx] === 2) {
                    T_setPixel(ctx, kx, ix);
                }
            }
        }
    };
    var createBeaches = function (map) {
        // Process the map, looking for beach pixels

        for (var ix = 0; ix < height; ix++) {
            for (var kx = 0; kx < width; kx++) {
                var nCount = countAliveNeighbours(kx, ix, -1);
                if (map[ix][kx]/*  && ix > 0 && ix < height && kx > 0 && kx < width */) {
                    // If the pixel has less than 8 neighbours turn it into a beach tile
                    if (nCount < 8) {
                        map[ix][kx] = 2;
                    }
                }
            }
        }
    };

    generateMap();
    renderMap(map);
    // renderBeach(map);

    return map;
}