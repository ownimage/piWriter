import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {environment} from '../../../environments/environment';

import {ImageV2DTO} from '../../../../../serverCommon/src/shared/dto/imageV2DTO.model';
import {handleError} from './repositoryUtilities';

const debug = require('debug')('piWriter/CacheService.ts');

const fontsUrlV2 = environment.restURL + '/v2/fonts/';


let cache = {};

@Injectable()
export class FontRepositoryService {

    constructor(private http: HttpClient) {
    }

    getFontsV2(dirName): Observable<ImageV2DTO[]> {
        debug('shared/RepositoryService:getImagesv2 dirName = %s', dirName);
        return Observable.create(observer => {
            let images = this.cachedGet<ImageV2DTO[]>(cache, 'imagesCacheV2', fontsUrlV2).subscribe(
                res => {
                    observer.next(
                        res.filter(i => i.dirName == dirName)
                            .sort((a, b) => {
                                // is same type sort by name;
                                if (a.isFile == b.isFile) return a.name.localeCompare(b.name);
                                if (a.isFile) return 1; // directories first
                                return -1;
                            })
                    );
                },
                err => {
                    observer.error(err)
                }
            );
        });
    };

    cachedGet<T>(cache, cacheKey, url): Observable<T> {
        if (cache[cacheKey]
        )
            return Observable.create(observer => {
                observer.next(cache[cacheKey]);
            });

        return Observable.create(observer => {
            debug('fetch');
            let repository = this.http.get<T>(url, {observe: 'response'});
            repository.subscribe(
                data => {
                    cache[cacheKey] = data.body;
                    observer.next(cache[cacheKey]);
                },
                error => {
                    observer.error(handleError(debug, error))
                },
                () => {
                    observer.complete()
                }
            )
        });
    }    ;

}


