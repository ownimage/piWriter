export {};

const debug = require('debug')('serverEmulator/NeoPixelEmulator');
debug('### serverEmulator/server');

const express = require('express');
const WebSocket = require('ws');
var path = require('path');

import {NeoPixelDriver} from '../NeoPixelDriver';

let NUM_LEDS = 10;
let NeoPixelArray = new Uint32Array(NUM_LEDS);
let webSocketServer = null;

const init = (size) => {
    debug('serverEmulator/NeoPixelEmulator:init');
    NUM_LEDS = size;
    NeoPixelArray = new Uint32Array(NUM_LEDS);
};

const reset = () => {
    debug('serverEmulator/NeoPixelEmulator:reset');
    NeoPixelArray = new Uint32Array(NUM_LEDS);
};

const render = (array) => {
    NeoPixelArray = array;
    if (webSocketServer) {
        webSocketServer.clients.forEach(function each(ws) {
            ws.send(JSON.stringify(NeoPixelArray));
        });
    }
};

const functionHooks = {
    app: app => {
        app.use('/demo', express.static(path.resolve(__dirname + '/index.html')));
        app.use('/demo/node_modules', express.static(path.resolve(__dirname + '/../../node_modules')));
    },
    server: server => {
        webSocketServer = new WebSocket.Server({server});
        webSocketServer.on('connection', function connection(ws) {
            ws.on('message', function incoming(message) {
                if (message === 'Heartbeat') {
                    render(NeoPixelArray);
                } else if (message === 'Button') {
                    NeoPixelDriver.next();
                }
            });
        });
    }
};

module.exports = {
    init,
    reset,
    render,
    functionHooks
};