export {};

require("babel-core/register");
require("babel-polyfill");

const debug = require("debug")("serverEmulator/server");
debug("### serverEmulator/server");

const server = require("../server");
const neopixelLib = require("./NeoPixelEmulator");

server.startServer({
    environment: "Emulator",
    neopixelLib,
    functionHooks: neopixelLib.functionHooks
});
