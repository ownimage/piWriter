

const debug = require('debug')('serverCommon/Playlist');
debug('### serverCommon/Playlist');

const Jimp = require('jimp');

const { Gallery } = require('./Gallery');
import {TrackDTO} from "../dto/TrackDTO";
const {rgbObject2Int} = require('../utils/ColorUtils');
const {logError} = require('../utils/common');

export class Playlist {

    // a playlist is of the format [{name: string, path: string, repeat: boolean, autostartNext: boolean }]
    // setPlaylist will take the playlist given and
    // 1) for each item in the playlist will create an entry in the global gallery.pictures object with
    //    name equal to the name of the playlist element, and
    //    timedArray which has been derrived from the image given in the playlists path element
    // 2) it will set the global playlist to the newPlaylist variable.
    // 3) it will null out the global playlistState so that next will start from the beginning
    constructor(private tracks: TrackDTO[],
                private gallery,
        ) {
        debug('serverCommon/Playlist:constructor');
        debug('tracks %o', tracks);
        debug('_tracks %o', this.tracks);
    };

    getTrackCount(): number {
        return this.tracks.length;
    };

    getTrack(i: number) {
        return this.tracks[i];
    };

    getPicture(i: number) {
        return this.gallery.get(this.getTrack(i));
    };

 };



