// Use ES5, no ES6
'use strict';

canvas = util_createCanvas(WIDTH, HEIGHT);
ctx = canvas.getContext('2d');

// Add to DOM
container = util_getEle('#game');
container.appendChild(canvas);


// Bresenham functions
/**
 * An algorithm that creates a pixel on screen
 * 
 * @param {CanvasRenderingContext2D} ctx The canvas context to draw to
 * @param {number=} x The x position on canvas
 * @param {number=} y The y position on canvas
 */
function T_setPixel(ctx, x, y) {
    ctx.fillRect(x, y, 1, 1);
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx The canvas context to draw to
 * @param {number=} x0 First point's x value
 * @param {number=} y0 First point's y value
 * @param {number=} x1 Second point's x value
 * @param {number=} y1 Second point's y value
 * @param {string=} color The color as a css color string
 */
function T_plotLine(ctx, x0, y0, x1, y1, color) {
    var dx = Math.abs(x1 - x0),
        sx = x0 < x1 ? 1 : -1;
    var dy = -Math.abs(y1 - y0),
        sy = y0 < y1 ? 1 : -1;
    var err = dx + dy,
        e2; /* error value e_xy */

    if (!!color) {
        ctx.fillStyle = color;
    }

    /* loop */
    for (;;) {
        T_setPixel(ctx, x0, y0);
        if (x0 == x1 && y0 == y1) break;
        e2 = 2 * err;

        /* e_xy+e_x > 0 */
        if (e2 >= dy) {
            err += dy;
            x0 += sx;
        }

        /* e_xy+e_y < 0 */
        if (e2 <= dx) {
            err += dx;
            y0 += sy;
        }
    }
}

/**
 * Draws an object on a canvas
 * 
 * @param {CanvasRenderingContext2D} ctx The canvas context to draw to
 * @param {{x: number, y: number, radius: number, w: number, h: number, quadrant: number, shouldFill: bool, color: string}} [options] config object for drawing circle
 */
function T_plotCircle(ctx, options) {
    var options = options || {};

    var width = Math.floor((typeof options.w === 'undefined' ? (ctx.canvas.width - 1) : options.w));
    var height = Math.floor((typeof options.h === 'undefined' ? (ctx.canvas.height - 1) : options.h));
    var rad = typeof options.radius === 'undefined' ? Math.floor(width / 2) : options.radius;
    var xm = typeof options.x === 'undefined' ? Math.floor(width / 2) : options.x;
    var ym = typeof options.y === 'undefined' ? Math.floor(height / 2) : options.y;

    /* II. Quadrant */
    var x = -rad,
        y = 0,
        err = 2 - 2 * rad;

    ctx.fillStyle = options.color || 'black';

    do {
        switch (options.quadrant) {
            case 1:
                T_setPixel(ctx, xm - x, ym + y); /*   I. Quadrant Bottom Right */
                break;
            case 2:
                T_setPixel(ctx, xm - y, ym - x); /*  II. Quadrant Bottom Left */
                break;
            case 3:
                T_setPixel(ctx, xm + x, ym - y); /* III. Quadrant Top Left */
                break;
            case 4:
                T_setPixel(ctx, xm + y, ym + x); /*  IV. Quadrant Top Right */
                break;

            case 't': // Top Half
                T_setPixel(ctx, xm + x, ym - y); /* III. Quadrant Top Left */
                T_setPixel(ctx, xm + y, ym + x); /*  IV. Quadrant Top Right */
                break;

            case 'b': // Bottom Half
                T_setPixel(ctx, xm - x, ym + y); /*   I. Quadrant Bottom Right */
                T_setPixel(ctx, xm - y, ym - x); /*  II. Quadrant Bottom Left */
                break;

            case 'l': // Left half
                T_setPixel(ctx, xm + x, ym - y); /* III. Quadrant Top Left */
                T_setPixel(ctx, xm - y, ym - x); /*  II. Quadrant Bottom Left */
                break;

            case 'r': // Right Half
                T_setPixel(ctx, xm + y, ym + x); /*  IV. Quadrant Top Right */
                T_setPixel(ctx, xm - x, ym + y); /*   I. Quadrant Bottom Right */
                break;
            default:
                T_setPixel(ctx, xm - x, ym + y); /*   I. Quadrant Bottom Right */
                T_setPixel(ctx, xm - y, ym - x); /*  II. Quadrant Bottom Left */
                T_setPixel(ctx, xm + x, ym - y); /* III. Quadrant Top Left */
                T_setPixel(ctx, xm + y, ym + x); /*  IV. Quadrant Top Right */
                break;
        }

        // if (options.outline) {
        //     // 
        //     ctx.fillStyle = 'yellow';
        //     // T_setPixel(ctx, xm - x + 1, ym + y);
        //     // T_setPixel(ctx, xm - x, ym + y + 1);

        //     ctx.fillStyle = 'cyan';
        //     // T_setPixel(ctx, xm - y - 1, ym - x);
        //     // T_setPixel(ctx, xm - y, ym - x + 1);

        //     ctx.fillStyle = 'gray';
        //     // T_setPixel(ctx, xm + x - 1, ym - y);
        //     // T_setPixel(ctx, xm + x, ym - y - 1);

        //     ctx.fillStyle = 'red';
        //     // T_setPixel(ctx, xm + y + 1, ym + x);
        //     // T_setPixel(ctx, xm + y, ym + x - 1);
        //     ctx.fillStyle = options.color || 'black';
        // }


        // Fill the circle
        if (options.shouldFill) {
            switch (options.quadrant) {
                case 1:
                    T_plotLine(ctx, xm - x, ym + y, width - Math.round(width / 2), ym + y);
                    break;
                case 2:
                    T_plotLine(ctx, xm - y, ym - x, width - Math.round(width / 2), ym - x);
                    // console.log('fill', xm - y, ym - x, width - (xm - y), ym - x);
                    break;
                case 3:
                    T_plotLine(ctx, xm + x, ym - y, width - Math.round(width / 2), ym - y);
                    break;
                case 4:
                    T_plotLine(ctx, xm + y, ym + x, width - Math.round(width / 2), ym + x);
                    break;

                case 't': // Top Half
                    T_plotLine(ctx, xm + x, ym - y, width - Math.round(width / 2), ym - y);
                    T_plotLine(ctx, xm + y, ym + x, width - Math.round(width / 2), ym + x);
                    break;

                case 'b': // Bottom Half
                    T_plotLine(ctx, xm - x, ym + y, width - Math.round(width / 2), ym + y);
                    T_plotLine(ctx, xm - y, ym - x, width - Math.round(width / 2), ym - x);
                    break;

                case 'l': // Left half
                    T_plotLine(ctx, xm + x, ym - y, width - Math.round(width / 2), ym - y);
                    T_plotLine(ctx, xm - y, ym - x, width - Math.round(width / 2), ym - x);
                    break;

                case 'r': // Right Half
                    T_plotLine(ctx, xm + y, ym + x, width - Math.round(width / 2), ym + x);
                    T_plotLine(ctx, xm - x, ym + y, width - Math.round(width / 2), ym + y);
                    break;
                default:
                    T_plotLine(ctx, xm - x, ym + y, width - Math.round(width / 2), ym + y);
                    T_plotLine(ctx, xm - y, ym - x, width - Math.round(width / 2), ym - x);
                    T_plotLine(ctx, xm + x, ym - y, width - Math.round(width / 2), ym - y);
                    T_plotLine(ctx, xm + y, ym + x, width - Math.round(width / 2), ym + x);
                    break;
            }
        }

        rad = err;
        if (rad <= y) err += ++y * 2 + 1; /* e_xy+e_y < 0 */
        if (rad > x || err > y) err += ++x * 2 + 1; /* e_xy+e_x > 0 or no 2nd y-step */
    }
    while (x < 0);
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx The canvas context to draw to
 * @param {{x: number, y: number, w: number, h: number, shouldFill: boolean, color: string}} [options] config object for drawing Rectangle
 */
function T_plotRectangle(ctx, options) {

    var options = options || {};

    var width = Math.floor(typeof options.w === 'undefined' ? ctx.canvas.width - 1 : options.w);
    var height = Math.floor(typeof options.h === 'undefined' ? ctx.canvas.height - 1 : options.h);
    var x = typeof options.x === 'undefined' ? 0 : options.x;
    var y = typeof options.y === 'undefined' ? 0 : options.y;

    // console.log(arguments);
    T_plotLine(ctx, x, y, x+width, y, options.color);
    T_plotLine(ctx, x+width, y, x+width, y+height, options.color    );
    T_plotLine(ctx, x+width, y+height, x, y+height, options.color);
    T_plotLine(ctx, x, y+height, x, y, options.color);
    // T_plotLine(ctx, x, y, 0, height);
    // T_plotLine(ctx, width, 0, width, height);
    // T_plotLine(ctx, 0, height, width, height);
    ctx.fillStyle = options.color || 'black';
    if (options.shouldFill) {
        for (var ix = height; --ix;) {
            T_plotLine(ctx, x+1, y + ix, x+width-1, y + ix, options.color);
        }
    }
}

/**
 * Creates a rectangle with rounded corners
 * 
 * @param {CanvasRenderingContext2D} ctx The canvas context to draw to
 * @param {{x: number, y: number, w: number, h: number, shouldFill: boolean, color: string, borderRadius: number}} [options] config object for drawing Rectangle
 */
function T_plotRoundedRect(ctx, options) {
    var options = options || {};

    var width = Math.floor(typeof options.w === 'undefined' ? ctx.canvas.width - 1 : options.w);
    var height = Math.floor(typeof options.h === 'undefined' ? ctx.canvas.height - 1 : options.h);
    var x = typeof options.x === 'undefined' ? 0 : options.x;
    var y = typeof options.y === 'undefined' ? 0 : options.y;
    var rad = typeof options.borderRadius === 'undefined' ? 7 : options.borderRadius;

    if (!options.shouldFill) {
        // Draw 4 lines
        T_plotLine(ctx, x + rad, y, width - rad, 0, options.color); /* Top */
        T_plotLine(ctx, x, y + rad, 0, height - rad, options.color); /* Left */
        T_plotLine(ctx, width, 0 + rad, width, height - rad, options.color); /* Right */
        T_plotLine(ctx, 0 + rad, height, width - rad, height, options.color); /* Down */
    } else {
        // Draw 2 Rectangles
        T_plotRectangle(ctx, {
            x: x + rad,
            y: y,
            w: width - rad + 1,
            h: height + 1,
            shouldFill: true,
            color: options.color
        });

        T_plotRectangle(ctx, {
            x: x,
            y: y + rad,
            w: width + 1,
            h: height - rad - (y + rad) + 2,
            shouldFill: true,
            color: options.color
        });
    }

    // Draw 4 circles
    T_plotCircle(ctx, {
        x: rad,
        y: rad,
        radius: rad,
        quadrant: 3,
        shouldFill: options.shouldFill
    }); /* Top Left */
    T_plotCircle(ctx, {
        x: width - rad,
        y: rad,
        radius: rad,
        quadrant: 4,
        shouldFill: options.shouldFill
    }); /* Top Right */
    T_plotCircle(ctx, {
        x: width - rad,
        y: height - rad,
        radius: rad,
        quadrant: 1,
        shouldFill: options.shouldFill
    }); /* Bottom Right */
    T_plotCircle(ctx, {
        x: rad,
        y: height - rad,
        radius: rad,
        quadrant: 2,
        shouldFill: options.shouldFill
    }); /* Bottom Left */
}
/*
    renders map around the player
*/

function world_render(dt) {
    /*
    //change camera pos if player moved
    //need to also handle top and right boundary
    world_camera_pos_x = player_x > 15 ? player_x-16 : 16;
    world_camera_pos_y = player_y > 15 ? player_y-16 : 16;
    */
    //still need to handle out of bounds top and right
    var range = 2;
    world_camera_pos_x = Math.floor(player_x/world_biome_size/world_cell_size > world_cell_size*8 ? player_x/world_biome_size/world_cell_size : world_cell_size*8);
    world_camera_pos_y = Math.floor(player_y/world_biome_size/world_cell_size > world_cell_size*8 ? player_y/world_biome_size/world_cell_size : world_cell_size*8);
    if (world_camera_pos_x>(world_width-8)*world_cell_size){(world_width-8)*world_cell_size;}
    if (world_camera_pos_y>(world_height-8)*world_cell_size){(world_height-8)*world_cell_size;}

    //player_x-15
    //player_y-15
    
    console.log("camera position");
    console.log(":"+(world_camera_pos_x)+","+ (world_camera_pos_y));
    console.log("player Co-Ords");
    console.log(player_x+","+player_y);
    console.log("offsets for biome display");
    console.log(player_x%world_biome_size+","+player_y%world_biome_size);

    for (var y=player_y%world_biome_size-world_biome_size, 
        render_pos_x = world_camera_pos_x-range; 
        render_pos_x < world_camera_pos_x+range; 
        render_pos_x++, y+=world_biome_size) {
        for (var x=player_x%world_biome_size-world_biome_size, 
            render_pos_y = world_camera_pos_y-range; 
            render_pos_y < world_camera_pos_y+range; 
            render_pos_y++, x+=world_biome_size) {
            console.log("rendering World Biome at pos:"+render_pos_x+","+render_pos_y);
            console.log("rendering said tile at canvas pos:"+x+","+y);
            console.log("rendering said tile with size:"+world_biome_size+","+world_biome_size);
            switch (world[render_pos_y][render_pos_x]) {
                case undefined:
                    ctx.drawImage(terrain_sea, x,y, 256, 256);
                    break;
                case 1:
                    ctx.drawImage(terrain_grass, x,y, world_biome_size, world_biome_size);
                    break;                
                case 2:
                    ctx.drawImage(terrain_beach, x,y, world_biome_size, world_biome_size);
                    break;                
                case 3:
                    ctx.drawImage(terrain_forest, x,y, world_biome_size, world_biome_size);
                    break;                    
                case 4:
                    ctx.drawImage(terrain_treasure, x,y, world_biome_size, world_biome_size);
                    break;                
                case 5:
                    ctx.drawImage(terrain_village, x,y, world_biome_size, world_biome_size);
                    break;
            }
        }
    }
    asdfasdgsda
}

function T_buffer_terrain() {
    // var terrains = ["grass","beach","forests","treasure","village"]; might be able to save some bytes by iterating window[terrain_"terraintype"]
    //fillrect

    var i=world_biome_size / world_cell_size+1;
    var j;
    while(i>=0){        
        
        j=world_biome_size / world_cell_size+1;
        while(j>=0){            
            
            //steelblue RGB(70, 130, 180)
            terrain_sea.getContext('2d').fillStyle = "rgb("+math_randomColor(65,125,175,10)+")";
            terrain_sea.getContext('2d').fillRect(
                i*world_cell_size,
                j*world_cell_size,
                world_cell_size,
                world_cell_size);
            //darkseagreen RGB(143, 188, 139)
            terrain_grass.getContext('2d').fillStyle = "rgb("+math_randomColor(133,178,129,20)+")";
            terrain_grass.getContext('2d').fillRect(
                i*world_cell_size,
                j*world_cell_size,
                world_cell_size,
                world_cell_size);
            //lemonchiffon RGB(255, 250, 205)
            terrain_beach.getContext('2d').fillStyle = "rgb("+math_randomColor(245,240,195,20)+")";
            terrain_beach.getContext('2d').fillRect(
                i*world_cell_size,
                j*world_cell_size,
                world_cell_size,
                world_cell_size);
            //forestgreen RGB(34, 139, 34)
            terrain_forest.getContext('2d').fillStyle = "rgb("+math_randomColor(14,119,14,40)+")";
            terrain_forest.getContext('2d').fillRect(
                i*world_cell_size,
                j*world_cell_size,
                world_cell_size,
                world_cell_size);
            //goldenrod RGB(218, 165, 32)
            terrain_treasure.getContext('2d').fillStyle = "rgb("+math_randomColor(217,164,31,2)+")";
            terrain_treasure.getContext('2d').fillRect(
                i*world_cell_size,
                j*world_cell_size,
                world_cell_size,
                world_cell_size);
            //maroon RGB(128, 0, 0)
            terrain_village.getContext('2d').fillStyle = "rgb("+math_randomColor(128,0,0,50)+")";
            terrain_village.getContext('2d').fillRect(
                i*world_cell_size,
                j*world_cell_size,
                world_cell_size,
                world_cell_size);
            j--;    
        }
        i--;
    }
}