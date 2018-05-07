export {};

const debug = require('debug')('serverCommon/config');
debug('### serverCommon/config');

var path = require('path');

export const config = {
    serverPort: 80,
    appFolder: path.resolve(__dirname +  '/../../editor/dist/'),
    imagesFolder: path.resolve(__dirname + '/../../library/images/'),
    playlistFolder: path.resolve(__dirname + '/../../library/playlists/'),
    NUM_LEDS: 60,
    speed: 1.1,
    brightness: 254,
    debounceTimeout: 301
};

