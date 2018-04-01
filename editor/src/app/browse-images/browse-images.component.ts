import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {environment} from '../../environments/environment';
import {RepositoryService} from '../shared/repository.service';
import {Track} from '../shared/track.model';

@Component({
    selector: 'app-browse-images',
    templateUrl: './browse-images.component.html',
    styleUrls: ['./browse-images.component.css'],
    providers: [RepositoryService],
})
export class BrowseImagesComponent implements OnInit {
    playlistName: string;
    playlist = null;
    images: { name: string, selected: boolean }[] = [];
    restURL = environment.restURL;

    constructor(private repositoryService: RepositoryService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        console.log('BrowseImages component start');
        this.playlistName = this.route.snapshot.params.playlistName;
        this.repositoryService.getPlaylistV1(this.playlistName).subscribe(data => this.playlist = data);
        this.repositoryService.getImagesV1().subscribe(data => {
            for (let image of data) {
                this.images.push({name: image, selected: true});
            }
        });
    }

    buttonClick() {
        console.log("images = " + JSON.stringify(this.images));
        this.images
            .filter(i => i.selected)
            .map(i => i.name)
            .map(n => new Track(n, n, false, false))
            .map(t => this.playlist.push(t));
        this.router.navigate(["/playlists", this.playlistName], {queryParams: {mode: "edit"}})
    }

    toggleImage(image) {
        console.log("toggleImage(" + JSON.stringify(image) + ")");
        console.log("images = " + JSON.stringify(this.images));
        image.selected = !image.selected;
    }
}
