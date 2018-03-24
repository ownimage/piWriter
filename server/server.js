const express = require('express')
const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser");

const appFolder = '../editor/dist';
const imagesFolder = '../library/images';
const playlistFolder = '../library/playlists';

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//following form http://johnzhang.io/options-request-in-express
app.options("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

const getImagesV1 = (req, res) => {
    fs.readdir(imagesFolder, (err, files) => {
        console.log(`getImagesV1 ` + JSON.stringify(files));
        res.header("Access-Control-Allow-Origin", "*");
        res.send(files);
    });
};

const getPlaylistsV1 = (req, res) => {
    fs.readdir(playlistFolder, (err, files) => {
        console.log(`getPlaylistsV1 ` + JSON.stringify(files));
        res.header("Access-Control-Allow-Origin", "*");
        res.send(files);
    });
};

const getPlaylistV1 = (req, res) => {
    console.log(req.params.playlist);
    const playlist = req.params.playlist;
    const filePath = path.join(playlistFolder, playlist);
    fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
        if (!err) {
            console.log('received data: ' + data);
            res.header("Access-Control-Allow-Origin", "*");
            res.send(data);
        } else {
            console.log(err);
        }
    });
}

const postPlaylistV1 = (req, res) => {
    console.log(req.params.playlist);
    console.log("req.body =" + JSON.stringify(req.body));
    const playlist = req.params.playlist;
    const filePath = path.join(playlistFolder, playlist);
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

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/app', express.static(appFolder));
app.use('/images', express.static(imagesFolder));
app.get('/v1/images', getImagesV1);
app.get('/v1/playlists', getPlaylistsV1);
app.get('/v1/playlists/:playlist', getPlaylistV1);
app.post('/v1/playlists/:playlist', postPlaylistV1);

app.listen(3000, () => console.log('Example app listening on port 3000!'));

