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

    messages: string[] = ["", ""];

    constructor(private repositoryService: RepositoryService) {
    }

    ngOnInit() {
    }

    addPlaylist(name: string) {
        console.log("nameChange " + JSON.stringify(name));
        if (!name) {
            this.messages = ["", "Cannot save empty name."];
            return;
        }
        if (!name.endsWith(".json")) {
            name = name + ".json";
        }
        this.repositoryService.playlistExists(name).subscribe(
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
