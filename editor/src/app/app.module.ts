import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { TrackComponent } from './track/track.component';
import { BrowsePlaylistsComponent } from './browse-playlists/browse-playlists.component';
import { PlaylistComponent } from './playlist/playlist.component';


@NgModule({
  declarations: [
    AppComponent,
    TrackComponent,
    BrowsePlaylistsComponent,
    PlaylistComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
