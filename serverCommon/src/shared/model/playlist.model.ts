import {Track} from './track.model';
import {trackToTrackDTO} from "../mappers/trackToTrackDTO.mapper";

const debug = require('debug')('piWriter/playlist.model.ts');

export class Playlist {

    constructor(private _name: string,
                private _tracks: Track[],) {
        this.markDirty();
    };

    private _isClean = true;
    private _showTrack: Track = null;

    get name() {
        return this._name;
    };

    get tracks() {
        return this._tracks;
    };

    get isClean(): boolean {
        return this._isClean;
    };

    get isDirty(): boolean {
        return !this._isClean;
    };

    getDisplayName() {
        if (this.isDirty) return "*" + this._name;
        return this.name;
    }

    markDirty() {
        this._isClean = false;
    }

    markClean() {
        this._isClean = true;
    }

    addTrack(track) {
        debug('Playlist:addTrack');
        this.markDirty();
        this._tracks.push(track);
        return true;
    };

    getPrevious = function (track) {
        let crntPos = this.tracks.indexOf(track);
        if (crntPos > 0) {
            return this.tracks[crntPos-1];
        }
    };

    moveUp = function (track) {
        let crntPos = this.tracks.indexOf(track);
        if (crntPos > 0) {
            this.markDirty();
            this.tracks.splice(crntPos, 1);
            this.tracks.splice(crntPos - 1, 0, track);
        }
    };

    moveDown = function (track) {
        let crntPos = this.tracks.indexOf(track);
        if (crntPos < this.tracks.length) {
            this.markDirty();
            this.tracks.splice(crntPos, 1);
            this.tracks.splice(crntPos + 1, 0, track);
        }
    };

    duplicate(track: Track) {
        let crntPos = this.tracks.indexOf(track);
        let duplicate = track.clone()
        this.tracks.splice(crntPos, 0, duplicate);
    }

    cut = function (track) {
        let crntPos = this.tracks.indexOf(track);
        if (crntPos < this.tracks.length) {
            this.markDirty();
            this.tracks.splice(crntPos, 1);
        }
    };

    setShowTrack = function (track: Track) {
        this._showTrack = track;
    };

    getShowTrack = function () {
        return this._showTrack;
    };

    showAllTracks() {
        this._showTrack = null;
    };

    isTrackShowing(track: Track) {
        if (debug.enabled) {
            debug('Playlist:isTrackShowing %o', trackToTrackDTO(track));
        }
        return this._showTrack == null || this._showTrack == track;
    }

    isShowingAllTracks() {
        return this._showTrack == null;
    }

}