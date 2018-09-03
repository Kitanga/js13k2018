// Use ES5, no ES6
'use strict';

world = cellularAutomata(world_height, world_width);

function loop() {
    _now = performance.now();
    _dt = ((_now - _last) / 1000) < 1 ? (_now - _last) / 1000 : 1;

    while (_dt < _step) {
        // 
        _dt = _dt - _step;
        T_update(_step);
    }

    T_render(_dt);
    requestAnimationFrame(loop);
}

function startGame() {
    // Getting the screen we'll draw to
    // player_screen = canvas;
    // player_screenCtx = player_screen.getContext('2d');
    // requestAnimationFrame(loop);
    //cellularAutomata(502,502);
    player_screen = canvas;
    player_screenCtx = player_screen.getContext('2d');
    T_buffer_terrain();
    requestAnimationFrame(loop);
    //console.log(cellularAutomata(world_height,world_width));
    //renderMap(world);
    if (typeof player_x == 'undefined') {
        
        player_x = 241;
        player_y = 252;  
    }    
    // cellularAutomata(Math.round(WIDTH / 3),Math.round(WIDTH / 3));
    // cellularAutomata(Math.round(WIDTH / 3),Math.round(WIDTH / 3));
}

startGame();
