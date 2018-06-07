import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {config} from '../../common/config';
import {PlaylistRepositoryService} from '../../common/repository/PlaylistRepositoryService';
import {MessageModel} from '../../pageComponents/message/message.component.model';
import {Playlist} from "../../../../../serverCommon/src/shared/model/playlist.model";

const debug = require('debug')('piWriter/playlist.component.ts');

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
        debug('Playlist component start %s', playlistName);
        debug('mode %s', this.mode);
        this.playlistRepositoryService.getPlaylistV1(playlistName)
            .subscribe(
                data => {
                    debug('data recieved ');
                    debug('this.playlists ? = %s', this.playlist.getDisplayName());
                    debug('size ? = %d', this.playlist.tracks.length);
                    if (data) this.playlist = data;
                    else this.playlist = this.playlistRepositoryService.createPlaylist(playlistName);
                    if (this.playlist.isDirty && this.isPlayMode()) this.infoMessage.setMessage("Can't play an unsaved Playlsit");
                },
                error => {
                    debug('data error ');
                    this.playlist = this.playlistRepositoryService.createPlaylist(playlistName);
                    this.infoMessage.setErrorTimeout('Could not load data', null);
                },
                () => {
                    debug('something else ');
                });
    }

    getTracks() {
        if (this.isPlayMode()) {
            return this.playlist.tracks.filter(t => t.enabled);
        } // else isEditMode
        return this.playlist.tracks.filter(t => {
            return this.playlist.isTrackShowing(t);
        });
    }

    navigateAddTrack() {
        this.playlistRepositoryService.savePlaylistV1Sync(this.playlist);
        this.router.navigate(['/playlists', this.playlist.name, 'addImages'], {queryParams: {mode: 'edit'}})
    }

    navigateBack() {
        if (this.isPlayMode() || this.playlist.isShowingAllTracks()) {
            this.router.navigate(['/playlists'], {queryParams: {mode: this.mode}})
        }
        this.playlist.showAllTracks();
    }

    play() {
        debug('play');
        if (this.isPlayMode()) {
            this.playlistRepositoryService.postPlaylistsPlayV1(this.playlist.name).subscribe(
                res => {
                    debug('playlist/playlist.component:play repository returns %O', res);
                    this.infoMessage.setMessageTimeout('Play Playlist Success !!');
                },
                err => {
                    debug('playlist/playlist.component:play repository returns Error %o', err);
                    this.infoMessage.setMessage('');
                    this.infoMessage.setErrorTimeout('Play Playlist Failed :(');
                });
        }
        else {
            this.router.navigate(['/playlists', this.playlist.name], {queryParams: {mode: 'play'}});
        }
    }

    edit() {
        this.router.navigate(['/playlists', this.playlist.name], {queryParams: {mode: 'edit'}});
    }

    post() {
        debug('sendPlaylist');
        this.infoMessage.setMessage('Sending Playlist ...');
        this.playlistRepositoryService.postPlaylistV1(this.playlist)
            .subscribe(
                res => {
                    debug('playlist/playlist.component:save repository returns %O', res);
                    this.infoMessage.setMessageTimeout('Send Playlist Success !!');
                },
                err => {
                    debug('playlist/playlist.component:save repository returns Error %o', err);
                    this.infoMessage.setMessage('');
                    this.infoMessage.setErrorTimeout('Send Playlist Failed :(');
                });
    }
    ;

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
