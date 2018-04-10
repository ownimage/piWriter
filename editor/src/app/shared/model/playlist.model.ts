import { PlaylistRepositoryService } from "../repository/PlaylistRepositoryService";
import {Track} from './track.model';

export class Playlist {

    constructor(private playlistRepository: PlaylistRepositoryService,
                private _name: string,
                private _tracks: Track[],) {
    };

    get name() {
        return this._name;
    };

    get tracks() {
        return this._tracks;
    };

    addTrack(track) {
        console.log('Playlist:addTrack');
        this._tracks.push(track);
        return true;
    };

    post() {
        console.log('Playlist:post');
        return this.playlistRepository.postPlaylistV1(this);
    };

    play() {
        console.log('Playlist:play');
        return this.playlistRepository.postPlaylistsV1(this.name);
    }

    moveUp = function (track) {
        let crntPos = this.tracks.indexOf(track);
        if (crntPos > 0) {
            this.tracks.splice(crntPos, 1);
            this.tracks.splice(crntPos - 1, 0, track);
        }
    };

    moveDown = function (track) {
        let crntPos = this.tracks.indexOf(track);
        if (crntPos < this.tracks.length) {
            this.tracks.splice(crntPos, 1);
            this.tracks.splice(crntPos + 1, 0, track);
        }
    };

    cut = function (track) {
        let crntPos = this.tracks.indexOf(track);
        if (crntPos < this.tracks.length) {
            this.tracks.splice(crntPos, 1);
        }
    };

}
