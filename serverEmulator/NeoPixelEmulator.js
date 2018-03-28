console.log("### serverEmulator/NeoPixelEmulator");

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const { config } = require('../serverCommon/config');
const NeoPixelDriver = require('../serverCommon/NeoPixelDriver');

let NUM_LEDS = 10;
let NeoPixelArray = new Uint32Array(NUM_LEDS);

const init = (size) => {
    console.log("serverEmulator/NeoPixelEmulator:init");
    NUM_LEDS = size;
    NeoPixelArray = new Uint32Array(NUM_LEDS);
};

const reset = () => {
    console.log("serverEmulator/NeoPixelEmulator:reset");
    NeoPixelArray = new Uint32Array(NUM_LEDS);
};

const render = (array) => {
    console.log("serverEmulator/NeoPixelEmulator:render");
    NeoPixelArray = array;
    webSocketServer.clients.forEach(function each(ws) {
        ws.send(JSON.stringify(NeoPixelArray));
    });
};

// based on https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
const app = express();
app.use("/index.html", express.static("index.html"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

const server = http.createServer(app);
server.listen( config.emulatorServerPort, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

const webSocketServer = new WebSocket.Server({server});
webSocketServer.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        if (message == 'Heartbeat') {
            render(NeoPixelArray);
        } else if (message == 'Button') {
            NeoPixelDriver.next();
        }
    });
});

module.exports = {
    init,
    reset,
    render
};