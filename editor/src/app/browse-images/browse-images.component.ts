import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { BrowseImagesService } from "./browse-images.service";
import {BrowsePlaylistsService} from "../browse-playlists/browse-playlists.service";

@Component({
    selector: 'app-browse-images',
    templateUrl: './browse-images.component.html',
    styleUrls: ['./browse-images.component.css'],
    providers: [ BrowseImagesService ],
})
export class BrowseImagesComponent implements OnInit {

    constructor(
        private browseImagesService: BrowseImagesService,
        private route: ActivatedRoute
    ) {}

    images:string[] = [];

    ngOnInit() {
        console.log('BrowseImages component start');
        this.browseImagesService.getImages().subscribe( data => {
            this.images = data.body;
        });
    }

    isImageSelected(image) {
        return true;
    }
}
