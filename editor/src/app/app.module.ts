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
import { SettingsComponent } from './pages/settings/settings.component';
import { MessageComponent } from './pageComponents/message/message.component';
import { SliderComponent } from './pageComponents/slider/slider.component';
import { ImageComponent } from './pageComponents/image/image.component';
import { ServerInfoComponent } from './pages/server-info/server-info.component';
import { NumberToXbPipe } from './common/pipes/number-to-xb.pipe';
import { DecimalToPercentagePipe } from './common/pipes/decimal-to-percentage.pipe';


const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'settings', component: SettingsComponent},
    {path: 'serverInfo', component: ServerInfoComponent},
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
        SettingsComponent,
        MessageComponent,
        SliderComponent,
        ImageComponent,
        ServerInfoComponent,
        NumberToXbPipe,
        DecimalToPercentagePipe,
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
