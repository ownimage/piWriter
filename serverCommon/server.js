console.log("### serverCommon/server");


const http = require('http');
const express = require('express');
const bodyParser = require("body-parser");

const RESTv1 = require('./RESTv1');
const RESTv2 = require('./RESTv2');

const {logError} = require('./common');

const NeoPixelDriver = require('./NeoPixelDriver');

let config;

const startServer = (config, functionHooks) => {
    console.log('serverCommon/server:serverStart');
    console.log(`config = ${JSON.stringify(config)}`);
    this.config = config;

    NeoPixelDriver.init(config);

    const app = express();
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    //following form http://johnzhang.io/options-request-in-express
    app.options("/*", function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        res.sendStatus(200);
    });

    app.use('/images', express.static(config.imagesFolder));
    app.get('/ping', ping);
    app.get('/config', getConfig);
    app.post('/config', postConfig);
    app.get('/v2/images/', RESTv2.getImagesV2);
    app.get('/v1/playlists', RESTv1.getPlaylistsV1);
    app.get('/v1/playlists/:playlistName', RESTv1.getPlaylistV1);
    app.post('/v1/playlists/:playlistName', RESTv1.postPlaylistV1);
    app.post('/v1/playlists/:playlistName/play', RESTv1.postPlaylistsPlayV1);
    app.use('/', express.static(config.appFolder));

    functionHooks.app(app);

    const server = http.createServer(app);
    server.listen(config.serverPort, () => {
        console.log(`Server started on port ${server.address().port} :)`);
    });

    functionHooks.server(server);
};

const ping = (req, res) => {
    console.log('serverCommon/server:ping');
    res.header('Access-Control-Allow-Origin', '*');
    res.send({message: 'is alive!'});
};

const getConfig = (req, res) => {
    console.log('serverCommon/server:getConfig');
    res.header('Access-Control-Allow-Origin', '*');
    res.send(this.config);
};

const postConfig = (req, res) => {
    try {
        console.log('serverCommon/server:postConfig');
        console.log('req.body =' + JSON.stringify(req.body));

        let NUM_LEDS = req.body.NUM_LEDS;
        if (12 > NUM_LEDS || NUM_LEDS > 144) {
            NUM_LEDS = this.config.NUM_LEDS;
        }

        let brightness = req.body.brightness;
        if (16 > brightness || brightness > 255) {
            brightness = this.config.brightness;
        }

        let speed = req.body.speed;
        if (0.2 > speed || speed > 5) {
            speed = this.config.speed;
        }

        let debounceTimeout = req.body.debounceTimeout;
        if (10 > debounceTimeout || debounceTimeout > 1000) {
            debounceTimeout = this.config.debounceTimeout;
        }

        let newConfig = {...this.config, brightness, speed, debounceTimeout, NUM_LEDS};
        console.log(`newConfig = ${JSON.stringify(newConfig)}`);
        this.config = newConfig;
        NeoPixelDriver.init(this.config);

        res.header('Access-Control-Allow-Origin', '*');
        res.send(this.config);
    } catch (e) {
        res.header('Access-Control-Allow-Origin', '*');
        res.sendStatus(500);
        logError(e);
    }
};

module.exports = {
    startServer
};
