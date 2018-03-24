const fs = require('fs');
const path = require('path');

const config = require("./config");

module.exports = {

    getImagesV1: (req, res) => {
        fs.readdir(config.imagesFolder, (err, files) => {
            console.log(`getImagesV1 ` + JSON.stringify(files));
            res.header("Access-Control-Allow-Origin", "*");
            res.send(files);
        });
    },

    getPlaylistsV1: (req, res) => {
        fs.readdir(config.playlistFolder, (err, files) => {
            console.log(`getPlaylistsV1 ` + JSON.stringify(files));
            res.header("Access-Control-Allow-Origin", "*");
            res.send(files);
        });
    },

    getPlaylistV1: (req, res) => {
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
    },

    postPlaylistV1: (req, res) => {
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
    }
}