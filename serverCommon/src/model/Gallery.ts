export class Gallery {

    constructor(private storage: { key: any, value: any }[] = []) {
    }

    get(track) {
        let key = this.trackToKeyMapper(track);
        let entry = this.storage.find(entry => this.keysEqual(entry.key, key));
        return entry ? entry.value : null;
    }

    put(track, value) {
        let key = this.trackToKeyMapper(track);
        this.storage = this.storage.filter(entry => !this.keysEqual(entry.key, key));
        this.storage.push({key, value});
    }

    trackToKeyMapper(track) {
        let {path, flipX, flipY} = track;
        return {path, flipX, flipY};
    }

    keysEqual(key1, key2) {
        return key1.path == key2.path
            && key1.flipX == key2.flipX
            && key1.flipY == key2.flipY;
    }
};


