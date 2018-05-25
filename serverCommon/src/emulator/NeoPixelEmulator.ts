export {};

import * as express from "express";
var proxy = require('http-proxy-middleware');
import * as WebSocket from "ws";
import * as path from "path";

import { NeoPixelDriver } from "../NeoPixelDriver";

const debug = require("debug")("serverEmulator/NeoPixelEmulator");
debug("### serverEmulator/server");

let NUM_LEDS = 10;
let NeoPixelArray = new Uint32Array(NUM_LEDS);
let webSocketServer = null;

const init = (size) => {
    debug("serverEmulator/NeoPixelEmulator:init");
    NUM_LEDS = size;
    NeoPixelArray = new Uint32Array(NUM_LEDS);
};

const reset = () => {
    debug("serverEmulator/NeoPixelEmulator:reset");
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
    app: (app) => {
        app.use("/demo", express.static(path.resolve(__dirname + "/index.html")));
        app.use("/demo/node_modules", express.static(path.resolve(__dirname + "/../../node_modules")));
        app.use("/", proxy({target: "http://localhost:4200"}));
    },
    server: (server) => {
        webSocketServer = new WebSocket.Server({server});
        webSocketServer.on("connection", function connection(ws) {
            ws.on("message", function incoming(message) {
                if (message === "Heartbeat") {
                    render(NeoPixelArray);
                } else if (message === "Button") {
                    NeoPixelDriver.next();
                }
            });
        });
    },
    additionalServerInfo: async () => {
        return {
        "temp": 199.99,
        "diskSize": 30938734592,
        "diskUsedPercent": 8.15,
        "diskFree": 28418301952};
    }
};

module.exports = {
    functionHooks,
    init,
    render,
    reset,
};
