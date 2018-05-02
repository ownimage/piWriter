export {};

const debug = require('debug')('serverCommon/NeoPixelDriver');
debug('### serverCommon/NeoPixelDriver');

import {PlaylistDTO} from './dto/PlaylistDTO';
import {playlistDTOToPlaylist} from './mappers/playlistDTOToPlaylist.mapper';

import {rgbValues2Int} from './utils/ColorUtils';
import { player } from './model/Player';

let config;
let blankArray: Uint32Array;
let flashArray: Uint32Array = null;
let playlistDTO = null;
let playlist = null;


function init(newConfig) {
    debug('serverCommon/NeoPixelDriver:init');
    config = newConfig;

    debug('NUM_LEDS = %d', config.NUM_LEDS);
    blankArray = new Uint32Array(config.NUM_LEDS);
    config.neopixelLib.init(config.NUM_LEDS);

    setPlaylist(playlistDTO);
    flash(2);
}


function setupFlashArray() {
    debug('serverCommon/NeoPixelDriver:setupFlashArray');
    let colors = [
        rgbValues2Int(64, 0, 0),
        rgbValues2Int(0, 64, 0),
        rgbValues2Int(0, 0, 64)
    ];
    flashArray = new Uint32Array(config.NUM_LEDS);
    for (let i = 0; i < config.NUM_LEDS; i++) {
        flashArray[i] = colors[i % 3];
    }
}


function flash(n) {
    debug('serverCommon/NeoPixelDriver:flash %d', n);
    if (!n || n <= 0) return;

    if (!flashArray) {
        setupFlashArray();
    }

    config.neopixelLib.render(flashArray);
    setTimeout(() => config.neopixelLib.render(blankArray), 500);
    setTimeout(() => flash(n - 1), 1000);
}

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
    config.neopixelLib.reset();
    process.nextTick(function () {
        process.exit(0);
    });
});


function setPlaylist(newPlaylistDTO: PlaylistDTO) {
    playlistDTO = newPlaylistDTO;
    let playlist = (newPlaylistDTO) ? playlistDTOToPlaylist(newPlaylistDTO, config, () => flash(2)) : null;
    player.play(playlist);
}

const render = (colorArray) => {
    config.neopixelLib.render(colorArray);
};

const renderBlank = () => {
    config.neopixelLib.render(blankArray);
};

function next() {
    player.next(render, renderBlank);
}

export const NeoPixelDriver = {
    init,
    setPlaylist,
    next
};




