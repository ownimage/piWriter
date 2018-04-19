import {ErrorObservable} from "rxjs/observable/ErrorObservable";
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

export {handleError};

