export {};

const debug = require('debug')('serverEmulator/server');
debug('### serverEmulator/server');

const commonConfig = require('../../serverCommon/src/config');
const server = require('../../serverCommon/src/server');

const neopixelLib = require('./NeoPixelEmulator');

let config = {
    ...commonConfig.config,
    neopixelLib,
    environment: 'Emulator'
};

server.startServer(config, neopixelLib.functionHooks);






