import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from "@angular/forms";
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TrackComponent } from './track/track.component';
import { BrowsePlaylistsComponent } from './browse-playlists/browse-playlists.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { HomeComponent } from './home/home.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { BrowseImagesComponent } from './browse-images/browse-images.component';
import { AddPlaylistComponent } from './add-playlist/add-playlist.component';


const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'images', component: BrowseImagesComponent},
    { path: 'playlists/create', component: AddPlaylistComponent},
    { path: 'playlists', component: BrowsePlaylistsComponent},
    { path: 'playlists/:playlistName', component: PlaylistComponent},
    { path: 'playlists/:playlistName/addImages', component: BrowseImagesComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    TrackComponent,
    BrowsePlaylistsComponent,
    PlaylistComponent,
    HomeComponent,
    CheckboxComponent,
    BrowseImagesComponent,
    AddPlaylistComponent
  ],
  imports: [
      HttpClientModule,
      FormsModule,
      NgbModule.forRoot(),
      BrowserModule,
      RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
