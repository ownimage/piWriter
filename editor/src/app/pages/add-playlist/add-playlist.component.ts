import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {config} from "../../shared/config";
import {PlaylistRepositoryService} from '../../shared/repository/PlaylistRepositoryService';
import {Playlist} from "../../shared/model/playlist.model";

@Component({
    selector: 'app-add-playlist',
    templateUrl: './add-playlist.component.html',
    styleUrls: ['./add-playlist.component.css'],
    providers: [PlaylistRepositoryService],
})
export class AddPlaylistComponent implements OnInit {

    name: string;
    messages: string[] = ["", ""];
    icons = config.icons;

    constructor(private playlistRepositoryService: PlaylistRepositoryService,
                private router: Router) {
    }

    ngOnInit() {
    }

    addPlaylist() {
        console.log("addPlaylist " + JSON.stringify(this.name));
        if (!this.name) {
            this.messages = ["", "Cannot save empty name."];
            return;
        }
        if (!this.name.endsWith(".json")) {
            this.name = this.name + ".json";
            this.messages = ["", "Name changed, please check and press 'Add'."];
            return;
        }
        this.playlistRepositoryService.playlistExistsV1(this.name).subscribe(
            exists => {
                if (exists) {
                    this.messages = ["", "Sorry, that name already exists."];
                }
                else {
                    this.messages = ["Saving ...", ""];
                    let playlist = this.playlistRepositoryService.createPlaylist(this.name);
                    playlist.post();
                    this.messages = ["", ""];
                    this.router.navigate(["/playlists", this.name], {queryParams: {mode: "edit"}});
                }
            }
        );
    }

    navigateToHome() {
        this.router.navigate(['/']);
    }

}
