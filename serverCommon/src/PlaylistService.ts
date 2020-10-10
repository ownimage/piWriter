import {getConfig} from "./configService";

export {};

import * as fs from "fs";
import * as path from "path";

import {PlaylistDTO} from "./shared/dto/playlistDTO.model";
import {NeoPixelDriver} from "./NeoPixelDriver";
import {logError} from "./utils/common";
import {serverConfig} from "./serverConfig";

const DEBUG = require("debug");
const debug = DEBUG("serverCommon/RESTv1");
debug("### serverCommon/RESTv1");

const getPlaylistsV1 = (req, res) => {
    try {
        debug("serverCommon/RESTv1:getPlaylistsV1");
        fs.readdir(serverConfig.playlistFolder, (err, files) => {
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
        const filePath = path.join(serverConfig.playlistFolder, playlistName);
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
        const filePath = path.join(serverConfig.playlistFolder, playlistName);
        fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
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

const postPlaylistsPlayV1 = async (req, res) => {
    try {
        debug("serverCommon/RESTv1:postPlaylistsPlayV1");
        const playlistName = req.params.playlistName;

        const filePath = path.join(serverConfig.playlistFolder, playlistName);
        let data = fs.readFileSync(filePath, {encoding: "utf-8"});
        debug("received data = %s", data);
        await NeoPixelDriver.setPlaylist(JSON.parse(data) as PlaylistDTO, getConfig(), serverConfig);
        res.header("Access-Control-Allow-Origin", "*");
        res.send({result: "OK"});
    } catch (e) {
        logError(debug, e);
    }
};


const postPlayCompiled = async (req, res) => {
    try {
        debug("serverCommon/RESTv1:postPlayCompiled");
        const playlistName = req.params.playlistName;
        const data = req.body;
        await NeoPixelDriver.setPlaylist(JSON.parse(data) as PlaylistDTO, getConfig(), serverConfig);
        res.header("Access-Control-Allow-Origin", "*");
        res.send({result: "OK"});
    } catch (e) {
        logError(debug, e);
    }
};

export const RESTv1 = {
    getPlaylistV1,
    getPlaylistsV1,
    postPlaylistV1,
    postPlaylistsPlayV1,
    postPlayCompiled
};
