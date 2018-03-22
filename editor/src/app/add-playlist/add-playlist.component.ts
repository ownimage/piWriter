import {Component, OnInit} from '@angular/core';
import {RepositoryService} from "../shared/repository.service";

import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-add-playlist',
    templateUrl: './add-playlist.component.html',
    styleUrls: ['./add-playlist.component.css'],
    providers: [RepositoryService],
})
export class AddPlaylistComponent implements OnInit {

    name: string;
    messages: string[] = ["", ""];

    constructor(private repositoryService: RepositoryService) {
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
        this.repositoryService.playlistExists(this.name).subscribe(
            exists => {
                if (exists) {
                    this.messages = ["", "Sorry, that name already exists."];
                }
                else {
                    this.messages = ["Saving ...", ""];
                }
            }
        );
    }

}
