import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {environment} from '../../../environments/environment';
import {Track} from '../../../../../serverCommon/src/shared/model/track.model';
import {TimedMessage} from '../../common/timedMessage';
import {config} from '../../common/config';
import {Playlist} from '../../../../../serverCommon/src/shared/model/playlist.model';
import {RepositoryService} from '../../common/repository.service';
import {PlaylistRepositoryService} from '../../common/repository/PlaylistRepositoryService';

const debug = require('debug')('piWriter/add-images.component.ts');

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
        debug('BrowseImages component start');
        this.playlistName = this.route.snapshot.params.playlistName;
        this.playlistRepositoryService.getPlaylistV1(this.playlistName).subscribe(data => this.playlist = data);
        this.changeDirectory(null);
    }

    changeDirectory(dir) {
        debug('changeDirectory dir = %o', dir);
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
                debug('image = %o', image);
                this.imagesV2.push({
                    parentDirName: image.parentDirName,
                    dirName: image.dirName,
                    name: image.name,
                    isFile: image.isFile,
                    selected: false,
                    added: new TimedMessage()
                });
            }
            debug('this.imagesV2 = %o', this.imagesV2);
        });
    }

    toggleImage(image) {
        debug('toggleImage(%o)', image);
        debug('icons(%o)', this.icons);
        image.selected = !image.selected;
    }

    addImage(image) {
        debug('addImage(%o)', image);
        let track = new Track(this.playlist, image.name, image.dirName + '/' + image.name, false, false, true);
        this.playlist.addTrack(track);
        image.added.setMessage('green', 1000);
    }

    addSelected() {
        debug('imagesV2 = %o', this.imagesV2);
        this.imagesV2
            .filter(i => i.selected && i.isFile)
            .map(i => new Track(this.playlist, i.name, i.dirName + '/' + i.name, false, false, true))
            .map(t => this.playlist.addTrack(t));
        this.returnToPlaylist();
    }

    returnToPlaylist() {
        this.playlistRepositoryService.savePlaylistV1Sync(this.playlist);
        this.router.navigate(['/playlists', this.playlistName], {queryParams: {mode: 'edit'}});
    }

    selectAll() {
        this.imagesV2.map(i => i.selected = true)
    }

    unselectAll() {
        this.imagesV2.map(i => i.selected = false)
    }


}
