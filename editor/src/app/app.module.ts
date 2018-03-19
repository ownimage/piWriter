import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TrackComponent } from './track/track.component';
import { BrowsePlaylistsComponent } from './browse-playlists/browse-playlists.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'playlists', component: BrowsePlaylistsComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    TrackComponent,
    BrowsePlaylistsComponent,
    PlaylistComponent,
    HomeComponent
  ],
  imports: [
      HttpClientModule,
      NgbModule.forRoot(),
      BrowserModule,
      RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
