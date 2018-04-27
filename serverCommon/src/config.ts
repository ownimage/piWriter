export {};

const debug = require('debug')('serverCommon/config');
debug('### serverCommon/config');

const config = {
    serverPort: 80,
    appFolder: '../editor/dist/',
    imagesFolder: '../library/images/',
    playlistFolder: '../library/playlists/',
    NUM_LEDS: 60,
    speed: 1.1,
    brightness: 254,
    debounceTimeout: 301
};

module.exports = {
    config
};