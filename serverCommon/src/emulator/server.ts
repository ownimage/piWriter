export {};

const debug = require('debug')('serverEmulator/server');
debug('### serverEmulator/server');

const commonConfig = require('../config');
const server = require('../server');

const neopixelLib = require('./NeoPixelEmulator');

let config = {
    ...commonConfig.config,
    neopixelLib,
    environment: 'Emulator'
};

debug(config);
server.startServer(config, neopixelLib.functionHooks);






