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
                    if (this.playlist.isDirty && this.isPlayMode()) this.infoMessage.setMessage("Can't play an unsaved Playlsit");
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
        this.playlist.save();
        this.router.navigate(['/playlists', this.playlist.name, 'addImages'], {queryParams: {mode: 'edit'}})
    }

    navigateToPlaylists() {
        this.router.navigate(['/playlists'], {queryParams: {mode: this.mode}})
    }

    play() {
        console.log('play');
        if (this.isPlayMode()) {
            this.playlist.play().subscribe(
                res => {
                    console.log(`playlist/playlist.component:play repository returns ${JSON.stringify(res)}`);
                    this.infoMessage.setMessageTimeout('Play Playlist Success !!');
                },
                err => {
                    console.log(`playlist/playlist.component:play repository returns Error ${JSON.stringify(err)}`);
                    this.infoMessage.setMessage('');
                    this.infoMessage.setErrorTimeout('Play Playlist Failed :(');
                });
        }
        else {
            this.router.navigate(['/playlists', this.playlist.name], {queryParams: {mode: 'play'}});
        }
    }

    post() {
        console.log('sendPlaylist');
        this.infoMessage.setMessage('Sending Playlist ...');
        this.playlist.post()
            .subscribe(
                res => {
                    console.log(`playlist/playlist.component:save repository returns ${JSON.stringify(res)}`);
                    this.infoMessage.setMessageTimeout('Send Playlist Success !!');
                },
                err => {
                    console.log(`playlist/playlist.component:save repository returns Error ${JSON.stringify(err)}`);
                    this.infoMessage.setMessage('');
                    this.infoMessage.setErrorTimeout('Send Playlist Failed :(');
                });
    };

    isPlayMode() {
        return this.mode == 'play';
    }

    isEditMode() {
        return !this.isPlayMode();
    }

    getDisplayName() {
        return (this.isPlayMode() ? 'Play ' : ' Edit ') + this.playlist.getDisplayName();
    }

    getPlayLabel() {
        if (this.isPlayMode()) return 'Play';
        return "Goto Play";
    }
}
