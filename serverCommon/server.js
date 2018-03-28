console.log("### serverCommon/server");

const express = require('express');
const bodyParser = require("body-parser");

const RESTv1 = require('./RESTv1');
const NeoPixelDriver = require('./NeoPixelDriver');

const startServer = (config) => {
    console.log('serverCommon/server:serverStart');
    console.log(`config = ${JSON.stringify(config)}`);

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

    app.get('/', (req, res) => res.send('Hello World!'));
    app.use('/app', express.static(config.appFolder));
    app.use('/images', express.static(config.imagesFolder));
    app.get('/v1/images', RESTv1.getImagesV1);
    app.get('/v1/playlists', RESTv1.getPlaylistsV1);
    app.get('/v1/playlists/:playlist', RESTv1.getPlaylistV1);
    app.post('/v1/playlists/:playlist', RESTv1.postPlaylistV1);
    app.post('/v1/playlists', RESTv1.postPlaylistsV1);

    app.listen(config.serverPort, () => console.log(`Example app listening on port ${config.serverPort}!`));
};

module.exports = {
    startServer
};
