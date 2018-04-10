import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {environment} from '../../../environments/environment';
import {handleError} from './repositoryUtilities';

const pingUrl = environment.restURL + '/ping';
const configUrlV1 = environment.restURL + '/config';

@Injectable()
export class ConfigRepositoryService {

    constructor(private http: HttpClient) {
    }

    ping(): Observable<string> {
        return this.wrapGet(pingUrl, data => data.body.message, 'Failure :(');
    }

    getConfig(): Observable<Object> {
        return this.wrapGet(configUrlV1, data => data.body, 'Failure :(');
    };

    setConfig(config) {
        console.log(`ConfigRepositoryService:setConfig + ${JSON.stringify(config)}`);
        return this.wrapPost(configUrlV1, config, 'Success !!','Failure :(');
    };

    wrapGet<T>(url, transformResult, failureMessage): Observable<T> {
        return Observable.create(observer => {
            this.http.get<T>(url, {observe: 'response'})
                .subscribe(
                    data => {
                        observer.next(transformResult(data));
                    },
                    err => {
                        observer.error(failureMessage);
                        handleError(err);
                    }
                );
        });
    };

    wrapPost<T>(url, payload, successMessage, failureMessage): Observable<T> {
        return Observable.create(observer => {
            this.http.post(url, payload)
                .subscribe(
                    next => {
                        observer.next(successMessage);
                    },
                    err => {
                        observer.error(failureMessage);
                        handleError(err);
                    }
                )
            ;
        });
    };

}


