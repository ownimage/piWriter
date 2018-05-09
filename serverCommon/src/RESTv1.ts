export {};

const debug = require("debug")("serverCommon/RESTv1");
debug("### serverCommon/RESTv1");

const fs = require("fs");
const path = require("path");

import { PlaylistDTO } from "./dto/PlaylistDTO";
import { NeoPixelDriver } from "./NeoPixelDriver";

import {config} from "./config";
import {logError} from "./utils/common";

const getPlaylistsV1 = (req, res) => {
    try {
        debug("serverCommon/RESTv1:getPlaylistsV1");
        fs.readdir(config.playlistFolder, (err, files) => {
            debug("getPlaylistsV1 %O", files);
            res.header("Access-Control-Allow-Origin", "*");
            res.send(files);
        });
    } catch (e) {
        logError(debug, e);
    }
};

const getPlaylistV1 = (req, res) => {
    try {
        debug("serverCommon/RESTv1:getPlaylistV1");
        debug("req.params.playlistName = %s", req.params.playlistName);
        const playlistName = req.params.playlistName;
        const filePath = path.join(config.playlistFolder, playlistName);
        fs.readFile(filePath, {encoding: "utf-8"}, (err, data) => {
            res.header("Access-Control-Allow-Origin", "*");
            if (!err) {
                debug("received data = %s", data);
                res.header("Access-Control-Allow-Origin", "*");
                res.send(data);
            } else {
                debug("err = %o", err);
                if (err.errno === -4058) { // no such file or directory
                    res.sendStatus(404);
                } else {
                    res.sendStatus(500);
                }
            }
        });
    } catch (e) {
        logError(debug, e);
    }
};

const postPlaylistV1 = (req, res) => {
    try {
        debug("serverCommon/RESTv1:postPlaylistV1");
        debug("req.params.playlistName = %s", req.params.playlistName);
        debug("req.body = %O", req.body);
        const playlistName = req.params.playlistName;
        const filePath = path.join(config.playlistFolder, playlistName);
        fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) =>  {
            if (!err) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Content-Type", "text/plain");
                res.end();
            } else {
                logError(debug, err);
                res.sendStatus(500);
            }
        });
    } catch (e) {
        logError(debug, e);
    }
};

const postPlaylistsPlayV1 = (req, res) => {
    try {
        debug("serverCommon/RESTv1:postPlaylistsPlayV1");
        const playlistName = req.params.playlistName;

        const filePath = path.join(config.playlistFolder, playlistName);
        fs.readFile(filePath, {encoding: "utf-8"}, (err, data) => {
            if (!err) {
                debug("received data = %s", data);
                NeoPixelDriver.setPlaylist(JSON.parse(data) as PlaylistDTO);
                res.header("Access-Control-Allow-Origin", "*");
                res.send({result: "OK"});
            } else {
                debug("received data = %s", data);
            }
        });
    } catch (e) {
        logError(debug, e);
    }
};

export const RESTv1 =  {
    getPlaylistV1,
    getPlaylistsV1,
    postPlaylistV1,
    postPlaylistsPlayV1,
};
