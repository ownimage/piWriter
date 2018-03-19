const express = require('express')
const fs = require('fs');
const path = require('path');

const imagesFolder = '../library/images';
const playlistFolder = '../library/playlists';

const app = express();

const getImagesV1 = (req, res) => {
    fs.readdir(imagesFolder, (err, files) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.send(files);
    });
};

const getPlaylistsV1 = (req, res) => {
    fs.readdir(playlistFolder, (err, files) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.send(files);
    });
};

const getPlaylistV1 = (req, res) => {
    console.log(req.params.playlist);
    const playlist = req.params.playlist;
    const filePath = path.join(playlistFolder, playlist);
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            console.log('received data: ' + data);
            res.header("Access-Control-Allow-Origin", "*");
            res.send(data);
        } else {
            console.log(err);
        }
    });
}


app.get('/', (req, res) => res.send('Hello World!'));
app.use('/images', express.static(imagesFolder));
app.get('/v1/images', getImagesV1);
app.get('/v1/playlists', getPlaylistsV1);
app.get('/v1/playlists/:playlist', getPlaylistV1);

app.listen(3000, () => console.log('Example app listening on port 3000!'));

