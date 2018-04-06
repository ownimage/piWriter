import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {TrackComponent} from './pageComponents/track/track.component';
import {BrowsePlaylistsComponent} from './pages/browse-playlists/browse-playlists.component';
import {PlaylistComponent} from './pages/playlist/playlist.component';
import {HomeComponent} from './pages/home/home.component';
import {CheckboxComponent} from './pageComponents/checkbox/checkbox.component';
import {AddPlaylistComponent} from './pages/add-playlist/add-playlist.component';
import {AddImagesComponent} from './pages/add-images/add-images.component';
import { HeaderComponent } from './pageComponents/header/header.component';


const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'playlists', component: BrowsePlaylistsComponent},
    {path: 'playlists/create', component: AddPlaylistComponent},
    {path: 'playlists/:playlistName', component: PlaylistComponent},
    {path: 'playlists/:playlistName/addImages', component: AddImagesComponent},
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
        AddImagesComponent,
        HeaderComponent,

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
