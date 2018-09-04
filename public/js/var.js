'use strict';
/**
 * @type {Document}
 */
var doc = document;

/*
var storing World, an array where integers are stored for the following areas:
sea == undefined
grassland == 1
beach == 2
forests == 3
treasure == 4
village == 5
*/

var terrain_sea = document.createElement('canvas');
var terrain_grass = document.createElement('canvas');
var terrain_beach = document.createElement('canvas');
var terrain_forest = document.createElement('canvas');
var terrain_treasure = document.createElement('canvas');
var terrain_village = document.createElement('canvas');

var world;
var islands;

var mouse_x = 0;
var mouse_y = 0;

var world_height = 502;
var world_width = 502;
// World is comprised of Tiles

var world_biome_size = 1024;
var world_cell_size = 32;
// Each Tile is a 'Biome', comprising of 32 x 32px Cells
// 'real ingame co-ords' range from 0 -> 32 * 502 = 16064

var world_camera_pos_x, world_camera_pos_y;
var render_pos_x, render_pos_y;

var _now = 0;
var _dt = 0;
var _last = 0;
var _step = 1 / 60;

var canvasBound;

var player_x;
var player_y;
var player_width = 16;
var player_height = 16;
var player_shouldRender = true;
var player_screen = document.createElement('canvas');
var player_screenCtx = player_screen.getContext('2d');
var player_shouldTrack = false;
var player_track;
var player_texture;
var player_textureCtx;

var rnd = new alea('test1');
// var rnd = new alea(Math.random());


// Canvas related stuffs

var WIDTH = 512;
var HEIGHT = 512;

var canvas;
var ctx;

// ctx container
var container;


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