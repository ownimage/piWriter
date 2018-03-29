console.log("### serverRPi/NeoPixelLogger");

const neopixelLib = require('rpi-ws281x-native');

const init = (size) => {
    console.log("serverRPi/NeoPixelLogger:init");
};

const reset = () => {
    console.log("serverRPi/NeoPixelLogger:reset");
};

const render = (array) => {
    console.log("serverRPi/NeoPixelLogger:reset");
};

module.exports = {
    init,
    reset,
    render
};