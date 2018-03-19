import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PlaylistService } from './playlist.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
  providers: [ PlaylistService ],
})
export class PlaylistComponent implements OnInit{

  constructor(
      private playlistService: PlaylistService,
      private route: ActivatedRoute
  ) {}

  playlists:string[] = [];

  ngOnInit() {
      console.log('Playlist component start ' + this.route.snapshot.params.playlist);
      //this.setPlaylists("Hello world");
      console.log("this.playlists = " + JSON.stringify(this.playlists));
      this.playlistService.getPlaylists1().subscribe( data => {
          //console.log("data2 " + JSON.stringify(data));
          console.log("this.playlists = " + JSON.stringify(this.playlists));
          this.playlists = data.body;
          console.log("this.playlists = " + JSON.stringify(this.playlists));
      });
      console.log("this.playlists = " + JSON.stringify(this.playlists));
  }

}
