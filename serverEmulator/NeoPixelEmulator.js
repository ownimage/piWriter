console.log("### serverEmulator/NeoPixelEmulator");

const { config } = require('../serverCommon/config');
const WebSocket = require('ws');

let NUM_LEDS = 10;
let NeoPixelArray = new Uint32Array(NUM_LEDS);

console.log(`config = ${JSON.stringify(config)}`);
const webSocketServer = new WebSocket.Server({port: config.emulatorServerPort});

const init = (size) => {
    console.log("init");
    NUM_LEDS = size;
    NeoPixelArray = new Uint32Array(NUM_LEDS);
};

const reset = () => {
    console.log("reset");
    NeoPixelArray = new Uint32Array(NUM_LEDS);
};

const render = (array) => {
    console.log("render");
    NeoPixelArray = array;
    webSocketServer.clients.forEach(function each(ws) {
        ws.send(JSON.stringify(NeoPixelArray));
    });
};

webSocketServer.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        if (message == 'Heartbeat') {
            render(NeoPixelArray);
        } else if (message == 'Button') {
            console.log('Button');
        }
    });
});

module.exports = {
    name: 'serverEmulator/NeoPixelEmulator',
    init,
    reset,
    render
};