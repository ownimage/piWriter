export {};

const debug = require('debug')('serverEmulator/server');
debug('### serverEmulator/server');

const commonConfig = require('../../serverCommon/dist/config');
const neopixelLib = require('../../serverCommon/src/utils/NeoPixelEmulator');
const server = require('../../serverCommon/dist/server');

let config = {
    ...commonConfig.config,
    neopixelLib,
    environment: 'Emulator'
};

server.startServer(config, neopixelLib.functionHooks);






