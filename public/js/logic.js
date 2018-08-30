// Use ES5, no ES6
'use strict';

var mouse_x = 0;
var mouse_y = 0;

var world_height = 502;
var world_width = 502;

window.onresize = function () {
    // console.log("canvas offset:"+canvas.offsetTop+","+canvas.offsetLeft);
};
var canvas_offsetLeft = 0;

var canvas_offsetTop = 0;

window.onload = function() {
    canvas_offsetLeft = canvas.getBoundingClientRect().left;
    canvas_offsetTop  = canvas.getBoundingClientRect().top;
}

/** @type {function(Event)} */
canvas.onclick = function (event) {
    // Get the current mouse position
    // var tempPos = getMousePos(canvas, event);
    mouse_x = event.pageX - canvas_offsetLeft ;
    mouse_y = event.pageY - canvas_offsetTop ;
    /* position of mouse on canvas */
    console.log(mouse_x+','+mouse_y);
    /* grid position of click */
    // console.log(Math.round(mouse_x/16)+','+Math.round(mouse_y/16));
    /* plot grid position for lols */
    T_plotRectangle(ctx, {
        x: Math.floor(mouse_x - (mouse_x % 16)),
        y: Math.floor(mouse_y - (mouse_y % 16)),
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

// TODO: JSDoc everything in Cellular Automata function
// TODO: Create tests for generating each cell type: water, beaches, land, forests, villages, treasure

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
    // var chanceToLive = config2.chanceToLive;
    // var birthLimit = config2.birthLimit;
    // var deathLimit = config2.deathLimit;
    // var steps = config2.steps;
    // var range = config2.range;

    var chanceToLive = 0.52;
    var birthLimit = 34;
    var deathLimit = 22;
    var steps = 2;
    var range = -3;

    /** All groups of solid pixels are placed in here. */
    var islands = [];

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
                // In case the index we're looking at it off the edge of the map
                else if (neighbour_x < 0 || neighbour_y < 0 || neighbour_x >= map[0].length || neighbour_y >= map.length) {
                    // count = count + 1;
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
            map = process(deathLimit /*  + ix */ , birthLimit, range);
        }
        for (var ix = 1; ix--;) {
            map = process(4, 3, -1);
        }
        // Removes any loss specks
        for (var ix = 1; ix--;) {
            map = process(3, 9, -1);
        }

        // Create the beach pixels
        map = createBeaches(map);

        // Create the forest
        map = createForests(map);
    };
    
    var createBeaches = function (map) {
        // Process the map, looking for beach pixels

        var map2 = new Array(height);
        for (var ix = 0; ix < height; ix++) {
            map2[ix] = new Array(width);
            for (var kx = 0; kx < width; kx++) {
                var nCount = countAliveNeighbours(kx, ix, -1);
                if (map[ix][kx]) {
                    // If the pixel has less than 8 neighbours turn it into a beach tile
                    if (nCount < 7) {
                        map2[ix][kx] = 2;
                    } else {
                        map2[ix][kx] = map[ix][kx];
                    }
                }
            }
        }
        return map2;
    };
    var createForests = function (map) {
        var map2 = new Array(height);
        for (var ix = 0; ix < height; ix++) {
            map2[ix] = new Array(width);
            for (var kx = 0; kx < width; kx++) {
                var nCount = countAliveNeighbours(kx, ix, -1);
                if (map[ix][kx] && map[ix][kx]) {
                    // If the pixel has less than 8 neighbours turn it into a beach tile
                    if (nCount === 8) {
                        map2[ix][kx] = Math.round(rnd()) ? 3 : map[ix][kx];
                    } else {
                        map2[ix][kx] = map[ix][kx];
                    }
                }
            }
        }

        return map2;
    };

    var findIslands = function (map, islands) {
        // All solid pixels go here
        /** @type {[{checked: boolean}[]]} */
        var solid = [];
        var indices = [];

        // Fill the solid[]
        for (var ix = height; ix--;) {
            solid[ix] = [];
            for (var kx = width; kx--;) {
                if (map[ix][kx]) {
                    solid[ix][kx] = {
                        checked: false
                    };
                    indices.push({
                        x: kx,
                        y: ix
                    });
                }
            }
        }

        // Now find the filled in areas
        var getFilledArea = function () {


            do {
                /** @type {{x: number, y: number}[]} */
                var island = [indices.splice(0, 1)[0]];
                for (var ix = 0; ix < island.length; ix++) {
                    if (solid[island[ix].y + 1] && solid[island[ix].y + 1][island[ix].x] && !solid[island[ix].y + 1][island[ix].x].checked) {
                        island.push({
                            x: island[ix].x,
                            y: island[ix].y + 1
                        });
                        solid[island[ix].y + 1][island[ix].x].checked = true;
                    }
                    if (solid[island[ix].y - 1] && solid[island[ix].y - 1][island[ix].x] && !solid[island[ix].y - 1][island[ix].x].checked) {
                        island.push({
                            x: island[ix].x,
                            y: island[ix].y - 1
                        });
                        solid[island[ix].y - 1][island[ix].x].checked = true;
                    }
                    if (solid[island[ix].y] && solid[island[ix].y][island[ix].x + 1] && !solid[island[ix].y][island[ix].x + 1].checked) {
                        island.push({
                            x: island[ix].x + 1,
                            y: island[ix].y
                        });
                        solid[island[ix].y][island[ix].x + 1].checked = true;
                    }
                    if (solid[island[ix].y] && solid[island[ix].y][island[ix].x - 1] && !solid[island[ix].y][island[ix].x - 1].checked) {
                        island.push({
                            x: island[ix].x - 1,
                            y: island[ix].y
                        });
                        solid[island[ix].y][island[ix].x - 1].checked = true;
                    }
                }
                islands.push(island);

                // Find the island's children in the indices array and remove them
                for (var ix = island.length; ix--;) {
                    for (var kx = indices.length; kx--;) {
                        if (island[ix].x === indices[kx].x && island[ix].y === indices[kx].y) {
                            indices.splice(kx, 1);
                            break;
                        }
                    }
                }
            } while (indices.length)
        };

        getFilledArea();
    };

    /**
     * Adds villages and treasure to an island
     * @param {[[number]]} map The world grid
     * @param {[[{x: number, y: number}]]} islands An array of all the islands in game
     * @param {number} min The minimum number of tiles for there to be a village
     * @param {number} medium The minimum number of tiles for there to be two villages on an island
     * @param {number} upper The minimum number of tiles for there to be three villages on an island
     */
    var addVillages = function (map, islands, min, medium, upper, chanceForTreasure) {
        // Add a village on each island
        // Looping through the different islands
        // ctx.fillStyle = 'red';
        for (var ix = islands.length; ix--;) {
            var length = islands[ix].length;
            // Get a random position in the island
            var island = {};
            // var tile = 0;

            if (length <= min) {
                if (rnd() < chanceForTreasure) {
                    island = islands[ix][math_randomInt(0, length - 1)];
                    map[island.y][island.x] = 4;
                }
            } else if (length <= medium) {
                // We add 1 village
                island = islands[ix][math_randomInt(0, length - 1)];
                map[island.y][island.x] = 5;
            } else if (length <= upper) {
                // We add 2 village
                island = islands[ix][math_randomInt(0, length - 1)];
                map[island.y][island.x] = 5;
                island = islands[ix][math_randomInt(0, length - 1)];
                map[island.y][island.x] = 5;
            } else {
                // We add 3 village
                island = islands[ix][math_randomInt(0, length - 1)];
                map[island.y][island.x] = 5;
                island = islands[ix][math_randomInt(0, length - 1)];
                map[island.y][island.x] = 5;
                island = islands[ix][math_randomInt(0, length - 1)];
                map[island.y][island.x] = 5;
            }
            // T_setPixel(ctx, island.x, island.y);
        }
    }
    generateMap();
    findIslands(map, islands);
    addVillages(map, islands, 10, 17, 25, 0.07);
    // renderMap(map);
    // renderBeach(map);

    return map;
}

var renderMap = function (map) {
    var width = map.length, height = map[0].length;    
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, width, height);

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

    // Draw the beach blocks
    ctx.fillStyle = "darkGreen";
    for (var ix = 0; ix < height; ix++) {
        for (var kx = 0; kx < width; kx++) {
            if (map[ix][kx] === 3) {
                T_setPixel(ctx, kx, ix);
            }
        }
    }
    
    // Draw the treasure blocks
    ctx.fillStyle = "black";
    for (var ix = 0; ix < height; ix++) {
        for (var kx = 0; kx < width; kx++) {
            if (map[ix][kx] === 4) {
                T_setPixel(ctx, kx, ix);
            }
        }
    }
    
    // Draw the village blocks
    ctx.fillStyle = "red";
    for (var ix = 0; ix < height; ix++) {
        for (var kx = 0; kx < width; kx++) {
            if (map[ix][kx] === 5) {
                T_setPixel(ctx, kx, ix);
            }
        }
    }
};

