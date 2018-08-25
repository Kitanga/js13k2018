// Use ES5, no ES6
'use strict';

// Bresenham functions
/**
 * An algorithm that creates a pixel on screen
 * 
 * @param {CanvasRenderingContext2D} ctx The canvas context to draw to
 * @param {number=} x The x position on canvas
 * @param {number=} y The y position on canvas
 */
function Thoran_setPixel(ctx, x, y) {
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
function Thoran_plotLine(ctx, x0, y0, x1, y1, color) {
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
        Thoran_setPixel(ctx, x0, y0);
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
function Thoran_plotCircle(ctx, options) {
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
                Thoran_setPixel(ctx, xm - x, ym + y); /*   I. Quadrant Bottom Right */
                break;
            case 2:
                Thoran_setPixel(ctx, xm - y, ym - x); /*  II. Quadrant Bottom Left */
                break;
            case 3:
                Thoran_setPixel(ctx, xm + x, ym - y); /* III. Quadrant Top Left */
                break;
            case 4:
                Thoran_setPixel(ctx, xm + y, ym + x); /*  IV. Quadrant Top Right */
                break;

            case 't': // Top Half
                Thoran_setPixel(ctx, xm + x, ym - y); /* III. Quadrant Top Left */
                Thoran_setPixel(ctx, xm + y, ym + x); /*  IV. Quadrant Top Right */
                break;

            case 'b': // Bottom Half
                Thoran_setPixel(ctx, xm - x, ym + y); /*   I. Quadrant Bottom Right */
                Thoran_setPixel(ctx, xm - y, ym - x); /*  II. Quadrant Bottom Left */
                break;

            case 'l': // Left half
                Thoran_setPixel(ctx, xm + x, ym - y); /* III. Quadrant Top Left */
                Thoran_setPixel(ctx, xm - y, ym - x); /*  II. Quadrant Bottom Left */
                break;

            case 'r': // Right Half
                Thoran_setPixel(ctx, xm + y, ym + x); /*  IV. Quadrant Top Right */
                Thoran_setPixel(ctx, xm - x, ym + y); /*   I. Quadrant Bottom Right */
                break;
            default:
                Thoran_setPixel(ctx, xm - x, ym + y); /*   I. Quadrant Bottom Right */
                Thoran_setPixel(ctx, xm - y, ym - x); /*  II. Quadrant Bottom Left */
                Thoran_setPixel(ctx, xm + x, ym - y); /* III. Quadrant Top Left */
                Thoran_setPixel(ctx, xm + y, ym + x); /*  IV. Quadrant Top Right */
                break;
        }

        // if (options.outline) {
        //     // 
        //     ctx.fillStyle = 'yellow';
        //     // Thoran_setPixel(ctx, xm - x + 1, ym + y);
        //     // Thoran_setPixel(ctx, xm - x, ym + y + 1);

        //     ctx.fillStyle = 'cyan';
        //     // Thoran_setPixel(ctx, xm - y - 1, ym - x);
        //     // Thoran_setPixel(ctx, xm - y, ym - x + 1);

        //     ctx.fillStyle = 'gray';
        //     // Thoran_setPixel(ctx, xm + x - 1, ym - y);
        //     // Thoran_setPixel(ctx, xm + x, ym - y - 1);

        //     ctx.fillStyle = 'red';
        //     // Thoran_setPixel(ctx, xm + y + 1, ym + x);
        //     // Thoran_setPixel(ctx, xm + y, ym + x - 1);
        //     ctx.fillStyle = options.color || 'black';
        // }


        // Fill the circle
        if (options.shouldFill) {
            switch (options.quadrant) {
                case 1:
                    Thoran_plotLine(ctx, xm - x, ym + y, width - Math.round(width / 2), ym + y);
                    break;
                case 2:
                    Thoran_plotLine(ctx, xm - y, ym - x, width - Math.round(width / 2), ym - x);
                    // console.log('fill', xm - y, ym - x, width - (xm - y), ym - x);
                    break;
                case 3:
                    Thoran_plotLine(ctx, xm + x, ym - y, width - Math.round(width / 2), ym - y);
                    break;
                case 4:
                    Thoran_plotLine(ctx, xm + y, ym + x, width - Math.round(width / 2), ym + x);
                    break;

                case 't': // Top Half
                    Thoran_plotLine(ctx, xm + x, ym - y, width - Math.round(width / 2), ym - y);
                    Thoran_plotLine(ctx, xm + y, ym + x, width - Math.round(width / 2), ym + x);
                    break;

                case 'b': // Bottom Half
                    Thoran_plotLine(ctx, xm - x, ym + y, width - Math.round(width / 2), ym + y);
                    Thoran_plotLine(ctx, xm - y, ym - x, width - Math.round(width / 2), ym - x);
                    break;

                case 'l': // Left half
                    Thoran_plotLine(ctx, xm + x, ym - y, width - Math.round(width / 2), ym - y);
                    Thoran_plotLine(ctx, xm - y, ym - x, width - Math.round(width / 2), ym - x);
                    break;

                case 'r': // Right Half
                    Thoran_plotLine(ctx, xm + y, ym + x, width - Math.round(width / 2), ym + x);
                    Thoran_plotLine(ctx, xm - x, ym + y, width - Math.round(width / 2), ym + y);
                    break;
                default:
                    Thoran_plotLine(ctx, xm - x, ym + y, width - Math.round(width / 2), ym + y);
                    Thoran_plotLine(ctx, xm - y, ym - x, width - Math.round(width / 2), ym - x);
                    Thoran_plotLine(ctx, xm + x, ym - y, width - Math.round(width / 2), ym - y);
                    Thoran_plotLine(ctx, xm + y, ym + x, width - Math.round(width / 2), ym + x);
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
function Thoran_plotRectangle(ctx, options) {

    var options = options || {};

    var width = Math.floor(typeof options.w === 'undefined' ? ctx.canvas.width - 1 : options.w);
    var height = Math.floor(typeof options.h === 'undefined' ? ctx.canvas.height - 1 : options.h);
    var x = typeof options.x === 'undefined' ? 0 : options.x;
    var y = typeof options.y === 'undefined' ? 0 : options.y;

    // console.log(arguments);

    ctx.fillStyle = options.color || 'black';

    Thoran_plotLine(ctx, x, y, width, y);
    // ctx.fillStyle = 'yello';
    Thoran_plotLine(ctx, width, y, width, height);
    // ctx.fillStyle = 'blue';
    Thoran_plotLine(ctx, width, height, x, height);
    // ctx.fillStyle = 'cyan';
    Thoran_plotLine(ctx, x, height, x, y);
    // Thoran_plotLine(ctx, x, y, 0, height);
    // Thoran_plotLine(ctx, width, 0, width, height);
    // Thoran_plotLine(ctx, 0, height, width, height);

    if (options.shouldFill) {
        for (var ix = height; --ix;) {
            Thoran_plotLine(ctx, x, y + ix, width, y + ix);
        }
    }
}

/**
 * Creates a rectangle with rounded corners
 * 
 * @param {CanvasRenderingContext2D} ctx The canvas context to draw to
 * @param {{x: number, y: number, w: number, h: number, shouldFill: boolean, color: string, borderRadius: number}} [options] config object for drawing Rectangle
 */
function Thoran_plotRoundedRect(ctx, options) {
    var options = options || {};

    var width = Math.floor(typeof options.w === 'undefined' ? ctx.canvas.width - 1 : options.w);
    var height = Math.floor(typeof options.h === 'undefined' ? ctx.canvas.height - 1 : options.h);
    var x = typeof options.x === 'undefined' ? 0 : options.x;
    var y = typeof options.y === 'undefined' ? 0 : options.y;
    var rad = typeof options.borderRadius === 'undefined' ? 7 : options.borderRadius;

    if (!options.shouldFill) {
        // Draw 4 lines
        Thoran_plotLine(ctx, x + rad, y, width - rad, 0); /* Top */
        Thoran_plotLine(ctx, x, y + rad, 0, height - rad); /* Left */
        Thoran_plotLine(ctx, width, 0 + rad, width, height - rad); /* Right */
        Thoran_plotLine(ctx, 0 + rad, height, width - rad, height); /* Down */
    } else {
        // Draw 2 Rectangles
        Thoran_plotRectangle(ctx, {
            x: x + rad,
            y: y,
            w: width - rad + 1,
            h: height + 1,
            shouldFill: true,
            // color: 'yellow'
        });

        Thoran_plotRectangle(ctx, {
            x: x,
            y: y + rad,
            w: width + 1,
            h: height - rad - (y + rad) + 2,
            shouldFill: true,
            // color: 'cyan'
        });
    }

    // Draw 4 circles
    Thoran_plotCircle(ctx, {
        x: rad,
        y: rad,
        radius: rad,
        quadrant: 3,
        shouldFill: options.shouldFill
    }); /* Top Left */
    Thoran_plotCircle(ctx, {
        x: width - rad,
        y: rad,
        radius: rad,
        quadrant: 4,
        shouldFill: options.shouldFill
    }); /* Top Right */
    Thoran_plotCircle(ctx, {
        x: width - rad,
        y: height - rad,
        radius: rad,
        quadrant: 1,
        shouldFill: options.shouldFill
    }); /* Bottom Right */
    Thoran_plotCircle(ctx, {
        x: rad,
        y: height - rad,
        radius: rad,
        quadrant: 2,
        shouldFill: options.shouldFill
    }); /* Bottom Left */
}

//#region Test canvas
// var test_canvas = util_createCanvas(500, 500, function (ctx) {
// Draw a line
// Thoran_plotLine(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height);

// Draw an unfilled circle
// Thoran_plotCircle(ctx, {
//     radius: 70,
//     shouldFill: true,
//     color: 'blue'
// });

// Draw a filled circle
// Thoran_plotCircle(ctx, {
//     shouldFill: true,
//     quadrant: 't'
// });

// Draw a rectangle
// Thoran_plotRectangle(ctx, {
//     // shouldFill: true
// });

// Draw a rounded rectangle
// Thoran_plotRoundedRect(ctx, {
//     borderRadius: 170,
//     // shouldFill: true
// });
// });
//#endregion

// Canvas related stuffs

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var canvas = util_createCanvas(WIDTH, HEIGHT);
var ctx = canvas.getContext('2d');

// Add to DOM
var container = util_getEle('#game');
container.appendChild(canvas);