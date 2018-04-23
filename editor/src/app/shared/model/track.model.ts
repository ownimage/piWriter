import {Playlist} from './playlist.model';

export class Track {
    constructor(private playlist: Playlist,
                private _name: string,
                private _path: string,
                private _repeat: boolean,
                private _autostartNext: boolean,
                private _enabled: boolean,) {
    };

    private _speed: number = 1;
    private  _brightness: number = 256;

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

    get speed(): number {
        return this._speed;
    }

    get brightness(): number {
        return this._brightness;
    }

    set repeat(value: boolean) {
        this.markDirty();
        this._repeat = value;
    }

    set autostartNext(value: boolean) {
        this.markDirty();
        this._autostartNext = value;
    }

    set enabled(value: boolean) {
        this.markDirty();
        this._enabled = value;
    }

    set brightness(value: number) {
        this.markDirty();
        this._brightness = value;
    }

    set speed(value: number) {
        this.markDirty();
        this. _speed = value;
    }

    moveUp() {
        this.playlist.moveUp(this);
    }

    moveDown() {
        this.playlist.moveDown(this);
    }

    cut() {
        this.playlist.cut(this);
    }

    markDirty() {
        this.playlist.markDirty();
    }

    showThisTrackOnly() {
        this.playlist.setShowTrack(this);
    }

    isAdvancedMode() {
        return !this.playlist.isShowingAllTracks() && this.playlist.showTrack(this);
    }
}
