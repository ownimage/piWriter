const express = require('express')
const fs = require('fs');

const playlistFolder = '../library/playlists';

const app = express();

const getPlaylistsV1 = (req, res) => {
    fs.readdir(playlistFolder, (err, files) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.send(files);
    });
};


app.get('/', (req, res) => res.send('Hello World!'));

app.get('/users/:userId/books/:bookId', function (req, res) {
    res.send(req.params)
});

app.get('/v1/playlists', getPlaylistsV1);

app.listen(3000, () => console.log('Example app listening on port 3000!'));

