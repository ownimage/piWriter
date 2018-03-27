console.log("### serverEmulator/server")

const commonConfig = require('../serverCommon/config');
const neopixelLib = require('./NeoPixelEmulator');
const server = require('../serverCommon/server');

let config = {
    ...commonConfig.config,
    neopixelLib,
    environment: 'Emulator'
};

server.startServer(config);





