import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { RepositoryService } from "../shared/repository.service";

@Component({
    selector: 'app-browse-images',
    templateUrl: './browse-images.component.html',
    styleUrls: ['./browse-images.component.css'],
    providers: [ RepositoryService ],
})
export class BrowseImagesComponent implements OnInit {

    images:{name: string, selected: boolean}[] = [];

    constructor(
        private repositoryService: RepositoryService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        console.log('BrowseImages component start');
        this.repositoryService.getImagesV1().subscribe( data => {
            for (let image of data) {
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
