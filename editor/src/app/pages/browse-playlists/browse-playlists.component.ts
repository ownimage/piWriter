import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {config} from '../../shared/config';
import {PlaylistRepositoryService} from "../../shared/repository/PlaylistRepositoryService";

@Component({
  selector: 'app-browse-playlists',
  templateUrl: './browse-playlists.component.html',
  styleUrls: ['./browse-playlists.component.css'],
  providers: [ PlaylistRepositoryService ],
})
export class BrowsePlaylistsComponent implements OnInit {

    constructor(
        private repositoryService: PlaylistRepositoryService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    playlists:string[] = [];
    mode: string = "";
    icons = config.icons;

    ngOnInit() {
        console.log('Playlist component start');
        this.mode = this.route.snapshot.queryParams.mode;
        console.log('this.mode = ' + this.mode);
        //this.setPlaylists('Hello world');
        console.log('this.playlists = ' + JSON.stringify(this.playlists));
        this.repositoryService.getPlaylistsV1().subscribe( data => {
            //console.log('data2 ' + JSON.stringify(data));
            console.log('this.playlists = ' + JSON.stringify(this.playlists));
            this.playlists = data;
            console.log('this.playlists = ' + JSON.stringify(this.playlists));
        });
        console.log('this.playlists = ' + JSON.stringify(this.playlists));
    }

    showPlaylist(playlist) {
        console.log('showPlaylist(' +  playlist + ')');
    }

    getModeDisplayText() {
        if (this.mode =='edit') return 'Edit Playlist ...';
        return 'Play Playlist ...';
    }
    navigateToHome() {
        this.router.navigate(['/']);
    }

}
