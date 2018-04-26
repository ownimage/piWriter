export {};

const debug = require('debug')('serverEmulator/server');
debug('### serverEmulator/server');

const commonConfig = require('../../serverCommon/src/config');
const neopixelLib = require('./NeoPixelEmulator');
const server = require('../../serverCommon/src/server');

let config = {
    ...commonConfig.config,
    neopixelLib,
    environment: 'Emulator'
};

server.startServer(config, neopixelLib.functionHooks);






