import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {config} from "../../shared/config";
import {PlaylistRepositoryService} from '../../shared/repository/PlaylistRepositoryService';
import {Playlist} from "../../shared/model/playlist.model";
import {MessageModel} from "../../pageComponents/message/message.component.model";

@Component({
    selector: 'app-add-playlist',
    templateUrl: './add-playlist.component.html',
    styleUrls: ['./add-playlist.component.css'],
    providers: [PlaylistRepositoryService],
})
export class AddPlaylistComponent implements OnInit {

    name: string;
    infoMessage = new MessageModel();
    icons = config.icons;

    constructor(private playlistRepositoryService: PlaylistRepositoryService,
                private router: Router) {
    }

    ngOnInit() {
    }

    addPlaylist() {
        console.log("addPlaylist " + JSON.stringify(this.name));
        this.infoMessage.clearAll();
        if (!this.name) {
            this.infoMessage.setErrorTimeout('Cannot save empty name.');
            return;
        }
        if (!this.name.endsWith(".json")) {
            this.name = this.name + ".json";
            this.infoMessage.setErrorTimeout('Name changed, please check and press "Add".');
            return;
        }
        this.playlistRepositoryService.playlistExistsV1(this.name).subscribe(
            exists => {
                if (exists) {
                    this.infoMessage.setError('Sorry, that name already exists.');
                }
                else {
                    this.infoMessage.setMessage('Saving ...');
                    let playlist = this.playlistRepositoryService.createPlaylist(this.name);
                    playlist.post();
                    this.infoMessage.clearMessage();
                    this.router.navigate(["/playlists", this.name], {queryParams: {mode: "edit"}});
                }
            }
        );
    }

    navigateToHome() {
        this.router.navigate(['/']);
    }

}
