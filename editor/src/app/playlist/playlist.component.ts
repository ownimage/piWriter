import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {RepositoryService} from "../shared/repository.service";
import {TimedMessage} from "../shared/timedMessage";
import {Track} from '../shared/track.model';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css'],
    providers: [RepositoryService],
})
export class PlaylistComponent implements OnInit {

    constructor(private repositoryService: RepositoryService,
                private route: ActivatedRoute) {
    }

    name: string = "";
    mode: string = "";

    playlist: Track[] = [];
    show: string = "showPlaylist";

    errorMessage = new TimedMessage();
    successMessage = new TimedMessage();

    ngOnInit() {
        this.name = this.route.snapshot.params.playlist;
        this.mode = this.route.snapshot.queryParams.mode;
        console.log('Playlist component start ' + this.name);
        console.log("this.playlists 1 = " + JSON.stringify(this.playlist));
        console.log("mode " + this.mode);
        this.repositoryService.getPlaylistV1(this.name).subscribe(data => {
            //console.log("data2 " + JSON.stringify(data));
            console.log("this.playlists ? = " + JSON.stringify(this.playlist));
            this.playlist = data;
            console.log("this.playlists end 0= " + JSON.stringify(this.playlist));
        });
        console.log("this.playlists end = " + JSON.stringify(this.playlist));
    }

    addTracks(data) {
        console.log(`addTracks ` + JSON.stringify(data));
        data.map(i => new Track(i, i, false, false))
            .map(t => this.playlist.push(t));
        this.show = "showPlaylist";
    }

    showPlaylist() {
        return this.show == "showPlaylist";
    }

    showAddTrack() {
        return !this.showPlaylist();
    }

    save() {
        console.log("save");
        this.repositoryService.postPlaylistV1(this.name, this.playlist);
    }

    moveUp = function (item) {
        let crntPos = this.playlist.indexOf(item);
        if (crntPos > 0) {
            this.playlist.splice(crntPos, 1);
            this.playlist.splice(crntPos - 1, 0, item);
        }
    };

    moveDown = function (item) {
        let crntPos = this.playlist.indexOf(item);
        if (crntPos < this.playlist.length) {
            this.playlist.splice(crntPos, 1);
            this.playlist.splice(crntPos + 1, 0, item);
        }
    };

    cut = function (item) {
        let crntPos = this.playlist.indexOf(item);
        if (crntPos < this.playlist.length) {
            this.playlist.splice(crntPos, 1);
        }
    };

    play = function () {
        this.successMessage.message = 'Sending ...';
        this.repositoryService.postPlaylistsV1({name: this.name})
            .subscribe(
                res => {
                    console.log(`playlist/playlist.component:play repository returns ${JSON.stringify(res)}`);
                    this.successMessage.setMessage('Success !!');
                },
                err => {
                    console.log(`playlist/playlist.component:play repository returns Error ${JSON.stringify(err)}`);
                    this.successMessage.message = '';
                    this.errorMessage.setMessage('Not sent :(');
                });
    };

    isPlayMode() {
        return this.mode == 'play';
    }

    isEditMode() {
        return !this.isPlayMode();
    }
}
