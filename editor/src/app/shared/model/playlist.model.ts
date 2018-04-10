import { PlaylistRepositoryService } from "../repository/PlaylistRepositoryService";
import {Track} from './track.model';

export class Playlist {

    constructor(private playlistRepository: PlaylistRepositoryService,
                private _name: string,
                private _tracks: Track[],) {
    };

    public _isClean = true;

    get name() {
        return this._name;
    };

    get tracks() {
        return this._tracks;
    };

    get isClean() {
        return this._isClean;
    };

    get isDirty() {
        return !this._isClean;
    };

    markDirty() {
        this._isClean = false;
    }

    markClean() {
        this._isClean = true;
    }

    addTrack(track) {
        console.log('Playlist:addTrack');
        this.markDirty();
        this._tracks.push(track);
        return true;
    };

    post() {
        console.log('Playlist:post');
        this.markClean();
        return this.playlistRepository.postPlaylistV1(this);
    };

    play() {
        console.log('Playlist:play');
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
