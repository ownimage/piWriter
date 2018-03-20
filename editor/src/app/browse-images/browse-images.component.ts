import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { BrowseImagesService } from "./browse-images.service";

@Component({
    selector: 'app-browse-images',
    templateUrl: './browse-images.component.html',
    styleUrls: ['./browse-images.component.css'],
    providers: [ BrowseImagesService ],
})
export class BrowseImagesComponent implements OnInit {

    images:{name: string, selected: boolean}[] = [];

    constructor(
        private browseImagesService: BrowseImagesService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        console.log('BrowseImages component start');
        this.browseImagesService.getImages().subscribe( data => {
            for (let image of data.body) {
                this.images.push( {name: image, selected: false});
            }
        });
    }

    onClick() {
        console.log("images = " + JSON.stringify(this.images));
    }

    toggleImage(image) {
        console.log("toggleImage(" + JSON.stringify(image) + ")");
        console.log("images = " + JSON.stringify(this.images));
        image.selected = ! image.selected;
    }
}
