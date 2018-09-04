// Use ES5, no ES6
'use strict';

window.onresize = function () {
    // console.log("canvas offset:"+canvas.offsetTop+","+canvas.offsetLeft);
};

/** @type {function(Event)} */
canvas.onclick = function (event) {
    // Get the current mouse position
    player_track = getTargetPos(canvas, event);
    /* position of mouse on canvas */
    //console.log(player_track);
    
    /* grid position of click */
    // console.log(Math.round(mouse_x/16)+','+Math.round(mouse_y/16));
    /* plot grid position for lols */
    T_plotRectangle(ctx, {
        x: Math.floor(player_track.x - (player_track.x % 16)),
        y: Math.floor(player_track.y - (player_track.y % 16)),
        w: 16,
        h: 16,
        color: 'red'
    });
    player_x += player_track.y;
    player_y += player_track.x;
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
    world_render(dt);
    player_render(dt);
    
}

/**
 * Cellular automata for Terrain Generation
 * @param width desired width in tiles
 * @param height desired height in tiles
 * 
 * @returns {[number[]]} a two Dimensional Array containing a generated world
 * */

function cellularAutomata(width, height) {
    // Setup variables
    // var chanceToLive = config2.chanceToLive;
    // var birthLimit = config2.birthLimit;
    // var deathLimit = config2.deathLimit;
    // var steps = config2.steps;
    // var range = config2.range;

    var config = {
        chanceToLive: 0.52,
        birthLimit: 34,
        deathLimit: 22,
        steps: 2,
        range: -3
    };

    // All groups of solid pixels are placed in here.
    islands = [];

    var map = new Array(height);
    // Fill the map
    for (var ix = 0; ix < height; ix++) {
        map[ix] = new Array(width);
        for (var kx = 0; kx < width; kx++) {
            // It set's the tile to true if it has a chance to live
            map[ix][kx] = rnd() > config.chanceToLive ? 1 : 0;
            // map
        }
    }


    // Start processing array

    /**
     * Counts the number of alive neighbours around a certain point by a certain range
     * 
     * @param {number} x The x position of the tile in the grid
     * @param {number} y The y position of the tile in the grid
     * @param {number} range The range that we can check for neighbours. Must be a number less than 0
     * 
     * @returns {number}
     */
    var countAliveNeighbours = function (x, y, range) {
        // We store the total number of neighbours in count var
        var count = 0;
        // Number of iteration using the none positive range
        var length = range * -1 + 1;

        // Loop through the world grid
        for (var ix = range; ix < length; ix++) {
            for (var kx = range; kx < length; kx++) {
                // Get the neighbour positions
                var neighbour_x = x + kx;
                var neighbour_y = y + ix;

                // Make sure we don't target the tile whose neighbours we are counting
                if (ix == 0 && kx == 0) {
                    //Do nothing, we don't want to add ourselves in!
                    continue;
                }
                // In case the neighbour is off the edge of the map, we count it
                else if (neighbour_x < 0 || neighbour_y < 0 || neighbour_x >= map[0].length || neighbour_y >= map.length) {
                    // count = count + 1;
                }
                // Otherwise, a normal check of the neighbour
                else if (map[neighbour_y] && map[neighbour_y][neighbour_x]) {
                    count = count + 1;
                }
            }
        }
        // Return the number of neighbours
        return count;
    };

    /**
     * Run Conway's game of life
     * @param {number} deathLimit The number of neighbours a cell should have to not be killed
     * @param {number} birthLimit The number of neighbours a cell should have to be made alive
     * @param {number} range A non-positive number that is used by countAliveNeighbours function
     * 
     * @returns {[number[]]}
     */
    var process = function (deathLimit, birthLimit, range) {
        // We make a clean copy of the map with the same dimensions
        var map2 = new Array(height);
        for (var ix = 0; ix < height; ix++) {
            map2[ix] = new Array(width);
            for (var kx = 0; kx < width; kx++) {
                // We count the neighbours
                var nCount = countAliveNeighbours(kx, ix, range);

                // If the map is an alive cell
                if (map[ix][kx]) {
                    // If the cell has too few neighbours to be solid then make it non-solid, otherwise make it solid
                    if (nCount < deathLimit) {
                        map2[ix][kx] = 0;
                    } else {
                        map2[ix][kx] = 1;
                    }
                }
                // Otherwise, we check if the cell can be made alive
                else {
                    // If the cell has enough neighbours around it, make it alive. Otherwise, made it none solid
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

    /**
     * This creates a cellular automata map (i.e. 2D array sorted into rows of values along the x, which is a [y][x] position arrangement)
     * 
     * @returns {[number[]]}
     */
    var generateMap = function () {
        // First run the first process, it has the default config setup 
        for (var ix = config.steps; ix--;) {
            map = process(config.deathLimit, config.birthLimit, config.range);
        }

        // Now run a simple process checking the neighbours that are within a 1 cell radius
        for (var ix = 1; ix--;) {
            map = process(4, 3, -1);
        }
        // Same as above, only difference is that it removes neighbourless cells
        for (var ix = 1; ix--;) {
            map = process(3, 9, -1);
        }

        // Create the beach pixels
        map = createBeaches(map);

        // Create the forest
        map = createForests(map);
    };

    /**
     * Creates a beach outline around the islands of the world
     * @param {[number[]]} map The world grid
     */
    var createBeaches = function (map) {
        // Again, create a fresh grid with same dimensions as map
        var map2 = new Array(height);
        for (var ix = 0; ix < height; ix++) {
            map2[ix] = new Array(width);
            for (var kx = 0; kx < width; kx++) {
                // Count neighbours
                var nCount = countAliveNeighbours(kx, ix, -1);

                // Check if the grid position is a live one
                if (map[ix][kx]) {
                    // If the pixel has less than 7 neighbours turn it into a beach tile
                    if (nCount < 7) {
                        // Beach tiles will use the number 2 on the grid
                        map2[ix][kx] = 2;
                    }
                    // Otherwise, set it to what it was originally
                    else {
                        map2[ix][kx] = map[ix][kx];
                    }
                }
            }
        }

        // Return the new map/grid
        return map2;
    };

    /**
     * Returns a world grid with forests randomly placed in
     * @param {[number[]]} map The world grid
     * 
     * @returns {[number[]]}
     */
    var createForests = function (map) {
        // Create a fresh grid
        var map2 = new Array(height);
        for (var ix = 0; ix < height; ix++) {
            map2[ix] = new Array(width);
            for (var kx = 0; kx < width; kx++) {
                // Count neighbours
                var nCount = countAliveNeighbours(kx, ix, -1);
                if (map[ix][kx]) {
                    // If the cell has exactly 8 neighbours it has a 50/50 chance of being a forest. Otherwise, it stays the same
                    if (nCount === 8) {
                        map2[ix][kx] = Math.round(rnd()) ? 3 : map[ix][kx];
                    }
                    // Otherwise, leave the cell as is
                    else {
                        map2[ix][kx] = map[ix][kx];
                    }
                }
            }
        }

        // Return map/grid
        return map2;
    };

    /**
     * Finds the islands on the map
     * @param {[number[]]} map The world map/grid
     * @param {[{x: number, y: number}[]]} islands An array to fill with arrays of islands that are in the map.
     */
    var findIslands = function (map, islands) {
        // All solid pixels go here
        /** @type {[{checked: boolean}[]]} */
        var solid = [];
        /** @type {[{x: number, y: number}[]]} */
        var indices = [];

        // Fill the solid[]
        for (var ix = height; ix--;) {
            solid[ix] = [];
            for (var kx = width; kx--;) {
                // If the position in the map is solid,...
                if (map[ix][kx]) {
                    // ...then fill the index with a two dimensional sparse array that points to an object with a boolean prop as it's only child.
                    solid[ix][kx] = {
                        // Change this flag to true when the point has been added to an island
                        checked: false
                    };
                    // Push to the indices array as well so that we have these points in an easy to use place
                    indices.push({
                        x: kx,
                        y: ix
                    });
                }
            }
        }

        /**
         * Runs a loop that finds the neighbours of points, adds the to an island array, and then removes all the points from the indices array until there is nothing in the indices array
         */
        var getFilledArea = function () {
            do {
                /** @type {{x: number, y: number}[]} */
                var island = [indices.splice(0, 1)[0]];
                // Collect all the neighbours and push them into the island array
                for (var ix = 0; ix < island.length; ix++) {
                    // All following if statments check if the solid[y] and solid[y][x] positions exist, and if the solid tile has not been checked
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
                // If the island array has children
                if (island.length) {
                    // Push into the islands array
                    islands.push(island);
                }

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

        // Now we run the function
        getFilledArea();
    };

    /**
     * Adds villages and treasure to an island
     * @param {[[number]]} map The world grid
     * @param {[[{x: number, y: number}]]} islands An array of all the islands in game
     * @param {number} min The minimum number of tiles for there to be a village
     * @param {number} medium The minimum number of tiles for there to be two villages on an island
     * @param {number} upper The minimum number of tiles for there to be three villages on an island
     * @param {number} chanceForTreasure A number between 0 and 1 determines the chance of treasure being placed on a cell
     * 
     * @returns {[number[]]}
     */
    var addVillages = function (map, islands, min, medium, upper, chanceForTreasure) {
        // Add a village on each island
        // Looping through the different islands
        for (var ix = islands.length; ix--;) {
            // Get the total number of cells for the currently selected island
            var length = islands[ix].length;
            // This will reference some island in the islands array
            var island = {};

            // Now we make sure that if the length less than some threshold, we spawn the appropriate number of village.
            // If it's less than the min we place a treasure there.
            if (length <= min) {
                // Place the treasure
                if (rnd() < chanceForTreasure) {
                    // Get a random cell to place treasure on
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
        }
    };

    // We generate the map/grid with beach and forest pixels placed
    generateMap();
    // Find all it's islands
    findIslands(map, islands);
    // Add all the villages and treasure
    addVillages(map, islands, 10, 17, 25, 0.07);
    // renderMap(map);
    // renderBeach(map);

    // return the final map
    return map;
}
