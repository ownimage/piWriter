import {Playlist} from './playlist.model';

export class Track {
    constructor(private playlist: Playlist,
                private _name: string,
                private _path: string,
                private _repeat: boolean = false,
                private _autostartNext: boolean = false,
                private _enabled: boolean = true,
                private _speed: number = 1,
                private _brightness: number = 255,) {
    };

    clone(): Track {
        return new Track(
            this.playlist,
            this._name,
            this._path,
            this._repeat,
            this._autostartNext,
            this._enabled,
            this._speed,
            this._brightness
        );
    }

    //private _speed: number = 1;
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
        this._speed = value;
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

    duplicate() {
        this.playlist.duplicate(this);
    }
}
