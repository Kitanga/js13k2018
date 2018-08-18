var doc = document;

doc.on = function(type, callback) {
    this.addEventListener(type, callback);
};

function util_getEle() {
    return doc.querySelector(selector);
}

function util_createElement(tag, attributes) {
    var element = doc.createElement(tag);

    for (var ix in attributes) {
        if (attributes.hasOwnProperty(ix)) {
            element[ix] = attributes[ix];
        }
    }

    return element;
}

function util_createCanvas(width, height, callback) {
    var _obj = {};
    _obj.width = width;
    _obj.height = height;

    var canvas = util_createElement('canvas', _obj);
    callback(canvas.getContext('2d'));

    return canvas;
}