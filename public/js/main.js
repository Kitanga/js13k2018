// Use ES5, no ES6
'use strict';

var _now = 0;
var _dt = 0;
var _last = 0;
var _step = 1 / 60;

function loop() {
    _now = performance.now();
    _dt = ((_now - _last) / 1000) < 1 ? (_now - _last) / 1000 : 1;

    while (_dt < _step) {
        // 
        _dt = _dt - _step;
        Thoran_update(_step);
    }

    Thoran_render(_dt);

    requestAnimationFrame(loop);
}

function startGame() {
    // Getting the screen we'll draw to
    player_screen = canvas;
    player_screenCtx = player_screen.getContext('2d');
    requestAnimationFrame(loop);
}

startGame();