console.log('serverRPi/server.js started');

const config = require('../serverCommon/config');
const neopixelLib = require('rpi-ws281x-native');

// note that the config needs to be set before the server is loaded
config.setConfig({neopixelLib, environment: 'RPi'});

const server = require('../serverCommon/server');
server.startServer();


