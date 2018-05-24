import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {environment} from '../../../environments/environment';
import {wrapGet, wrapPost} from './repositoryUtilities';
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
        return wrapGet(this.http, debug, pingUrl, data => data.body.message, 'Failure :(');
    }

    getConfig(): Observable<Config> {
        return wrapGet(this.http, debug, configUrlV1, data => configDTOToConfig(data.body), 'Failure :(');
    };

    setConfig(config: Config) {
        debug('ConfigRepositoryService:setConfig %O', config);
        return wrapPost<Config>(this.http, debug, configUrlV1, configToConfigDTO(config), data => configDTOToConfig(data),err => 'Failure :(');
    };



}


