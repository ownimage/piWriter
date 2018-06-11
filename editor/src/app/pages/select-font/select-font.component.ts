import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {environment} from '../../../environments/environment';
import {TimedMessage} from '../../common/timedMessage';
import {config} from '../../common/config';
import {FontRepositoryService} from "../../common/repository/FontRepositoryService";
import {PlaylistRepositoryService} from "../../common/repository/PlaylistRepositoryService";
import {Playlist} from "../../../../../serverCommon/src/shared/model/playlist.model";

const debug = require('debug')('piWriter/select-font.component.ts');

@Component({
    selector: 'app-browse-fonts',
    templateUrl: './select-font.component.html',
    styleUrls: ['./select-font.component.css'],
    providers: [PlaylistRepositoryService, FontRepositoryService],
})
export class SelectFontComponent implements OnInit {
    playlistName: string;
    playlist: Playlist;
    dirName: string;
    imagesV2: { parentDirName: string, dirName: string, name: string, isFile: boolean, selected: boolean, added: TimedMessage }[] = [];
    restURL = environment.restURL;
    icons = config.icons;

    constructor(private playlistRepositoryService: PlaylistRepositoryService,
                private fontRepositoryService: FontRepositoryService,
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

        this.fontRepositoryService.getFontsV2(this.dirName).subscribe(data => {
            for (let font of data) {
                debug('image = %o', font);
                this.imagesV2.push({
                    parentDirName: font.parentDirName,
                    dirName: font.dirName,
                    name: font.name,
                    isFile: font.isFile,
                    selected: false,
                    added: new TimedMessage()
                });
            }
            debug('this.imagesV2 = %o', this.imagesV2);
        });
    }

    selectFont(image) {
        this.playlist.getSelectedTrack().path = image.dirName + "/" + image.name;
        this.returnToPlaylist();
    }

    toggleImage(image) {
        debug('toggleImage(%o)', image);
        debug('icons(%o)', this.icons);
        image.selected = !image.selected;
    }

    returnToPlaylist() {
        this.router.navigate(['/playlists', this.playlistName], {queryParams: {mode: 'edit'}});
    }


}
