import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {environment} from '../../../environments/environment';
import {handleError} from './repositoryUtilities';
import {ServerInfoDTO} from "../dto/serverInfoDTO.model";

const debug = require('debug')('piWriter/ServerInfoRepositoryService');

const serverInfoUrlV1 = environment.restURL + '/serverInfo';

@Injectable()
export class ServerInfoRepositoryService {

    constructor(private http: HttpClient) {
    }

    getServerInfo(): Observable<ServerInfoDTO> {
        return this.wrapGet(serverInfoUrlV1, data => data.body, 'Failure :(');
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
                        handleError(debug, err);
                    }
                );
        });
    };

}


