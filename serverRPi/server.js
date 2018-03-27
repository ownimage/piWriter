console.log("### serverRPi/server");

const commonConfig = require('../serverCommon/config');
const neopixelLib = require('rpi-ws281x-native');

const server = require('../serverCommon/server');
let config = {
    ...commonConfig.config,
    neopixelLib,
    environment: 'RPi'
};

server.startServer(config);

