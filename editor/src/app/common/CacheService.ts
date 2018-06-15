import {Observable} from 'rxjs/Observable';

const debug = require('debug')('piWriter/CacheService.ts');

function cachedGet<T>(cache, key, observableFunction, convertorFunction): Observable<T> {
    debug('CacheService:cachedGet %s', key);
    let cachedValue = cache[key];
    if (cachedValue) {
        debug('returning cached value');
        return Observable.create(observer => {
            observer.next(cachedValue);
        });
    }

    debug('returning fetched value');
    return Observable.create(observer => {
        observableFunction().subscribe(
            data => {
                debug('cachedGet: got data %O', data);
                let value = convertorFunction(data);
                cache[key] = value;
                observer.next(value);
            },
            error => observer.error(error),
            () => observer.complete()
        )
    });
}

export {
    cachedGet
}



