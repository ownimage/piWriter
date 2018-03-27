console.log('serverEmulator/server.js started');

const config = require('../serverCommon/config');
const neopixelLib = require('./NeoPixelEmulator');

// note that the config needs to be set before the server is loaded
config.setConfig({neopixelLib, environment: 'Emulator'});

const server = require('../serverCommon/server');
server.startServer();


//const np = require('../serverCommon/NeoPixelDriver' );
//console.log(`SE np = ${JSON.stringify(np)}`);




