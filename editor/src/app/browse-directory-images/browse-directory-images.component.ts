import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {environment} from '../../environments/environment';
import {RepositoryService} from '../shared/repository.service';
import {Track} from '../shared/model/track.model';
import {ImageV2} from '../shared/model/imageV2.model';
import {TimedMessage} from "../shared/timedMessage";

@Component({
    selector: 'app-browse-images',
    templateUrl: './browse-directory-images.component.html',
    styleUrls: ['./browse-directory-images.component.css'],
    providers: [RepositoryService],
})
export class BrowseDirectoryImagesComponent implements OnInit {
    playlistName: string;
    dirName: string;
    playlist = null;
    imagesV2: { parentDirName: string, dirName: string, name: string, isFile: boolean, selected: boolean, added: TimedMessage }[] = [];
    restURL = environment.restURL;
    //addedMessage = new TimedMessage();

    constructor(private repositoryService: RepositoryService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        console.log('BrowseImages component start');
        this.playlistName = this.route.snapshot.params.playlistName;
        this.repositoryService.getPlaylistV1(this.playlistName).subscribe(data => this.playlist = data);
        this.changeDirectory(null);
    }

    changeDirectory(dir) {
        console.log(`changeDirectory dir = ${JSON.stringify(dir)}`);
        this.dirName = '';
        this.imagesV2 = [];
        if (dir) {
            if (dir.name == '..') this.dirName = dir.dirName;
            else this.dirName = `${dir.dirName}/${dir.name}`;

            let parentDirName = this.dirName.substring(0, this.dirName.lastIndexOf("/"));
            if (this.dirName != '') {
                let dotdot = {
                    parentDirName: '',
                    dirName: parentDirName,
                    name: '..',
                    isFile: false,
                    selected: false,
                    added: new TimedMessage()
                }
                this.imagesV2.push(dotdot);
            }
        }

        this.repositoryService.getImagesV2(this.dirName).subscribe(data => {
            for (let image of data) {
                console.log(`image = ${JSON.stringify(image)}`);
                this.imagesV2.push({
                    parentDirName: image.parentDirName,
                    dirName: image.dirName,
                    name: image.name,
                    isFile: image.isFile,
                    selected: false,
                    added: new TimedMessage()
                });
            }
            console.log(`this.imagesV2 = ${JSON.stringify(this.imagesV2)}`);
        });
    }

    toggleImage(image) {
        console.log("toggleImage(" + JSON.stringify(image) + ")");
        // console.log("imagesV2 = " + JSON.stringify(this.imagesV2));
        image.selected = !image.selected;
    }

    addImage(image) {
        console.log("addImage(" + JSON.stringify(image) + ")");
        //console.log("imagesV2 = " + JSON.stringify(this.imagesV2));
        let track = new Track(image.name, image.name, false, false);
        this.playlist.push(track);
        image.added.setMessage('green', 1000);
    }

    addSelected() {
        console.log("imagesV2 = " + JSON.stringify(this.imagesV2));
        this.imagesV2
            .filter(i => i.selected)
            .map(i => i.name)
            .map(n => new Track(n, n, false, false))
            .map(t => this.playlist.push(t));
        this.returnToPlaylist();
    }

    returnToPlaylist() {
        this.router.navigate(['/playlists', this.playlistName], {queryParams: {mode: 'edit'}});
    }

    selectAll() {
        this.imagesV2.map( i => i.selected = true )
    }

    unselectAll() {
        this.imagesV2.map( i => i.selected = false )
    }



}
