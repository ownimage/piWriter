import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {Track} from "./track.model";

var imagessUrl = 'http://localhost:3000/v1/images';
var playlistsUrl = 'http://localhost:3000/v1/playlists/';

var playlistsCache: String[];
var playlistCache: Track[];
var imagesCache: String[];

var cache = {playlistsCache, playlistCache,  imagesCache} ;

@Injectable()
export class RepositoryService {

    constructor(private http: HttpClient) { }

    getPlaylistsV1(): Observable<string[]>  {
        return this.cachedGet<string[]>("playlistsCache", playlistsUrl);
    }

    getPlaylistV1(playlist): Observable<Track[]> {
        var cacheKey = "playlistCache/" + playlist;
        if (!cache[cacheKey]) cache[cacheKey] = null;
        return this.cachedGet<Track[]>(cacheKey, playlistsUrl + playlist);
    }

    getImagesV1(): Observable<string[]>  {
        return this.cachedGet<string[]>("imagesCache", imagessUrl);
    }

    cachedGet<T>(cacheKey, url): Observable<T>  {
        if (cache[cacheKey]) return Observable.create(observer => { observer.next(cache[cacheKey]); });

        var myObservable: Observable<T> = Observable.create(observer => {
            console.log("fetch");
            let repository =  this.http.get<T>(url, { observe: 'response' });
            repository.subscribe(
                data => { cache[cacheKey] = data.body; observer.next(cache[cacheKey]); },
                error => {observer.error(this.handleError(error))},
                () => {observer.complete()}
            )
        });
        return myObservable;
    }

    private handleError(error: HttpErrorResponse) {
        let message = "";
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            message =  error.error.message;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            message = `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`;
        }

        console.log(`Error: ` + message);
        return message;
    };

}


