export class ServerGallery {

    constructor(private storage: Array<{ key: any, value: any }> = []) {
    }

    public get(track) {
        const key = this.trackToKeyMapper(track);
        const entry = this.storage.find((e) => this.keysEqual(e.key, key));
        return entry ? entry.value : null;
    }

    public put(track, value) {
        const key = this.trackToKeyMapper(track);
        this.storage = this.storage.filter((entry) => !this.keysEqual(entry.key, key));
        this.storage.push({key, value});
    }

    public trackToKeyMapper(track) {
        // const {path, flipX, flipY, endStyleLeft, endStyleRight} = track;
        // return {path, flipX, flipY, endStyleLeft, endStyleRight};
        return track;
    }

    public keysEqual(key1, key2) {
         return key1 == key2; // key1.path === key2.path
        //     && key1.flipX === key2.flipX
        //     && key1.flipY === key2.flipY
        //     && key1.endStyleLeft === key2.endStyleLeft
        //     && key1.endStyleRight === key2.endStyleRight;
    }
}
