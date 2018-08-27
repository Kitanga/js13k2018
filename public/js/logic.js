// Use ES5, no ES6
'use strict';

var mouse_x = 0;
var mouse_y = 0;

var world_height = 100;
var world_width = 100;

window.onresize = function () {
    console.log("canvas offset:"+canvas.offsetTop+","+canvas.offsetLeft);
};

/** @type {function(Event)} */
canvas.onclick = function (event) {
    // Get the current mouse position
    var tempPos = getMousePos(canvas, event);
    mouse_x = tempPos.x /* - canvas_offsetLeft */ ;
    mouse_y = tempPos.y /* - canvas_offsetTop */ ;
    /* position of mouse on canvas */
    console.log(mouse_x+','+mouse_y);
    /* grid position of click */
    console.log(Math.round(mouse_x/16)+','+Math.round(mouse_y/16));
    /* plot grid position for lols */
    T_plotRectangle(ctx, {
        x: Math.floor(mouse_x/16)*16,
        y: Math.floor(mouse_y/16)*16,
        w: 16,
        h: 16,
        color: 'red'
    });
    player_x = mouse_x;
    player_y = mouse_y;
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
var seaConfig2 = {
    chanceToLive: 0.25,
    birthLimit: 107,
    deathLimit: 70,
    steps: 48,
    range: -6
};
var quickConfig = {
    chanceToLive: 0.21,
    birthLimit: 3,
    deathLimit: 6,
    steps: 3,
    range: -1,
    length: -1 * -1 + 1
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
    var length = config2.range * -1 + 1;

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

        for (var ix = range; ix < length; ix++) {
            for (var kx = range; kx < length; kx++) {
                var neighbour_x = x + kx;
                var neighbour_y = y + ix;
                if (ix == 0 && kx == 0) {
                    //Do nothing, we don't want to add ourselves in!
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
            map = process(deathLimit, birthLimit, range);
        }
        for (var ix = 2; ix--;) {
            map = process(4, 3, -1);
        }
    };
    
    generateMap();
    

    return map;
}

/*
    renders map around the player
*/
var camera_pos_x, camera_pos_y;
var render_pos_x, render_pos_y;

function renderMap() {
    /*
    //change camera pos if player moved
    //need to also handle top and right boundary
    camera_pos_x = player_x > 15 ? player_x-16 : 16;
    camera_pos_y = player_y > 15 ? player_y-16 : 16;
    */
    camera_pos_x = 50;
    camera_pos_y = 50;

    //player_x-15
    //player_y-15
    console.log("drawing tiles in range");
    console.log("X:"+(camera_pos_x-16)+" to "+ (camera_pos_x+16));
    console.log("Y:"+(camera_pos_y-16)+" to "+ (camera_pos_y+16));
    for (var y=0, render_pos_x = camera_pos_x-16; render_pos_x < camera_pos_x+16; render_pos_x++, y++) {
        for (var x=0, render_pos_y = camera_pos_y-16; render_pos_y < camera_pos_y+16; render_pos_y++, x++) {
            
            if (world[render_pos_y][render_pos_x]) {
                //ctx.fillStyle = "black";
                //T_setPixel(ctx, x*16, y*16);
                /*T_plotRectangle(ctx, {
                    x: x*16,
                    y: y*16,
                    w: 8,
                    h: 8,
                    shouldFill: true,
                    color: 'black'
                });*/
            } else {
                //ctx.fillStyle = "blue";
                //T_setPixel(ctx, x*16, y*16);
                T_plotRectangle(ctx, {
                    x: x*16,
                    y: y*16,
                    w: 16,
                    h: 16,
                    shouldFill: true,
                    color: 'blue'
                });
            }
        }
    }
}
