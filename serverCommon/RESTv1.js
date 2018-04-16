console.log('### serverCommon/RESTv1');

const fs = require('fs');
const path = require('path');
const NeoPixelDriver = require('./NeoPixelDriver');

const {config} = require('./config');
const {logError} = require('./common');

const getPlaylistsV1 = (req, res) => {
    try {
        console.log('serverCommon/RESTv1:getPlaylistsV1');
        fs.readdir(config.playlistFolder, (err, files) => {
            console.log(`getPlaylistsV1 ` + JSON.stringify(files));
            res.header('Access-Control-Allow-Origin', '*');
            res.send(files);
        });
    } catch (e) {
        logError(e);
    }
};

const getPlaylistV1 = (req, res) => {
    try {
        console.log('serverCommon/RESTv1:getPlaylistV1');
        console.log(req.params.playlistName);
        const playlistName = req.params.playlistName;
        const filePath = path.join(config.playlistFolder, playlistName);
        fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
            res.header('Access-Control-Allow-Origin', '*');
            if (!err) {
                console.log('received data: ' + data);
                res.header('Access-Control-Allow-Origin', '*');
                res.send(data);
            } else {
                console.log(err);
                if (err.errno == -4058) { //no such file or directory
                    res.sendStatus(404);
                }
                else {
                    res.sendStatus(500);
                }
            }
        });
    } catch (e) {
        logError(e);
    }
};

const postPlaylistV1 = (req, res) => {
    try {
        console.log('serverCommon/RESTv1:postPlaylistV1');
        console.log(req.params.playlistName);
        console.log('req.body =' + JSON.stringify(req.body));
        const playlistName = req.params.playlistName;
        const filePath = path.join(config.playlistFolder, playlistName);
        fs.writeFile(filePath, JSON.stringify(req.body, null, 2), function (err) {
            if (!err) {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Content-Type', 'text/plain');
                res.end();
            } else {
                logError(err);
                res.sendStatus(500);
            }
        });
    } catch (e) {
        logError(e);
    }
};

const postPlaylistsPlayV1 = (req, res) => {
    try {
        console.log('serverCommon/RESTv1:postPlaylistsPlayV1');
        const playlistName = req.params.playlistName;

        const filePath = path.join(config.playlistFolder, playlistName);
        fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
            if (!err) {
                console.log('received data: ' + data);
                NeoPixelDriver.setPlaylist(JSON.parse(data).tracks);
                res.header('Access-Control-Allow-Origin', '*');
                res.send({result: 'OK'});
            } else {
                console.log(err);
            }
        });
    } catch (e) {
        logError(e);
    }
};

module.exports = {
    getPlaylistsV1,
    getPlaylistV1,
    postPlaylistV1,
    postPlaylistsPlayV1
};