import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {environment} from '../../../environments/environment';

import {cachedGet} from '../CacheService';
import {Playlist} from "../model/playlist.model";
import {playlistDTOToPlaylist} from "../mappers/playlistDTOToPlaylist.mapper";
import {playlistToPlaylistDTO} from "../mappers/playlistToPlaylistDTO.mapper";
import {handleError} from "./repositoryUtilities";
import {PlaylistItem} from "../model/playlistItem.model";
import {stringToPlaylistItem} from "../mappers/stringToPlaylistItem.mapper";

const playlistsUrlV1 = environment.restURL + '/v1/playlists/';

let cache = {};
const playlistsCacheKey = 'playlistsCacheV1';
const playlistCacheKey = 'playlistCacheV1/';

@Injectable()
export class PlaylistRepositoryService {

    constructor(private http: HttpClient) {
    };

    createPlaylist(playlistName) {
        console.log(`PlaylistRepositoryService:createPlaylist ${playlistName}`);
        return new Playlist(this, playlistName, []);
    };

    getPlaylistsV1(): Observable<PlaylistItem[]> {
        console.log(`PlaylistRepositoryService:getPlaylistsV1`);
        return cachedGet<PlaylistItem[]>(
            cache,
            playlistsCacheKey,
            () => this.http.get<string[]>(playlistsUrlV1, {observe: 'response'}),
            t => t.body.map(n => stringToPlaylistItem(n))
        );
    };

    getPlaylistV1(playlistName): Observable<Playlist> {
        console.log(`PlaylistRepositoryService:getPlaylistV1 ${playlistName}`);
        return Observable.create(observer => {
            this.playlistExistsV1(playlistName).subscribe(
                data => {
                    if (data) {
                        cachedGet<Playlist>(
                            cache,
                            playlistCacheKey + playlistName,
                            () => this.http.get<Playlist[]>(playlistsUrlV1 + playlistName, {observe: 'response'}),
                            p => {
                                console.log(`playlistDTO = ${JSON.stringify(p.body)}`);
                                let playlist = playlistDTOToPlaylist(this, playlistName, p.body);
                                playlist.save();
                                return playlist;
                            }
                        ).subscribe(data => observer.next(data), err => observer.error(err), () => observer.complete());
                    }
                    else {
                        console.log('Playlist does not exist - creating one');
                        observer.next(this.createPlaylist(playlistName));
                    }
                },
                err => {
                    observer.error(err);
                    handleError(err);
                },
            );
        });
    };

    static cacheGetPlaylistV1Sync(playlistName: string): Playlist {
        console.log('PlaylistRepositoryService:cacheGetPlaylistV1Sync');
        let cacheKey = playlistCacheKey + playlistName;
        return cache[cacheKey];
    };

    savePlaylistV1Sync(playlist) {
        console.log('PlaylistRepositoryService:savePlaylistV1Sync');
        let cacheKey = playlistCacheKey + playlist.name;
        cache[cacheKey] = playlist;
        if (!cache[playlistsCacheKey].map(p => p.name).includes(playlist.name)) {
            cache[playlistsCacheKey].push(stringToPlaylistItem(playlist.name));
        }
    };

    postPlaylistV1(playlist) {
        console.log('PlaylistRepositoryService:postPlaylistV1');
        this.savePlaylistV1Sync(playlist);

        return Observable.create(observer => {
            this.http.post(
                playlistsUrlV1 + playlist.name,
                playlistToPlaylistDTO(playlist)
            ).subscribe(
                res => {
                    console.log(res);
                    playlist.markClean();
                    observer.next("Success !!");
                },
                err => {
                    observer.error("Failure :(");
                    handleError(err);
                }
            );
        });
    };

    playlistExistsV1(playlistName): Observable<boolean> {
        console.log('PlaylistRepositoryService:playlistExistsV1');
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
                        handleError(error);
                    },
                    () => {
                        observer.complete()
                    }
                )
        });
    };

    postPlaylistsPlayV1(playlistName): Observable<string> {
        console.log("shared/respoitory/PlaylistRepostitory.service:postPlaylistsV1 " + JSON.stringify(playlistName));
        return Observable.create(observer => {
            this.http.post(playlistsUrlV1 + playlistName + '/play', {name: playlistName})
                .subscribe(
                    res => {
                        console.log(`shared/respoitory.service:postPlaylistsV1 post returns ${JSON.stringify(res)}`);
                        observer.next("Success !!");
                    },
                    err => {
                        console.log(`shared/respoitory.service:postPlaylistsV1 post returns Error ${JSON.stringify(err)}`);
                        observer.error("Failure :(");
                        handleError(err);
                    }
                );
        });
    };

}


