export {};

const debug = require("debug")("serverCommon/server");
debug("### serverCommon/server");

const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

import {NeoPixelDriver} from "./NeoPixelDriver";
import {RESTv1} from "./RESTv1";
import {RESTv2} from "./RESTv2";
import {getServerInfo} from "./ServerInfo";
import {getConfig, RESTpostConfig, RESTgetConfig} from "./config";
import {serverConfig} from "./serverConfig";


const startServer = ({environment, neopixelLib, functionHooks}) => {
    debug("serverCommon/server:serverStart");
    debug("config = %o", getConfig());
    debug("environment = %o", environment);

    NeoPixelDriver.setNeoPixelLib(neopixelLib);
    NeoPixelDriver.init();


    const app = express();
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    // following form http://johnzhang.io/options-request-in-express
    app.options("/*", (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
        res.sendStatus(200);
    });

    app.use("/images", express.static(serverConfig.imagesFolder));
    app.get("/ping", ping);
    app.get("/config", RESTgetConfig);
    app.get("/serverInfo", getServerInfo(functionHooks.additionalServerInfo));
    app.post("/config", RESTpostConfig);
    app.get("/v2/images/", RESTv2.getImagesV2);
    app.get("/v1/playlists", RESTv1.getPlaylistsV1);
    app.get("/v1/playlists/:playlistName", RESTv1.getPlaylistV1);
    app.post("/v1/playlists/:playlistName", RESTv1.postPlaylistV1);
    app.post("/v1/playlists/:playlistName/play", RESTv1.postPlaylistsPlayV1);
    functionHooks.app(app);
    app.use("/", express.static(serverConfig.appFolder));
    app.use((req, res) => res.sendFile(path.resolve(serverConfig.appFolder, "index.html")));

    const server = http.createServer(app);
    server.listen(getConfig().serverPort, () => {
        debug(`Server started on port ${server.address().port} :)`);
    });

    functionHooks.server(server);
};

const ping = (req, res) => {
    debug("serverCommon/server:ping");
    res.header("Access-Control-Allow-Origin", "*");
    res.send({message: "is alive!"});
};

module.exports = {
    startServer,
};
