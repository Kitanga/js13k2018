// Use ES5, no ES6
'use strict';


// Bresenham functions
function Thoran_setPixel(ctx, x, y) {
    ctx.fillRect(x, y, 1, 1);
}

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

function Thoran_plotCircle(ctx, options) {
    var options = options || {};
    var width = ctx.canvas.width - 1;
    var height = ctx.canvas.height - 1;
    var rad = options.radius || Math.floor(width / 2);
    var xm = options.x || Math.floor(width / 2);
    var ym = options.y || Math.floor(height / 2);

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


        // Fill the circle
        if (options.shouldFill) {
            switch (options.quadrant) {
                case 1:
                    Thoran_plotLine(ctx, xm - x, ym + y, width - Math.round(width / 2), ym + y);
                    break;
                case 2:
                    Thoran_plotLine(ctx, xm - y, ym - x, width - Math.round(width / 2), ym - x);
                    console.log('fill', xm - y, ym - x, width - (xm - y), ym - x);
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

function Thoran_plotRectangle(ctx, options) {
    var options = options || {};
    var width = (options.w || ctx.canvas.width || 1) - 1;
    var height = (options.h || ctx.canvas.height || 1) - 1;
    var x = options.x || 0;
    var y = options.y || 0;

    Thoran_plotLine(ctx, x, y, width, 0);
    Thoran_plotLine(ctx, x, y, 0, height);
    Thoran_plotLine(ctx, width, 0, width, height);
    Thoran_plotLine(ctx, 0, height, width, height);

    if (options.shouldFill) {
        for (var ix = height; --ix;) {
            Thoran_plotLine(ctx, 0, ix, width, ix);
        }
    }
}

// x0, y0, w, h, radius, color, shouldFill
function Thoran_plotRoundedRect(ctx, options) {
    var options = options || {};
    var width = (!!options.w || ctx.canvas.width || 1) - 1;
    var height = (!!options.h || ctx.canvas.height || 1) - 1;
    var x = options.x || 0;
    var y = options.y || 0;
    var rad = options.radius || 7;

    // Draw 4 lines, and four circles
    Thoran_plotLine(ctx, x + rad, y, width - rad, 0); /* Top */
    Thoran_plotLine(ctx, x, y + rad, 0, height - rad); /* Left */
    Thoran_plotLine(ctx, width, 0 + rad, width, height - rad); /* Right */
    Thoran_plotLine(ctx, 0 + rad, height, width - rad, height); /* Down */

    Thoran_plotCircle(ctx, {
        x: rad,
        y: rad,
        radius: rad,
        quadrant: 3
    }); /* Top Left */
    Thoran_plotCircle(ctx, {
        x: width - rad,
        y: rad,
        radius: rad,
        quadrant: 4
    }); /* Top Right */
    Thoran_plotCircle(ctx, {
        x: width - rad,
        y: height - rad,
        radius: rad,
        quadrant: 1
    }); /* Bottom Right */
    Thoran_plotCircle(ctx, {
        x: rad,
        y: height - rad,
        radius: rad,
        quadrant: 2
    }); /* Bottom Left */
}

var test_canvas = util_createCanvas(500, 500, function (ctx) {
    // Draw a line
    // Thoran_plotLine(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw an unfilled circle
    // Thoran_plotCircle(ctx);

    // Draw a filled circle
    // Thoran_plotCircle(ctx, {
    //     shouldFill: true,
    //     quadrant: 't'
    // });

    // Draw a rectangle
    // Thoran_plotRectangle(ctx);

    // Draw a rounded rectangle
    Thoran_plotRoundedRect(ctx, {
        radius: 170,
        shouldFill: true
    });
});

game.appendChild(test_canvas);
// console.log(game);