
console.log("### serverRPi/server");

const neopixelLib = require('rpi-ws281x-native');
const gpio = require('rpi-gpio');

const commonConfig = require('../../serverCommon/dist/config');
const { NeoPixelDriver} = require('../../serverCommon/dist/NeoPixelDriver');

const server = require('../../serverCommon/dist/server');
let config = {
    ...commonConfig.config,
    neopixelLib,
    environment: 'RPi',
};

let preventDebounce = false;
let buttonState = null;
gpio.setMode(gpio.MODE_BCM);
gpio.on('change', function (channel, value) {
    //console.log('Channel x' + channel + ' value is now ' + value);
    if (channel === 4) {
        if (buttonState != value) {
            buttonState = value;
            if (!value) {
                if (!preventDebounce) {
                    console.log("Button press! debounceTimeout" + config.debounceTimeout + " at " + JSON.stringify(Date.now()));
                    preventDebounce = true;
                    setTimeout(() => preventDebounce = false, config.debounceTimeout);
                    NeoPixelDriver.next();
                }
            }
        }
    }
});
gpio.setup(4, gpio.DIR_IN, gpio.EDGE_RISING);//, (channel, value) => console.log('Channel ' + channel + ' value is now ' + value));

const functionHooks = {
    app: app => {
    },
    server: server => {
    },
};

server.startServer(config, functionHooks);
