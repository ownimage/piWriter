import {serverConfig} from "./serverConfig";
import {PlaylistDTO} from "./shared/dto/playlistDTO.model";
import {playlistDTOToServerPlaylist} from "./mappers/playlistDTOToServerPlaylist.mapper";
import {player} from "./model/ServerPlayer";
import {rgbValues2Int} from "./shared/utils/ColorUtils";
import {getConfig} from "./configService";

export {};

const DEBUG = require("debug");
const debug = DEBUG("serverCommon/NeoPixelDriver");
debug("### serverCommon/NeoPixelDriver");

let neoPixelLib;
let blankArray: Uint32Array;
let flashArray: Uint32Array = null;
let playlistDTO = null;

function setNeoPixelLib(newNeoPixelLib) {
    neoPixelLib = newNeoPixelLib;
}

function init() {
    debug("serverCommon/NeoPixelDriver:init");
    debug("NUM_LEDS = %d", getConfig().NUM_LEDS);

    blankArray = new Uint32Array(getConfig().NUM_LEDS);
    neoPixelLib.init(getConfig().NUM_LEDS);

    setPlaylist(playlistDTO, getConfig, serverConfig);
    flash(2);
}

function setupFlashArray() {
    debug("serverCommon/NeoPixelDriver:setupFlashArray");
    const colors = [
        rgbValues2Int(64, 0, 0),
        rgbValues2Int(0, 64, 0),
        rgbValues2Int(0, 0, 64),
    ];
    flashArray = new Uint32Array(getConfig().NUM_LEDS);
    for (let i = 0; i < getConfig().NUM_LEDS; i++) {
        flashArray[i] = colors[i % 3];
    }
}

function flash(n) {
    debug("serverCommon/NeoPixelDriver:flash %d", n);
    if (!n || n <= 0) {
        return;
    }

    if (!flashArray) {
        setupFlashArray();
    }

    neoPixelLib.render(flashArray);
    setTimeout(() => neoPixelLib.render(blankArray), 500);
    setTimeout(() => flash(n - 1), 1000);
}

// ---- trap the SIGINT and reset before exit
process.on("SIGINT", () => {
    neoPixelLib.reset();
    process.nextTick(() => {
        process.exit(0);
    });
});

async function setPlaylist(playlistDTO: PlaylistDTO, config, serverconfig) {
    const serverPlaylist = (playlistDTO) ?
        await playlistDTOToServerPlaylist(playlistDTO,
            config.NUM_LEDS,
            config.brightness,
            config.speed,
            serverConfig.imagePixelTime,
            serverConfig.neopixelRefreshTime,
            serverConfig.lmax,
            serverConfig.dlmax,
            serverConfig.imagesFolder,
            serverConfig.fontsFolder)
        : null;
    flash(2);
    player.play(serverPlaylist);
}

const render = (colorArray) => {
    neoPixelLib.render(colorArray);
};

const renderBlank = () => {
    neoPixelLib.render(blankArray);
};

function next() {
    player.next(render, renderBlank);
}

export const NeoPixelDriver = {
    setNeoPixelLib,
    init,
    next,
    setPlaylist,
};
