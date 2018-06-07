import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {environment} from '../../../environments/environment';

import {cachedGet} from '../CacheService';
import {Playlist} from '../../../../../serverCommon/src/shared/model/playlist.model';
import {playlistDTOToPlaylist} from '../../../../../serverCommon/src/shared/mappers/playlistDTOToPlaylist.mapper';
import {playlistToPlaylistDTO} from '../../../../../serverCommon/src/shared/mappers/playlistToPlaylistDTO.mapper';
import {handleError} from './repositoryUtilities';
import {PlaylistItem} from '../../../../../serverCommon/src/shared/model/playlistItem.model';
import {stringToPlaylistItem} from '../../../../../serverCommon/src/shared/mappers/stringToPlaylistItem.mapper';

const debug = require('debug')('piWriter/PlaylistRepositoryService.ts');

const playlistsUrlV1 = environment.restURL + '/v1/playlists/';

let cache = {};
const playlistsCacheKey = 'playlistsCacheV1';
const playlistCacheKey = 'playlistCacheV1/';

@Injectable()
export class PlaylistRepositoryService {

    constructor(private http: HttpClient) {
    };

    createPlaylist(playlistName) {
        debug('PlaylistRepositoryService:createPlaylist %s', playlistName);
        return new Playlist(playlistName, []);
    };

    createPlaylistItem(name: string) {
        debug('PlaylistRepositoryService:createPlaylistItem %s', name);
        return new PlaylistItem(this, name);
    }

    getPlaylistsV1(): Observable<PlaylistItem[]> {
        debug('PlaylistRepositoryService:getPlaylistsV1');
        return cachedGet<PlaylistItem[]>(
            cache,
            playlistsCacheKey,
            () => this.http.get<string[]>(playlistsUrlV1, {observe: 'response'}),
            t => t.body.map(n => stringToPlaylistItem(this, n))
        );
    };

    getPlaylistV1(playlistName): Observable<Playlist> {
        debug('PlaylistRepositoryService:getPlaylistV1 %s', playlistName);
        return Observable.create(observer => {
            this.playlistExistsV1(playlistName).subscribe(
                data => {
                    if (data) {
                        cachedGet<Playlist>(
                            cache,
                            playlistCacheKey + playlistName,
                            () => this.http.get<Playlist[]>(playlistsUrlV1 + playlistName, {observe: 'response'}),
                            p => {
                                debug('playlistDTO = %O', p.body);
                                let playlist = playlistDTOToPlaylist(playlistName, p.body);
                                this.savePlaylistV1Sync(playlist);
                                return playlist;
                            }
                        ).subscribe(data => observer.next(data), err => observer.error(err), () => observer.complete());
                    }
                    else {
                        debug('Playlist does not exist - creating one');
                        observer.next(this.createPlaylist(playlistName));
                    }
                },
                err => {
                    observer.error(err);
                    handleError(debug, err);
                },
            );
        });
    };

    cacheGetPlaylistV1Sync(playlistName: string): Playlist {
        debug('PlaylistRepositoryService:cacheGetPlaylistV1Sync');
        let cacheKey = playlistCacheKey + playlistName;
        return cache[cacheKey];
    };

    savePlaylistV1Sync(playlist) {
        debug('PlaylistRepositoryService:savePlaylistV1Sync');
        let cacheKey = playlistCacheKey + playlist.name;
        cache[cacheKey] = playlist;
        if (!cache[playlistsCacheKey].map(p => p.name).includes(playlist.name)) {
            cache[playlistsCacheKey].push(stringToPlaylistItem(this, playlist.name));
        }
    };

    postPlaylistV1(playlist) {
        debug('PlaylistRepositoryService:postPlaylistV1');
        this.savePlaylistV1Sync(playlist);

        return Observable.create(observer => {
            this.http.post(
                playlistsUrlV1 + playlist.name,
                playlistToPlaylistDTO(playlist)
            ).subscribe(
                res => {
                    debug('res = %O', res);
                    playlist.markClean();
                    observer.next('Success !!');
                },
                err => {
                    observer.error('Failure :(');
                    handleError(debug, err);
                }
            );
        });
    };

    playlistExistsV1(playlistName): Observable<boolean> {
        debug('PlaylistRepositoryService:playlistExistsV1');
        return Observable.create(observer => {
            this.getPlaylistsV1()
                .subscribe(
                    data => {
                        let names = data.map(d => d.name);
                        let result = names.includes(playlistName);
                        observer.next(result);
                    },
                    error => {
                        observer.error(error);
                        handleError(debug, error);
                    },
                    () => {
                        observer.complete()
                    }
                )
        });
    };

    postPlaylistsPlayV1(playlistName): Observable<string> {
        debug('shared/respoitory/PlaylistRepostitory.service:postPlaylistsV1 %s', playlistName);
        return Observable.create(observer => {
            this.http.post(playlistsUrlV1 + playlistName + '/play', {name: playlistName})
                .subscribe(
                    res => {
                        debug('shared/respoitory.service:postPlaylistsV1 post returns %O', res);
                        observer.next('Success !!');
                    },
                    err => {
                        debug('shared/respoitory.service:postPlaylistsV1 post returns Error %o', err);
                        observer.error('Failure :(');
                        handleError(debug, err);
                    }
                );
        });
    };

}


