import {Track} from './track.model';
import {RepositoryService} from "../repository.service";

export class Playlist {
    constructor(private repositoryService: RepositoryService,
                private playlistName: string,
                private tracks: Track[],) {
    }

    getName() {
        return this.playlistName;
    };

    getTracks() {
        return this.tracks;
    };

    addTrack(track) {
        this.tracks.push(track);
    };

    save() {
        console.log('save');
        return this.repositoryService.postPlaylistV1(this.playlistName, this.tracks);
    };

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

    sendPlaylist() {
        console.log('sendPlaylist');
        return this.repositoryService.postPlaylistsV1({name: this.playlistName});
    };
}
