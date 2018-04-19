import {PlaylistRepositoryService} from "../repository/PlaylistRepositoryService";
import {Track} from './track.model';

const debug = require('debug')('piWriter/playlist.model.ts');

export class Playlist {

    constructor(private playlistRepository: PlaylistRepositoryService,
                private _name: string,
                private _tracks: Track[],) {
        this.markDirty();
    };

    public _isClean = true;

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

    post() {
        debug('Playlist:post');
        return this.playlistRepository.postPlaylistV1(this);
    };

    save() {
        debug('Playlist:post');
        return this.playlistRepository.savePlaylistV1Sync(this);
    };

    play() {
        debug('Playlist:play');
        return this.playlistRepository.postPlaylistsPlayV1(this.name);
    }

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

    cut = function (track) {
        let crntPos = this.tracks.indexOf(track);
        if (crntPos < this.tracks.length) {
            this.markDirty();
            this.tracks.splice(crntPos, 1);
        }
    };

}
