import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {environment} from '../../../environments/environment';
import {Track} from '../../shared/model/track.model';;
import {TimedMessage} from '../../shared/timedMessage';
import {config} from '../../shared/config';
import {Playlist} from "../../shared/model/playlist.model";
import {RepositoryService} from "../../shared/repository.service";
import {PlaylistRepositoryService} from "../../shared/repository/PlaylistRepositoryService";

@Component({
    selector: 'app-browse-images',
    templateUrl: './add-images.component.html',
    styleUrls: ['./add-images.component.css'],
    providers: [RepositoryService, PlaylistRepositoryService],
})
export class AddImagesComponent implements OnInit {
    playlistName: string;
    dirName: string;
    playlist: Playlist = null;
    imagesV2: { parentDirName: string, dirName: string, name: string, isFile: boolean, selected: boolean, added: TimedMessage }[] = [];
    restURL = environment.restURL;
    icons = config.icons;

    constructor(private repositoryService: RepositoryService,
                private playlistRepositoryService: PlaylistRepositoryService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        console.log('BrowseImages component start');
        this.playlistName = this.route.snapshot.params.playlistName;
        this.playlistRepositoryService.getPlaylistV1(this.playlistName).subscribe(data => this.playlist = data);
        this.changeDirectory(null);
    }

    changeDirectory(dir) {
        console.log(`changeDirectory dir = ${JSON.stringify(dir)}`);
        this.dirName = '';
        this.imagesV2 = [];
        if (dir) {
            if (dir.name == '..') this.dirName = dir.dirName;
            else this.dirName = `${dir.dirName}/${dir.name}`;

            let parentDirName = this.dirName.substring(0, this.dirName.lastIndexOf('/'));
            if (this.dirName != '') {
                let dotdot = {
                    parentDirName: '',
                    dirName: parentDirName,
                    name: '..',
                    isFile: false,
                    selected: false,
                    added: new TimedMessage()
                };
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
        console.log('toggleImage(' + JSON.stringify(image) + ')');
        console.log('icons(' + JSON.stringify(this.icons) + ')');
        // console.log('imagesV2 = ' + JSON.stringify(this.imagesV2));
        image.selected = !image.selected;
    }

    addImage(image) {
        console.log('addImage(' + JSON.stringify(image) + ')');
        //console.log('imagesV2 = ' + JSON.stringify(this.imagesV2));
        let track = new Track(this.playlist, image.name, image.dirName + '/' + image.name, false, false, true);
        this.playlist.addTrack(track);
        image.added.setMessage('green', 1000);
    }

    addSelected() {
        console.log('imagesV2 = ' + JSON.stringify(this.imagesV2));
        this.imagesV2
            .filter(i => i.selected && i.isFile)
            .map(i => new Track(this.playlist, i.name, i.dirName + '/' + i.name, false, false, true))
            .map(t => this.playlist.addTrack(t));
        this.returnToPlaylist();
    }

    returnToPlaylist() {
        this.playlist.post();
        this.router.navigate(['/playlists', this.playlistName], {queryParams: {mode: 'edit'}});
    }

    selectAll() {
        this.imagesV2.map( i => i.selected = true )
    }

    unselectAll() {
        this.imagesV2.map( i => i.selected = false )
    }



}
