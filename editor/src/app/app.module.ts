import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {TrackComponent} from './track/track.component';
import {BrowsePlaylistsComponent} from './browse-playlists/browse-playlists.component';
import {PlaylistComponent} from './playlist/playlist.component';
import {HomeComponent} from './home/home.component';
import {CheckboxComponent} from './checkbox/checkbox.component';
import {AddPlaylistComponent} from './add-playlist/add-playlist.component';
import {BrowseDirectoryImagesComponent} from './browse-directory-images/browse-directory-images.component';


const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'playlists/create', component: AddPlaylistComponent},
    {path: 'playlists', component: BrowsePlaylistsComponent},
    {path: 'playlists/:playlistName', component: PlaylistComponent},
    {path: 'playlists/:playlistName/addImages', component: BrowseDirectoryImagesComponent},
];

@NgModule({
    declarations: [
        AppComponent,
        TrackComponent,
        BrowsePlaylistsComponent,
        PlaylistComponent,
        HomeComponent,
        CheckboxComponent,
        AddPlaylistComponent,
        BrowseDirectoryImagesComponent,

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

export class AppModule {
}
