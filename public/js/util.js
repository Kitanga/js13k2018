'use strict';
/**
 * Binds functions to events 
 * @param {string} type The type of event
 * @param {function(event)} callback The function that runs when the event fires
 */
doc.on = function (type, callback) {
    this.addEventListener(type, callback);
};

/**
 * Gets an element from the DOM
 * @param {string} selector CSS selector string
 * @returns {HTMLElement}
 */
function util_getEle(selector) {
    return doc.querySelector(selector);
}

/**
 * Creates an HTML element 
 * @param {string} tag HTML tag
 * @param {{property: number | string}} attributes An object of parameters to be passed on to the created element
 * @returns {HTMLElement}
 */
function util_createElement(tag, attributes) {
    var element = doc.createElement(tag);

    for (var ix in attributes) {
        if (attributes.hasOwnProperty(ix)) {
            element[ix] = attributes[ix];
        }
    }

    return element;
}

function getTargetPos(canvas, evt) {
    canvasBound = canvas.getBoundingClientRect();
    //console.log("current player position:"+player_x+","+player_y);
    return {
        x: Math.round((evt.clientX - canvasBound.left)/512*8-3.5),
        y: Math.round((evt.clientY - canvasBound.top)/512*8-3.5)
    };
}

/**
 * Creates a Canvas
 * @param {number} width The width of the canvas
 * @param {number} height The height of the canvas
 * @param {function(CanvasRenderingContext2D)} callback The callback fired upon canvas creation
 * @returns {HTMLCanvasElement}
 */
function util_createCanvas(width, height, callback) {
    var _obj = {};
    _obj.width = width || 0;
    _obj.height = height || 0;

    var canvas = util_createElement('canvas', _obj);
    callback ? callback(canvas.getContext('2d')) : '';

    return canvas;
}

/**
 * Distance
 * @param {number} x1 The x of a vector
 * @param {number} y1 The y of a vector
 * @param {number} x2 The x of a second vector
 * @param {number} y2 The y of a second vector
 * 
 * @returns {number} The distance between the two points
 */
function math_distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

/**
 * Dot Product
 * @param {number} x1 The x of a vector
 * @param {number} y1 The y of a vector
 * @param {number} x2 The x of a second vector
 * @param {number} y2 The y of a second vector
 * 
 * @returns {number} The Dot Product
 */
function math_dot(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
}

/**
 * Cross Product
 * @param {number} x1 The x of a vector
 * @param {number} y1 The y of a vector
 * @param {number} x2 The x of a second vector
 * @param {number} y2 The y of a second vector
 * 
 * @returns {number} The Cross Product
 */
function math_cross(x1, y1, x2, y2) {
    return x1 * y2 - y1 * x2;
}
/**
 * Length of Line
 * @param {number} x The x of a vector
 * @param {number} y The y of a second vector
 * 
 * @returns {number} The Length of passed line
 */
function math_line_length(x, y) {
    return Math.sqrt(x * x + y * y);
}

function math_line_unit() {

}
/*
float length(): Returns the length of the vector.
a.length() = sqrt(a.x * a.x + a.y * a.y);
float unit(): Returns a vector pointing on the same direction, but with a length of 1.
a.unit() = a / a.length();


Vector2f rotate(float angle): Rotates the vector by the specified angle. This is an extremely useful operation, though it is rarely found in Vector classes. Equivalent to multiplying by the 2×2 rotation matrix.
a.rotate(angle) =  Vector2f(a.x * cos(angle) – a.y * sin(angle), a.x * sin(angle) + a.y * cos(angle));
float angle(): Returns the angle that the vector points to.
a.angle() = atan2(a.y, a.x);
*/

function math_randomInt(min, max) {
    return Math.round(min + rnd() * (max - min));
}

function math_randomColor(r,g,b,range){
    return math_randomInt(r,r+range)+","+math_randomInt(g,g+range)+","+math_randomInt(b,b+range);    
}

function genName(len) {
    var min = 1,
        max = len || 7;

    var length = (min + rnd() * (max - min)),
        consonants = 'bcdfghjklmnprstvwz', // consonants except hard to speak ones
        vowels = 'aeiou', // vowels
        all = consonants + vowels, // all
        text = '',
        chr;

    // I'm sure there's a more elegant way to do this, but this works
    // decently well.
    for (var ix = 0; ix < length; ix++) {
        if (ix === 0) {
            // First character can be anything
            if (length > 1) {
                chr = all[Math.round(rnd() * (all.length - 1))];
            } else {
                chr = all[Math.round(rnd() * (all.length - 1))];
                var prefx = Math.round(rnd()) ? (vowels[Math.round(rnd() * (vowels.length - 1))].toUpperCase() + consonants[Math.round(rnd() * (consonants.length - 1))]) : (consonants[Math.round(rnd() * (consonants.length - 1))].toUpperCase() + vowels[Math.round(rnd() * (vowels.length - 1))]);
                chr = prefx + '\'' + chr;
            }
        } else if (consonants.indexOf(chr) === -1) {
            // Last character was a vowel, now we want a consonant
            chr = consonants[Math.round(rnd() * (consonants.length - 1))];
        } else {
            // Last character was a consonant, now we want a vowel
            chr = vowels[Math.round(rnd() * (vowels.length - 1))];
        }

        text += length > 1 && !ix ? chr.toUpperCase() : chr;
        if (length > 1 && ix >= length - 1) {
            var prefx = Math.round(rnd()) ? (vowels[Math.round(rnd() * (vowels.length - 1))].toUpperCase() + consonants[Math.round(rnd() * (consonants.length - 1))]) : (consonants[Math.round(rnd() * (consonants.length - 1))].toUpperCase() + vowels[Math.round(rnd() * (vowels.length - 1))]);
            text = prefx + '\'' + text;
        }
    }

    // text = capitalize(text);

    return text;
}