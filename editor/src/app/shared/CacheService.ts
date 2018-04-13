import {Observable} from "rxjs/Observable";

function cachedGet<T>(cache, key, observableFunction, convertorFunction): Observable<T> {
    console.log(`CacheService:cachedGet ${key}`);
    let cachedValue = cache[key];
    if (cachedValue) {
        console.log(`returning cached value`);
        return Observable.create(observer => {
            observer.next(cachedValue);
        });
    }

    console.log(`returning fetched value`);
    return Observable.create(observer => {
        observableFunction().subscribe(
            data => {
                console.log(`cachedGet: got data ${JSON.stringify(data)}`);
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



