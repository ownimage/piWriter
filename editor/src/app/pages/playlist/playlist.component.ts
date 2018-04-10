import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {config} from '../../shared/config';
import {PlaylistRepositoryService} from '../../shared/repository/PlaylistRepositoryService';
import {MessageModel} from '../../pageComponents/message/message.component.model';
import {Playlist} from "../../shared/model/playlist.model";

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css'],
    providers: [PlaylistRepositoryService],
})
export class PlaylistComponent implements OnInit {

    constructor(private playlistRepositoryService: PlaylistRepositoryService,
                private route: ActivatedRoute,
                private router: Router) {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        }
    }

    mode: string = "";
    icons = config.icons;
    playlist: Playlist;
    infoMessage = new MessageModel();

    ngOnInit() {
        let playlistName = this.route.snapshot.params.playlistName;
        this.playlist = this.playlistRepositoryService.createPlaylist(playlistName);
        this.mode = this.route.snapshot.queryParams.mode;
        console.log('Playlist component start ' + playlistName);
        //console.log('this.playlist = ' + JSON.stringify(this.playlist));
        console.log('mode ' + this.mode);
        this.playlistRepositoryService.getPlaylistV1(playlistName)
            .subscribe(
                data => {
                    console.log('data recieved ');
                    //console.log('this.playlists ? = ' + JSON.stringify(this.playlist));
                    if (data) this.playlist = data;
                    else this.playlist = this.playlistRepositoryService.createPlaylist(playlistName);
                    //console.log('this.playlists end 0= ' + JSON.stringify(this.playlist));
                },
                error => {
                    console.log('data error ');
                    this.playlist = this.playlistRepositoryService.createPlaylist(playlistName);
                    this.infoMessage.setErrorTimeout('Could not load data', null);
                },
                () => {
                    console.log('something else ');
                });
        //console.log('this.playlists end = ' + JSON.stringify(this.playlist));
    }

    navigateAddTrack() {
        this.playlist.post();
        this.router.navigate(['/playlists', this.playlist.name, 'addImages'], {queryParams: {mode: 'edit'}})
    }

    navigateToPlaylists() {
        this.router.navigate(['/playlists'], {queryParams: {mode: this.mode}})
    }

    post() {
        console.log('save');
        this.infoMessage.setMessage('Saving ...');
        this.playlistRepositoryService.postPlaylistV1(this)
            .subscribe(
                res => {
                    console.log(`playlist/playlist.component:play repository returns ${JSON.stringify(res)}`);
                    this.infoMessage.setMessageTimeout('Save Success !!', null);
                },
                err => {
                    console.log(`playlist/playlist.component:play repository returns Error ${JSON.stringify(err)}`);
                    this.infoMessage.setMessage('');
                    this.infoMessage.setErrorTimeout('Save Failed :(', null);
                });
    };

    moveUp = function (track) {
        this.playlist.moveUp(track)
    };

    moveDown = function (track) {
        this.playlist.moveDown(track)
    };

    cut = function (track) {
        this.playlist.cut(track)
    };

    play() {
        console.log('play');
        if (this.isPlayMode()) {
            this.playlist.play().subscribe(
                res => {
                    console.log(`playlist/playlist.component:play repository returns ${JSON.stringify(res)}`);
                    this.infoMessage.setMessageTimeout('Play Playlist Success !!', null);
                },
                err => {
                    console.log(`playlist/playlist.component:play repository returns Error ${JSON.stringify(err)}`);
                    this.infoMessage.setMessage('');
                    this.infoMessage.setErrorTimeout('Play Playlist Failed :(', null);
                });
        }
        else {
            this.router.navigate(['/playlists', this.playlist.name], {queryParams: {mode: 'play'}});
        }
    }

    save() {
        console.log('sendPlaylist');
        this.infoMessage.setMessage('Sending Playlist ...');
        this.playlist.post()
            .subscribe(
                res => {
                    console.log(`playlist/playlist.component:save repository returns ${JSON.stringify(res)}`);
                    this.infoMessage.setMessageTimeout('Send Playlist Success !!', null);
                },
                err => {
                    console.log(`playlist/playlist.component:save repository returns Error ${JSON.stringify(err)}`);
                    this.infoMessage.setMessage('');
                    this.infoMessage.setErrorTimeout('Send Playlist Failed :(', null);
                });
    };

    isPlayMode() {
        return this.mode == 'play';
    }

    isEditMode() {
        return !this.isPlayMode();
    }

    getModeDisplay() {
        if (this.isPlayMode()) return 'Play';
        if (this.playlist.isClean)        return 'Edit';
        return "*Edit";
    }

    getPlayLabel() {
        if (this.isPlayMode()) return 'Play';
        return "Goto Play";
    }
}
