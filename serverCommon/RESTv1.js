console.log("### serverCommon/RESTv1");

const fs = require('fs');
const path = require('path');
const NeoPixelDriver = require('./NeoPixelDriver');

const {config} = require("./config");

const getImagesV1 = (req, res) => {
    console.log("getImagesV1");
    fs.readdir(config.imagesFolder, (err, files) => {
        console.log(`getImagesV1 ` + JSON.stringify(files));
        res.header("Access-Control-Allow-Origin", "*");
        res.send(files);
    });
};

const getPlaylistsV1 = (req, res) => {
    console.log("getPlaylistsV1");
    fs.readdir(config.playlistFolder, (err, files) => {
        console.log(`getPlaylistsV1 ` + JSON.stringify(files));
        res.header("Access-Control-Allow-Origin", "*");
        res.send(files);
    });
};

const getPlaylistV1 = (req, res) => {
    console.log("getPlaylistV1");
    console.log(req.params.playlist);
    const playlist = req.params.playlist;
    const filePath = path.join(config.playlistFolder, playlist);
    fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
        if (!err) {
            console.log('received data: ' + data);
            res.header("Access-Control-Allow-Origin", "*");
            res.send(data);
        } else {
            console.log(err);
        }
    });
};

const postPlaylistV1 = (req, res) => {
    console.log("postPlaylistV1");
    console.log(req.params.playlist);
    console.log("req.body =" + JSON.stringify(req.body));
    const playlist = req.params.playlist;
    const filePath = path.join(config.playlistFolder, playlist);
    fs.writeFile(filePath, JSON.stringify(req.body, null, 2), function (err) {
        if (!err) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Content-Type", "text/plain");
            res.end();
        } else {
            res.sendStatus(500);
        }
    });
};

const playV1 = (req, res) => {
    console.log("playV1");
    console.log("req.body =" + JSON.stringify(req.body));
    console.log("NeoPixelDriver =" + JSON.stringify(NeoPixelDriver));
    NeoPixelDriver.next();
    NeoPixelDriver.setPlaylist(req.body);
};

module.exports = {
    getImagesV1,
    getPlaylistsV1,
    getPlaylistV1,
    postPlaylistV1,
    playV1
};