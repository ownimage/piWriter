import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import { environment } from '../../environments/environment';
import { RepositoryService } from "../shared/repository.service";

@Component({
    selector: 'app-browse-images',
    templateUrl: './browse-images.component.html',
    styleUrls: ['./browse-images.component.css'],
    providers: [ RepositoryService ],
})
export class BrowseImagesComponent implements OnInit {
    @Output() selectedImages = new EventEmitter<string[]>();

    images:{name: string, selected: boolean}[] = [];
    restURL = environment.restURL;

    constructor(
        private repositoryService: RepositoryService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        console.log('BrowseImages component start');
        this.repositoryService.getImagesV1().subscribe( data => {
            for (let image of data) {
                this.images.push( {name: image, selected: true});
            }
        });
    }

    buttonClick() {
        console.log("images = " + JSON.stringify(this.images));
        var si = this.images.filter( i => i.selected).map( i => i.name );
        console.log("si = " + JSON.stringify(si));
        this.selectedImages.emit(si);
    }

    toggleImage(image) {
        console.log("toggleImage(" + JSON.stringify(image) + ")");
        console.log("images = " + JSON.stringify(this.images));
        image.selected = ! image.selected;
    }
}
