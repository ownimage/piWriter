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

  playlist: string = "";

  ngOnInit() {
      let playlist = this.route.snapshot.params.playlist;
      console.log('Playlist component start ' + playlist);
      //this.setPlaylists("Hello world");
      console.log("this.playlists 1 = " + JSON.stringify(this.playlist));
      this.playlistService.getPlaylist(playlist).subscribe( data => {
          //console.log("data2 " + JSON.stringify(data));
          console.log("this.playlists ? = " + JSON.stringify(this.playlist));
          this.playlist = data.body;
          console.log("this.playlists end 0= " + JSON.stringify(this.playlist));
      });
      console.log("this.playlists end = " + JSON.stringify(this.playlist));
  }

}
