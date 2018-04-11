console.log("### serverRPi/server");

const neopixelLib = require('rpi-ws281x-native');
var gpio = require('rpi-gpio');

const commonConfig = require('../serverCommon/config');
const NeoPixelDriver = require('../serverCommon/NeoPixelDriver');

const server = require('../serverCommon/server');
let config = {
    ...commonConfig.config,
    neopixelLib,
    environment: 'RPi',
    debounceTimout: 300,
};

let preventDebounce = false;
let buttonState;
gpio.setMode(gpio.MODE_BCM);
gpio.on('change', function(channel, value) {
    //console.log('Channel x' + channel + ' value is now ' + value);
    if (channel == 4) {
        if (buttonState != value) {
            buttonState = value;
            if (!value) {
                console.log('Button press! ' + JSON.stringify(Date.now()));
                if (!this.preventDebounce) {
                    this.preventDebounce = true;
                    setTimeout(() => this.preventDebounce = false, config.debounceTimout);
                    NeoPixelDriver.next();
                }
            }
        }
    }
});
gpio.setup(4, gpio.DIR_IN, gpio.EDGE_RISING);//, (channel, value) => console.log('Channel ' + channel + ' value is now ' + value));

const functionHooks = {
    app: app => {},
    server: server => {}
};

server.startServer(config, functionHooks);

