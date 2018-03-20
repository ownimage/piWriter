import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import { RepositoryService } from "../shared/repository.service";

@Component({
  selector: 'app-browse-playlists',
  templateUrl: './browse-playlists.component.html',
  styleUrls: ['./browse-playlists.component.css'],
  providers: [ RepositoryService ],
})
export class BrowsePlaylistsComponent implements OnInit {

    constructor(
        private repositoryService: RepositoryService,
        private route: ActivatedRoute
    ) {}

    playlists:string[] = [];
    mode: string = "";

    ngOnInit() {
        console.log('Playlist component start');
        this.mode = this.route.snapshot.params.mode;
        console.log("this.mode = " + this.mode);
        //this.setPlaylists("Hello world");
        console.log("this.playlists = " + JSON.stringify(this.playlists));
        this.repositoryService.getPlaylistsV1().subscribe( data => {
            //console.log("data2 " + JSON.stringify(data));
            console.log("this.playlists = " + JSON.stringify(this.playlists));
            this.playlists = data;
            console.log("this.playlists = " + JSON.stringify(this.playlists));
        });
        console.log("this.playlists = " + JSON.stringify(this.playlists));
    }

    showPlaylist(playlist) {
        console.log('showPlaylist(' +  playlist + ')');
    }
}
