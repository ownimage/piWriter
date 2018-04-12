import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {environment} from '../../../environments/environment';

import {cachedGet} from '../CacheService';
import {Playlist} from "../model/playlist.model";
import {playlistDTOToPlaylist} from "../mappers/playlistDTOToPlaylist.mapper";
import {playlistToPlaylistDTO} from "../mappers/playlistToPlaylistDTO.mapper";
import {handleError} from "./repositoryUtilities";

const playlistsUrlV1 = environment.restURL + '/v1/playlists/';

let cache = {};
const playlistsCacheKey = 'playlistsCacheV1';
const playlistCacheKey = 'playlistCacheV1/';

@Injectable()
export class PlaylistRepositoryService {

    constructor(private http: HttpClient) {
    };

    createPlaylist(playlistName) {
        return new Playlist(this, playlistName, []);
    };

    getPlaylistsV1(): Observable<string[]> {
        return cachedGet<string[]>(
            cache,
            playlistsCacheKey,
            () => this.http.get<string[]>(playlistsUrlV1, {observe: 'response'}),
            t => t.body
        );
    };

    getPlaylistV1(playlistName): Observable<Playlist> {
        return Observable.create(observer => {
            this.playlistExistsV1(playlistName).subscribe(
                data => {
                    if (data) {
                        cachedGet<Playlist>(
                            cache,
                            playlistCacheKey + playlistName,
                            () => this.http.get<Playlist[]>(playlistsUrlV1 + playlistName, {observe: 'response'}),
                            p => playlistDTOToPlaylist(this, playlistName, p.body)
                        ).subscribe(data => observer.next(data), err => observer.error(err), () => observer.complete());
                    }
                    else {
                        observer.next(this.createPlaylist(playlistName));
                    }
                },
                err => {
                    observer.error(err);
                    handleError(err);
                },
                () => observer.complete()
            );
        });
    };

    savePlaylistV1(playlist) {
        console.log('PlaylistRepositoryService:savePlaylistV1');
        let cacheKey = playlistCacheKey + playlist.name;
        cache[cacheKey] = playlist;
        if (!cache[playlistsCacheKey].includes(playlist.name)) {
            cache[playlistsCacheKey].push(playlist.name);
        }
    };

    postPlaylistV1(playlist) {
        console.log('PlaylistRepositoryService:postPlaylistV1');
        this.savePlaylistV1(playlist);

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
        return Observable.create(observer => {
            this.getPlaylistsV1()
                .subscribe(
                    data => {
                        let result = data.includes(playlistName);
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


