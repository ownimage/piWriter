export {};

const debug = require("debug")("serverCommon/config");
debug("### serverCommon/config");

const path = require("path");

export const config = {
    NUM_LEDS: 60,
    appFolder: path.resolve(__dirname +  "/../../editor/dist/"),
    brightness: 254,
    debounceTimeout: 301,
    imagesFolder: path.resolve(__dirname + "/../../library/images/"),
    playlistFolder: path.resolve(__dirname + "/../../library/playlists/"),
    serverPort: 80,
    speed: 1.1,
};
