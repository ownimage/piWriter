import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {environment} from '../../../environments/environment';
import {wrapGet} from './repositoryUtilities';
import {ServerInfoDTO} from "../../../../../serverCommon/src/shared/dto/serverInfoDTO.model";

const debug = require('debug')('piWriter/ServerInfoRepositoryService');

const serverInfoUrlV1 = environment.restURL + '/serverInfo';

@Injectable()
export class ServerInfoRepositoryService {

    constructor(private http: HttpClient) {
    }

    getServerInfo(): Observable<ServerInfoDTO> {
        return wrapGet(this.http, debug, serverInfoUrlV1, data => data.body, 'Failure :(');
    };

}


