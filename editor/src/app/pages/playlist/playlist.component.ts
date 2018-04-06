import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {config} from '../../shared/config';
import {RepositoryService} from '../../shared/repository.service';
import {MessageModel} from '../../pageComponents/message/message.component.model';
import {Track} from '../../shared/model/track.model';

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
        this.router.routeReuseStrategy.shouldReuseRoute = function(){
            return false;
        }
    }

    playlistName: string = "";
    mode: string = "";
    icons = config.icons;
    playlist: Track[] = [];
    saveMessage = new MessageModel();

    ngOnInit() {
        this.playlistName = this.route.snapshot.params.playlistName;
        this.mode = this.route.snapshot.queryParams.mode;
        console.log('Playlist component start ' + this.playlistName);
        console.log('this.playlists 1 = ' + JSON.stringify(this.playlist));
        console.log('mode ' + this.mode);
        this.repositoryService.getPlaylistV1(this.playlistName).subscribe(data => {
            //console.log('data2 ' + JSON.stringify(data));
            console.log('this.playlists ? = ' + JSON.stringify(this.playlist));
            this.playlist = data;
            console.log('this.playlists end 0= ' + JSON.stringify(this.playlist));
        });
        console.log('this.playlists end = ' + JSON.stringify(this.playlist));
    }

    navigateAddTrack() {
        this.router.navigate(['/playlists', this.playlistName, 'addImages'], {queryParams: {mode: 'edit'}})
    }

    navigateToPlaylists() {
        this.router.navigate(['/playlists'], {queryParams: {mode: this.mode}})
    }

    save() {
        console.log('save');
        this.saveMessage.setMessage('Saving ...');
        this.repositoryService.postPlaylistV1(this.playlistName, this.playlist)
            .subscribe(
                res => {
                    console.log(`playlist/playlist.component:play repository returns ${JSON.stringify(res)}`);
                    this.saveMessage.setMessageTimeout('Save Success !!', null);
                },
                err => {
                    console.log(`playlist/playlist.component:play repository returns Error ${JSON.stringify(err)}`);
                    this.saveMessage.setMessage('');
                    this.saveMessage.setErrorTimeout('Save Failed :(', null);
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

    play() {
        console.log('play');
        if (this.isPlayMode()) this.sendPlaylist();
        else {
            this.router.navigate(['/playlists', this.playlistName], {queryParams: {mode: 'play'}});
        }
    }

    sendPlaylist() {
        console.log('sendPlaylist');
        this.saveMessage.setMessage('Sending Playlist ...');
        this.repositoryService.postPlaylistsV1({name: this.playlistName})
            .subscribe(
                res => {
                    console.log(`playlist/playlist.component:play repository returns ${JSON.stringify(res)}`);
                    this.saveMessage.setMessageTimeout('Send Playlist Success !!', null);
                },
                err => {
                    console.log(`playlist/playlist.component:play repository returns Error ${JSON.stringify(err)}`);
                    this.saveMessage.setMessage('');
                    this.saveMessage.setErrorTimeout('Send Playlist Failed :(', null);
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
