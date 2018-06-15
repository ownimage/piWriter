var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log("### serverRPi/server");
require("babel-core/register");
require("babel-polyfill");
const neopixelLib = require('rpi-ws281x-native');
const gpio = require('rpi-gpio');
const fs = require('fs');
const si = require('systeminformation');
const { getConfig } = require('../../serverCommon/dist/config');
const { NeoPixelDriver } = require('../../serverCommon/dist/NeoPixelDriver');
const server = require('../../serverCommon/dist/server');
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
                    console.log("Button press! debounceTimeout" + getConfig().debounceTimeout + " at " + JSON.stringify(Date.now()));
                    preventDebounce = true;
                    setTimeout(() => preventDebounce = false, getConfig().debounceTimeout);
                    NeoPixelDriver.next();
                }
            }
        }
    }
});
gpio.setup(4, gpio.DIR_IN, gpio.EDGE_RISING); //, (channel, value) => console.log('Channel ' + channel + ' value is now ' + value));
const functionHooks = {
    app: app => {
    },
    server: server => {
    },
    additionalServerInfo: () => __awaiter(this, void 0, void 0, function* () {
        let allDisks = yield si.fsSize();
        let disk = allDisks.find(d => '/' == d.mount);
        console.log(`disk = ${JSON.stringify(disk)}`);
        return {
            temp: fs.readFileSync('/sys/class/thermal/thermal_zone0/temp') / 1000,
            diskSize: disk.size,
            diskUsedPercent: disk.use,
            diskFree: disk.size - disk.used
        };
    })
};
server.startServer({
    environment: "RPi",
    neopixelLib,
    functionHooks
});
