import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {config} from '../../shared/config';
import {RepositoryService} from '../../shared/repository.service';
import {MessageModel} from '../../pageComponents/message/message.component.model';
import {Playlist} from "../../shared/model/playlist.model";

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
        this.playlist = new Playlist(this.repositoryService, playlistName, []);
        this.mode = this.route.snapshot.queryParams.mode;
        console.log('Playlist component start ' + playlistName);
        //console.log('this.playlist = ' + JSON.stringify(this.playlist));
        console.log('mode ' + this.mode);
        this.repositoryService.getPlaylistV1(playlistName)
            .subscribe(
                data => {
                    //console.log('data2 ' + JSON.stringify(data));
                    //console.log('this.playlists ? = ' + JSON.stringify(this.playlist));
                    this.playlist = data;
                    //console.log('this.playlists end 0= ' + JSON.stringify(this.playlist));
                },
                error => {
                    this.infoMessage.setErrorTimeout('Could not load data', null);
                });
        //console.log('this.playlists end = ' + JSON.stringify(this.playlist));
    }

    navigateAddTrack() {
        this.router.navigate(['/playlists', this.playlist.getName(), 'addImages'], {queryParams: {mode: 'edit'}})
    }

    navigateToPlaylists() {
        this.router.navigate(['/playlists'], {queryParams: {mode: this.mode}})
    }

    save() {
        console.log('save');
        this.infoMessage.setMessage('Saving ...');
        this.playlist.save()
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

    moveUp = function (track) { this.playlist.moveUp(track) };

    moveDown = function (track) { this.playlist.moveDown(track) };

    cut = function (track) { this.playlist.cut(track) };

    play() {
        console.log('play');
        if (this.isPlayMode()) this.sendPlaylist();
        else {
            this.router.navigate(['/playlists', this.playlist.getName()], {queryParams: {mode: 'play'}});
        }
    }

    sendPlaylist() {
        console.log('sendPlaylist');
        this.infoMessage.setMessage('Sending Playlist ...');
        this.playlist.sendPlaylist()
            .subscribe(
                res => {
                    console.log(`playlist/playlist.component:play repository returns ${JSON.stringify(res)}`);
                    this.infoMessage.setMessageTimeout('Send Playlist Success !!', null);
                },
                err => {
                    console.log(`playlist/playlist.component:play repository returns Error ${JSON.stringify(err)}`);
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
        return 'Edit';
    }
}
