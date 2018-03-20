import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

var imagessUrl = 'http://localhost:3000/v1/images';

var cache = { };

@Injectable()
export class RepositoryService {

    constructor(private http: HttpClient) { }

    getImagesV1(): Observable<string[]>  {
        return this.cachedGet("images", imagessUrl);
    }

    cachedGet(cacheKey, url): Observable<any>  {
        if (cache[cacheKey]) return Observable.create(observer => { observer.next(cache[cacheKey]); });

        var myObservable = Observable.create(observer => {
            console.log("fetch");
            let repository =  this.http.get<string[]>(url, { observe: 'response' });
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


