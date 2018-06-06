import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {environment} from '../../environments/environment';

import {ImageV2DTO} from '../shared/dto/imageV2DTO.model';
import {handleError} from './repository/repositoryUtilities';

const debug = require('debug')('piWriter/CacheService.ts');

const imagesUrlV2 = environment.restURL + '/v2/images/';
const playlistsUrlV1 = environment.restURL + '/v1/playlists/';


let cache = {playlistsCache: []};

@Injectable()
export class RepositoryService {

    constructor(private http: HttpClient) {
    }

    // getPlaylistsV1(): Observable<string[]> {
    //     return this.cachedGet<string[]>('playlistsCacheV1', playlistsUrlV1);
    // };

    // getPlaylistV1(playlistName): Observable<Playlist> {
    //     return Observable.create(observer => {
    //         let cacheKey = 'playlistCacheV1/' + playlistName;
    //
    //         if (cache[cacheKey])
    //             return Observable.create(observer => {
    //                 observer.next(cache[cacheKey]);
    //             });
    //
    //         this.http.get<TrackDTO[]>(playlistsUrlV1 + playlistName, {observe: 'response'})
    //             .subscribe(
    //                 data => {
    //                     let playlist = new Playlist(this, playlistName, []);
    //                     data.body
    //                         .map(t => {
    //                             return new Track(playlist, t.name, t.path, t.repeat, t.autostartNext, t.enabled)
    //                         })
    //                         .map(t => playlist.addTrack(t));
    //                     cache[cacheKey] = playlist;
    //                     observer.next(playlist);
    //                 },
    //                 err => {
    //                     observer.error('Failure :(');
    //                     RepositoryService.handleError(err);
    //                 }
    //             )
    //     })
    // };

    // postPlaylistV1(playlist, value) {
    //     return Observable.create(observer => {
    //         let cacheKey = 'playlistCacheV1/' + playlist;
    //         cache[cacheKey] = value;
    //
    //         this.http.post(playlistsUrlV1 + playlist, value)
    //             .subscribe(
    //                 res => {
    //                     debug('res = %s', res);
    //                     observer.next('Success !!');
    //                 },
    //                 err => {
    //                     observer.error('Failure :(');
    //                     RepositoryService.handleError(debug, err);
    //                 }
    //             );
    //     });
    // };
    //
    // cachePlaylistV1(playlist, value) {
    //     return Observable.create(observer => {
    //         this.getPlaylistsV1().subscribe(
    //             () => {
    //                 cache.playlistsCache.push(playlist);
    //                 let cacheKey = 'playlistCacheV1/' + playlist;
    //                 cache[cacheKey] = value;
    //                 debug('cache ' + JSON.stringify(cache));
    //                 observer.next();
    //             }
    //         )
    //     });
    // }
    //
    // playlistExistsV1(playlist): Observable<boolean> {
    //     return Observable.create(observer => {
    //         this.getPlaylistsV1()
    //             .subscribe(
    //                 data => {
    //                     let result = data.includes(playlist);
    //                     observer.next(result);
    //                 },
    //                 error => {
    //                     observer.error(error);
    //                 },
    //                 () => {
    //                     observer.complete()
    //                 }
    //             )
    //     });
    // };

    getImagesV2(dirName): Observable<ImageV2DTO[]> {
        debug('shared/RepositoryService:getImagesv2 dirName = %s', dirName);
        return Observable.create(observer => {
            let images = this.cachedGet<ImageV2DTO[]>('imagesCacheV2', imagesUrlV2).subscribe(
                res => {
                    observer.next(
                        res.filter(i => i.dirName == dirName)
                            .sort((a, b) => {
                                // is same type sort by name;
                                if (a.isFile == b.isFile) return a.name.localeCompare(b.name);
                                if (a.isFile) return 1; // directories first
                                return -1;
                            })
                    );
                },
                err => {
                    observer.error(err)
                }
            );
        });
    };

    //
    // postPlaylistsV1(playlist): Observable<string> {
    //     debug('shared/respoitory.service:postPlaylistsV1 ' + JSON.stringify(playlist));
    //     return Observable.create(observer => {
    //         this.http.post(playlistsUrlV1, playlist)
    //             .subscribe(
    //                 res => {
    //                     debug('shared/respoitory.service:postPlaylistsV1 post returns ${JSON.stringify(res)}');
    //                     observer.next('Success !!');
    //                 },
    //                 err => {
    //                     debug('shared/respoitory.service:postPlaylistsV1 post returns Error ${JSON.stringify(err)}');
    //                     observer.error('Failure :(');
    //                     RepositoryService.handleError(err);
    //                 }
    //             );
    //     });
    // }
    // ;

    cachedGet<T>(cacheKey, url): Observable<T> {
        if (cache[cacheKey]
        )
            return Observable.create(observer => {
                observer.next(cache[cacheKey]);
            });

        return Observable.create(observer => {
            debug('fetch');
            let repository = this.http.get<T>(url, {observe: 'response'});
            repository.subscribe(
                data => {
                    cache[cacheKey] = data.body;
                    observer.next(cache[cacheKey]);
                },
                error => {
                    observer.error(handleError(debug, error))
                },
                () => {
                    observer.complete()
                }
            )
        });
    }    ;

}


