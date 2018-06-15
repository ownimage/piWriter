import {ErrorObservable} from "rxjs/observable/ErrorObservable";
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

const handleError = (debug, error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        debug('An error occurred:', error.error.message);
    } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        debug('Backend returned code %s, body was: %s', error.status, error.error);
    }
    // return an ErrorObservable with a user-facing error message 
    return new ErrorObservable(
        'Something bad happened; please try again later.');
};

const wrapGet = <T>(http: HttpClient, debug, url, transformResult, failureMessage): Observable<T> => {
    return Observable.create(observer => {
        http.get<T>(url, {observe: 'response'})
            .subscribe(
                data => {
                    observer.next(transformResult(data));
                },
                err => {
                    observer.error(failureMessage);
                    handleError(debug, err);
                }
            );
    });
};

const wrapPost = <T>(http: HttpClient, debug, url, payload, sucessTransform, failureTransform): Observable<T> => {
    return Observable.create(observer => {
        http.post(url, payload)
            .subscribe(
                next => {
                    observer.next(sucessTransform(next));
                },
                err => {
                    observer.error(failureTransform(err));
                    handleError(debug, err);
                }
            )
        ;
    });
};

export {
    handleError,
    wrapGet,
    wrapPost
};

