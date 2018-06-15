import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {config} from '../../common/config';
import {PlaylistRepositoryService} from '../../common/repository/PlaylistRepositoryService';
import {PlaylistItem} from '../../../../../serverCommon/src/shared/model/playlistItem.model';

const debug = require('debug')('piWriter/browse-playlists.component.ts');

@Component({
  selector: 'app-browse-playlists',
  templateUrl: './browse-playlists.component.html',
  styleUrls: ['./browse-playlists.component.css'],
  providers: [ PlaylistRepositoryService ],
})
export class BrowsePlaylistsComponent implements OnInit {

    constructor(
        private repositoryService: PlaylistRepositoryService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    playlists:PlaylistItem[] = [];
    mode: string = '';
    icons = config.icons;

    ngOnInit() {
        debug('Playlist component start');
        this.mode = this.route.snapshot.queryParams.mode;
        debug('this.mode = %s', this.mode);
        this.repositoryService.getPlaylistsV1().subscribe( data => {
            this.playlists = data;
        });
    }

    showPlaylist(playlist) {
        debug('showPlaylist(%s)', playlist);
    }

    getModeDisplayText() {
        if (this.mode =='edit') return 'Edit Playlist ...';
        return 'Play Playlist ...';
    }
    navigateToHome() {
        this.router.navigate(['/']);
    }

}
