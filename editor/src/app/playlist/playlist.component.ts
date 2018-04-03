import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {RepositoryService} from "../shared/repository.service";
import {TimedMessage} from "../shared/timedMessage";
import {Track} from '../shared/model/track.model';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css'],
    providers: [RepositoryService],
})
export class PlaylistComponent implements OnInit {

    constructor(private repositoryService: RepositoryService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    playlistName: string = "";
    mode: string = "";

    playlist: Track[] = [];

    errorMessage = new TimedMessage();
    successMessage = new TimedMessage();

    ngOnInit() {
        this.playlistName = this.route.snapshot.params.playlistName;
        this.mode = this.route.snapshot.queryParams.mode;
        console.log('Playlist component start ' + this.playlistName);
        console.log("this.playlists 1 = " + JSON.stringify(this.playlist));
        console.log("mode " + this.mode);
        this.repositoryService.getPlaylistV1(this.playlistName).subscribe(data => {
            //console.log("data2 " + JSON.stringify(data));
            console.log("this.playlists ? = " + JSON.stringify(this.playlist));
            this.playlist = data;
            console.log("this.playlists end 0= " + JSON.stringify(this.playlist));
        });
        console.log("this.playlists end = " + JSON.stringify(this.playlist));
    }

    navigateAddTrack() {
        this.router.navigate(["/playlists", this.playlistName, "", "addImages"], {queryParams: {mode: "edit"}})
    }

    save() {
        console.log("save");
        this.successMessage.message = 'Sending ...';
        this.repositoryService.postPlaylistV1(this.playlistName, this.playlist)
            .subscribe(
                res => {
                    console.log(`playlist/playlist.component:play repository returns ${JSON.stringify(res)}`);
                    this.successMessage.setMessage('Success !!', null);
                },
                err => {
                    console.log(`playlist/playlist.component:play repository returns Error ${JSON.stringify(err)}`);
                    this.successMessage.message = '';
                    this.errorMessage.setMessage('Not sent :(', null);
                });
    };

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
        console.log("play");
        this.successMessage.message = 'Sending ...';
        this.repositoryService.postPlaylistsV1({name: this.playlistName})
            .subscribe(
                res => {
                    console.log(`playlist/playlist.component:play repository returns ${JSON.stringify(res)}`);
                    this.successMessage.setMessage('Success !!', null);
                },
                err => {
                    console.log(`playlist/playlist.component:play repository returns Error ${JSON.stringify(err)}`);
                    this.successMessage.message = '';
                    this.errorMessage.setMessage('Not sent :(', null);
                });
    };

    isPlayMode() {
        return this.mode == 'play';
    }

    isEditMode() {
        return !this.isPlayMode();
    }
}
