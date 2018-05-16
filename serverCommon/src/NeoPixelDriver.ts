export {};

import { PlaylistDTO } from "./dto/playlistDTO.model";
import { playlistDTOToPlaylist } from "./mappers/playlistDTOToPlaylist.mapper";
import { player } from "./model/Player";
import { rgbValues2Int } from "./utils/ColorUtils";

const DEBUG = require("debug");
const debug = DEBUG("serverCommon/NeoPixelDriver");
debug("### serverCommon/NeoPixelDriver");

let config;
let blankArray: Uint32Array;
let flashArray: Uint32Array = null;
let playlistDTO = null;

function init(newConfig) {
    debug("serverCommon/NeoPixelDriver:init");
    config = newConfig;

    debug("NUM_LEDS = %d", config.NUM_LEDS);
    blankArray = new Uint32Array(config.NUM_LEDS);
    config.neopixelLib.init(config.NUM_LEDS);

    setPlaylist(playlistDTO);
    flash(2);
}

function setupFlashArray() {
    debug("serverCommon/NeoPixelDriver:setupFlashArray");
    const colors = [
        rgbValues2Int(64, 0, 0),
        rgbValues2Int(0, 64, 0),
        rgbValues2Int(0, 0, 64),
    ];
    flashArray = new Uint32Array(config.NUM_LEDS);
    for (let i = 0; i < config.NUM_LEDS; i++) {
        flashArray[i] = colors[i % 3];
    }
}

function flash(n) {
    debug("serverCommon/NeoPixelDriver:flash %d", n);
    if (!n || n <= 0) { return; }

    if (!flashArray) {
        setupFlashArray();
    }

    config.neopixelLib.render(flashArray);
    setTimeout(() => config.neopixelLib.render(blankArray), 500);
    setTimeout(() => flash(n - 1), 1000);
}

// ---- trap the SIGINT and reset before exit
process.on("SIGINT", () => {
    config.neopixelLib.reset();
    process.nextTick(() => {
        process.exit(0);
    });
});

function setPlaylist(newPlaylistDTO: PlaylistDTO) {
    playlistDTO = newPlaylistDTO;
    const playlist = (newPlaylistDTO) ?
        playlistDTOToPlaylist(
            newPlaylistDTO,
            config.NUM_LEDS,
            config.brightness,
            config.imagesFolder,
            () => flash(2),
        ) : null;
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
    next,
    setPlaylist,
};
