export {};

const debug = require("debug")("serverEmulator/server");
debug("### serverEmulator/server");

const commonConfig = require("../config");
const server = require("../server");

const neopixelLib = require("./NeoPixelEmulator");

const config = {
    ...commonConfig.config,
    environment: "Emulator",
    neopixelLib,
};

debug(config);
server.startServer(config, neopixelLib.functionHooks);
