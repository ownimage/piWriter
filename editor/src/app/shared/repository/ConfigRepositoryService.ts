import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {environment} from '../../../environments/environment';
import {handleError} from './repositoryUtilities';
import {ConfigDTO} from '../dto/configDTO.model';
import {Config} from '../model/config.model';
import {configToConfigDTO} from '../mappers/configToConfigDTO.mapper';
import {configDTOToConfig} from '../mappers/configDTOToConfig.mapper';

const debug = require('debug')('piWriter/ConfigRepositoryService.ts');

const pingUrl = environment.restURL + '/ping';
const configUrlV1 = environment.restURL + '/config';

@Injectable()
export class ConfigRepositoryService {

    constructor(private http: HttpClient) {
    }

    ping(): Observable<string> {
        return this.wrapGet(pingUrl, data => data.body.message, 'Failure :(');
    }

    getConfig(): Observable<ConfigDTO> {
        return this.wrapGet(configUrlV1, data => data.body, 'Failure :(');
    };

    setConfig(config: Config) {
        debug('ConfigRepositoryService:setConfig %O', config);
        return this.wrapPost<Config>(configUrlV1, configToConfigDTO(config), data => configDTOToConfig(data),err => 'Failure :(');
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

    wrapPost<T>(url, payload, sucessTransform, failureTransform): Observable<T> {
        return Observable.create(observer => {
            this.http.post(url, payload)
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

}


