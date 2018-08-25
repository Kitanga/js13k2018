/**
 * @type {Document}
 */
var doc = document;

/**
 * Binds functions to events
 * 
 * @param {string} type The type of event
 * @param {function(event)} callback The function that runs when the event fires
 */
doc.on = function (type, callback) {
    this.addEventListener(type, callback);
};

/**
 * Get's an element from the DOM
 * @param {string} selector CSS selector string
 * @returns {HTMLElement}
 */
function util_getEle(selector) {
    return doc.querySelector(selector);
}

/**
 * Creates an HTML element
 * 
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

/**
 * 
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