import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TrackComponent } from './track/track.component';
import { EditPlaylistComponent } from './edit-playlist/edit-playlist.component';
import { BrowsePlaylistsComponent } from './browse-playlists/browse-playlists.component';


@NgModule({
  declarations: [
    AppComponent,
    TrackComponent,
    EditPlaylistComponent,
    BrowsePlaylistsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
