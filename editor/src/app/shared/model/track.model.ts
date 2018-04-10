import {Playlist} from "./playlist.model";

export class Track {
    constructor(private playlist: Playlist,
                private _name: string,
                private _path: string,
                private _repeat: boolean,
                private _autostartNext: boolean,
                private _enabled: boolean,) {
    };

    get name(): string {
        return this._name;
    }

    get path(): string {
        return this._path;
    }

    get repeat(): boolean {
        return this._repeat;
    }

    get autostartNext(): boolean {
        return this._autostartNext;
    }

    get enabled(): boolean {
        return this._enabled;
    }

    set repeat(value: boolean) {
        this._repeat = value;
    }

    set autostartNext(value: boolean) {
        this._autostartNext = value;
    }

    set enabled(value: boolean) {
        this._enabled = value;
    }

    moveUp() {
        this.playlist.moveUp(this);
    }

}
