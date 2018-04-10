console.log("### serverCommon/server");

const express = require('express');
const bodyParser = require("body-parser");

const RESTv1 = require('./RESTv1');
const RESTv2 = require('./RESTv2');

const NeoPixelDriver = require('./NeoPixelDriver');

let config;

const startServer = (config) => {
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

    app.listen(config.serverPort, () => console.log(`Example app listening on port ${config.serverPort}!`));
};

const ping = (req, res) => {
    console.log('serverCommon/server:ping');
    res.header('Access-Control-Allow-Origin', '*');
    res.send({message: 'is alive!'});
};

const getConfig = (req, res) => {
    console.log('serverCommon/server:getConfig');
    res.header('Access-Control-Allow-Origin', '*');
    res.send({speed: 1.0, brightness: 255, debounceTimeout: 300, ...this.config});
};

const postConfig = (req, res) => {
    try {
        console.log('serverCommon/server:postConfig');
        console.log('req.body =' + JSON.stringify(req.body));
        res.header('Access-Control-Allow-Origin', '*');
        res.send({result: 'OK'});
    } catch (e) {
        res.header('Access-Control-Allow-Origin', '*');
        res.sendStatus(500);
        logError(e);
    }
};

module.exports = {
    startServer
};
