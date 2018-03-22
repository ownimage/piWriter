import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {RepositoryService} from "../shared/repository.service";

@Component({
    selector: 'app-add-playlist',
    templateUrl: './add-playlist.component.html',
    styleUrls: ['./add-playlist.component.css'],
    providers: [RepositoryService],
})
export class AddPlaylistComponent implements OnInit {

    name: string;
    messages: string[] = ["", ""];

    constructor(private repositoryService: RepositoryService,
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
        this.repositoryService.playlistExistsV1(this.name).subscribe(
            exists => {
                if (exists) {
                    this.messages = ["", "Sorry, that name already exists."];
                }
                else {
                    this.messages = ["Saving ...", ""];
                    this.repositoryService.cachePlaylistV1(this.name, []).subscribe(
                        () => {
                            this.messages = ["", ""];
                            this.router.navigate(["/playlists", this.name], {queryParams: {mode: "edit"}});
                        }
                    )
                }
            }
        );
    }

}