/*
    renders map around the player
*/
// var camera_pos_x, camera_pos_y;
// var render_pos_x, render_pos_y;

// function renderMap() {
//     /*
//     //change camera pos if player moved
//     //need to also handle top and right boundary
//     camera_pos_x = player_x > 15 ? player_x-16 : 16;
//     camera_pos_y = player_y > 15 ? player_y-16 : 16;
//     */
//     camera_pos_x = 50;
//     camera_pos_y = 50;

//     //player_x-15
//     //player_y-15
//     console.log("drawing tiles in range");
//     console.log("X:"+(camera_pos_x-16)+" to "+ (camera_pos_x+16));
//     console.log("Y:"+(camera_pos_y-16)+" to "+ (camera_pos_y+16));
//     for (var y=0, render_pos_x = camera_pos_x-16; render_pos_x < camera_pos_x+16; render_pos_x++, y++) {
//         for (var x=0, render_pos_y = camera_pos_y-16; render_pos_y < camera_pos_y+16; render_pos_y++, x++) {
            
//             if (world[render_pos_y][render_pos_x]) {
//                 //ctx.fillStyle = "black";
//                 //T_setPixel(ctx, x*16, y*16);
//                 /*T_plotRectangle(ctx, {
//                     x: x*16,
//                     y: y*16,
//                     w: 8,
//                     h: 8,
//                     shouldFill: true,
//                     color: 'black'
//                 });*/
//             } else {
//                 //ctx.fillStyle = "blue";
//                 //T_setPixel(ctx, x*16, y*16);
//                 T_plotRectangle(ctx, {
//                     x: x*16,
//                     y: y*16,
//                     w: 16,
//                     h: 16,
//                     shouldFill: true,
//                     color: 'blue'
//                 });
//             }
//         }
//     }
// }

