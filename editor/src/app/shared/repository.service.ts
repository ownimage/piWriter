import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {ErrorObservable} from "rxjs/observable/ErrorObservable";

import { environment } from '../../environments/environment';

import {Track} from "./track.model";

const imagessUrl = environment.restURL + '/v1/images';
const playlistsUrl = environment.restURL + '/v1/playlists/';

let playlistsCache: String[] = null;
let playlistCache: Track[] = null;
let imagesCache: String[] = null;

let cache = {playlistsCache, playlistCache, imagesCache};

@Injectable()
export class RepositoryService {

    constructor(private http: HttpClient) {
    }

    getPlaylistsV1(): Observable<string[]> {
        return this.cachedGetV1<string[]>("playlistsCache", playlistsUrl);
    }

    getPlaylistV1(playlist): Observable<Track[]> {
        let cacheKey = "playlistCache/" + playlist;
        if (!cache[cacheKey]) cache[cacheKey] = null;
        return this.cachedGetV1<Track[]>(cacheKey, playlistsUrl + playlist);
    }

    postPlaylistV1(playlist, value) {
        console.log("RepositoryService.postPlaylistV1( " + JSON.stringify(value));
        let cacheKey = "playlistCache/" + playlist;
        cache[cacheKey] = value;

        this.http.post(playlistsUrl + playlist, value)
            .subscribe(
                res => {
                    console.log(res);
                },
                err => {
                    RepositoryService.handleError(err);
                }
            );
    }

    cachePlaylistV1(playlist, value) {
        return Observable.create(observer => {
            this.getPlaylistsV1().subscribe(
                () => {
                    cache.playlistsCache.push(playlist);
                    let cacheKey = "playlistCache/" + playlist;
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
    }

    getImagesV1(): Observable<string[]> {
        return this.cachedGetV1<string[]>("imagesCache", imagessUrl);
    }

    postPlaylistsV1(playlist) {
        console.log("Select x" + JSON.stringify(playlist));
        this.http.post(playlistsUrl , playlist)
            .subscribe(
                res => {
                    console.log(res);
                },
                err => {
                    RepositoryService.handleError(err);
                }
            );
    }

    cachedGetV1<T>(cacheKey, url): Observable<T> {
        if (cache[cacheKey]) return Observable.create(observer => {
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

    private static handleError(error: HttpErrorResponse) {
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
    };

}


