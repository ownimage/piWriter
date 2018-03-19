import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class BrowsePlaylistsService {
    playlistsUrl = 'http://localhost:3000/v1/playlists';

    constructor(private http: HttpClient) { }

    getPlaylists(callback) {
        this.http.get(this.playlistsUrl).subscribe( data => { console.log("data " + JSON.stringify(data)); callback(null, data); });
    }

    getPlaylists1(): Observable<HttpResponse<string[]>>  {
        return this.http.get<string[]>(this.playlistsUrl, { observe: 'response' });
        //});
            // .pipe(
            //     retry(3), // retry a failed request up to 3 times
            //     catchError(this.handleError) // then handle the error
            // );
    }

    private handleError(error: HttpErrorResponse) {
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


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/