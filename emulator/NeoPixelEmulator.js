const WebSocket = require('ws');
const config = require('../server/config');

console.log("NeoPixelEmulator");

var NUM_LEDS = 10;
var NeoPixelArray = new Uint32Array(NUM_LEDS);

const wss = new WebSocket.Server({port: config.emulatorServerPort});

const init = (size) => {
    console.log("init");
    NUM_LEDS = size;
    NeoPixelArray = new Uint32Array(NUM_LEDS);
}

const reset = () => {
    console.log("reset");
    NeoPixelArray = new Uint32Array(NUM_LEDS);
}

const render = (array) => {
    console.log("render");
    NeoPixelArray = array;
    wss.clients.forEach(function each(ws) {
        ws.send(JSON.stringify(NeoPixelArray));
    });
}

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        render(NeoPixelArray);
    });

    ws.send('something');

});

setInterval(() => {
    console.log("sending");
    NeoPixelArray[0] = Math.floor(Math.random() * 100) + 1;
    render(NeoPixelArray);
}, 1000);


module.exports = {
    init,
    reset,
    render
}