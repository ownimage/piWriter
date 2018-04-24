export {};

const debug = require('debug')('serverEmulator/server');
debug('### serverEmulator/server');

//const {functionHooks} = require('./NeoPixelEmulator');

const commonConfig = require('../../serverCommon/config');
const neopixelLib = require('./NeoPixelEmulator');
const server = require('../../serverCommon/server');

let config = {
    ...commonConfig.config,
    neopixelLib,
    environment: 'Emulator'
};

server.startServer(config, neopixelLib.functionHooks);






