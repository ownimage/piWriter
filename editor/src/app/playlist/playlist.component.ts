import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RepositoryService } from "../shared/repository.service";
import { Track } from '../shared/track.model';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
  providers: [ RepositoryService ],
})
export class PlaylistComponent implements OnInit{

  constructor(
      private repositoryService: RepositoryService,
      private route: ActivatedRoute
  ) {}

  name: string = "";
  playlist: Track[] = [];
  mode: string = "showPlaylist";

  ngOnInit() {
      this.name = this.route.snapshot.params.playlist;
      console.log('Playlist component start ' + this.name);
      //this.setPlaylists("Hello world");
      console.log("this.playlists 1 = " + JSON.stringify(this.playlist));
      this.repositoryService.getPlaylistV1(this.name).subscribe( data => {
          //console.log("data2 " + JSON.stringify(data));
          console.log("this.playlists ? = " + JSON.stringify(this.playlist));
          this.playlist = data;
          console.log("this.playlists end 0= " + JSON.stringify(this.playlist));
      });
      console.log("this.playlists end = " + JSON.stringify(this.playlist));
  }

  addTracks(data) {
    console.log(`addTracks ` + JSON.stringify(data));
    data.map( i => new Track(i, i, false, false))
        .map( t => this.playlist.push(t));
    this.mode = "showPlaylist";
  }

  showAddTrack() {
    this.mode = "addTrack";
  }
  modeShowPlaylist() {
      return this.mode == "showPlaylist";
  }
  modeAddTrack() {
      return !this.modeShowPlaylist();
  }

  save() {
      console.log("save");
  }

}
