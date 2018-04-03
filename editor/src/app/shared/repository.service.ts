import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {ErrorObservable} from "rxjs/observable/ErrorObservable";

import {environment} from '../../environments/environment';

import {Track} from "./model/track.model";
import {ImageV2} from "./model/imageV2.model";

const imagessUrlV1 = environment.restURL + '/v1/images';
const imagessUrlV2 = environment.restURL + '/v2/images/';
const playlistsUrlV2 = environment.restURL + '/v1/playlists/';

let playlistsCacheV1: String[] = null;
let playlistCacheV1: Track[] = null;
let imagesCacheV1: String[] = null;
let imagesCacheV2: ImageV2[] = null;

let cache = {playlistsCache: playlistsCacheV1, playlistCacheV1, imagesCache: imagesCacheV1};

@Injectable()
export class RepositoryService {

    constructor(private http: HttpClient) {
    }

    getPlaylistsV1(): Observable<string[]> {
        return this.cachedGet<string[]>("playlistsCacheV1", playlistsUrlV2);
    };

    getPlaylistV1(playlist): Observable<Track[]> {
        let cacheKey = "playlistCacheV1/" + playlist;
        if (!cache[cacheKey]) cache[cacheKey] = null;
        return this.cachedGet<Track[]>(cacheKey, playlistsUrlV2 + playlist);
    };

    postPlaylistV1(playlist, value) {
        console.log("RepositoryService.postPlaylistV1( " + JSON.stringify(value));
        return Observable.create(observer => {
            let cacheKey = "playlistCacheV1/" + playlist;
            cache[cacheKey] = value;

            this.http.post(playlistsUrlV2 + playlist, value)
                .subscribe(
                    res => {
                        console.log(res);
                        observer.next("Success !!");
                    },
                    err => {
                        observer.error("Failure :(");
                        RepositoryService.handleError(err);
                    }
                );
        });
    };

    cachePlaylistV1(playlist, value) {
        return Observable.create(observer => {
            this.getPlaylistsV1().subscribe(
                () => {
                    cache.playlistsCache.push(playlist);
                    let cacheKey = "playlistCacheV1/" + playlist;
                    cache[cacheKey] = value;
                    console.log("cache " + JSON.stringify(cache));
                    observer.next();
                }
            )
        });
    }

    playlistExistsV1(playlist): Observable<boolean> {
        return Observable.create(observer => {
            this.getPlaylistsV1()
                .subscribe(
                    data => {
                        let result = data.includes(playlist);
                        observer.next(result);
                    },
                    error => {
                        observer.error(error);
                    },
                    () => {
                        observer.complete()
                    }
                )
        });
    };

    getImagesV1(): Observable<string[]> {
        return this.cachedGet<string[]>("imagesCacheV1", imagessUrlV1);
    };

    getImagesV2(dirName): Observable<ImageV2[]> {
        console.log(`shared/RepositoryService:getImagesv2 dirName = ${JSON.stringify(dirName)}`);
        return Observable.create(observer => {
            let images = this.cachedGet<ImageV2[]>("imagesCacheV2", imagessUrlV2).subscribe(
                res => {
                    //console.log(`shared/RepositoryService:getImagesv2 res = ${JSON.stringify(res)}`);
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

    postPlaylistsV1(playlist): Observable<string> {
        console.log("shared/respoitory.service:postPlaylistsV1 " + JSON.stringify(playlist));
        return Observable.create(observer => {
            this.http.post(playlistsUrlV2, playlist)
                .subscribe(
                    res => {
                        console.log(`shared/respoitory.service:postPlaylistsV1 post returns ${JSON.stringify(res)}`);
                        observer.next("Success !!");
                    },
                    err => {
                        console.log(`shared/respoitory.service:postPlaylistsV1 post returns Error ${JSON.stringify(err)}`);
                        observer.error("Failure :(");
                        RepositoryService.handleError(err);
                    }
                );
        });
    }
    ;

    cachedGet<T>(cacheKey, url): Observable<T> {
        if (cache[cacheKey]
        )
            return Observable.create(observer => {
                observer.next(cache[cacheKey]);
            });

        return Observable.create(observer => {
            console.log("fetch");
            let repository = this.http.get<T>(url, {observe: 'response'});
            repository.subscribe(
                data => {
                    cache[cacheKey] = data.body;
                    observer.next(cache[cacheKey]);
                },
                error => {
                    observer.error(RepositoryService.handleError(error))
                },
                () => {
                    observer.complete()
                }
            )
        });
    }
    ;

    private static

    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an ErrorObservable with a user-facing error message
        return new ErrorObservable(
            'Something bad happened; please try again later.');
    }
    ;

}


