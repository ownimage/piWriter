import {Observable} from "rxjs/Observable";

function cachedGet<T>(cache, key, observableFunction, convertorFunction): Observable<T> {
    let cachedValue = cache[key];
    if (cachedValue) {
        return Observable.create(observer => {
            observer.next(cachedValue);
        });
    }

    return Observable.create(observer => {
        observableFunction().subscribe(
            data => {
                console.log('cachedGet: got data');
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



