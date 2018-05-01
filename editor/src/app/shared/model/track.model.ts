import {Playlist} from './playlist.model';

export class Track {

    constructor(private playlist: Playlist,
                private _name: string,
                private _path: string,
                private _repeat: boolean = false,
                private _autostartNext: boolean = false,
                private _enabled: boolean = true,
                private _speed: number = 1,
                private _brightness: number = 255,
                private _flipX: boolean = false,
                private _flipY: boolean = false,
                private _scale: number = 1,
                private _alignment: string = "top",
                private _rotate: number = 0,) {
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
            this._brightness,
            this._flipX,
            this._flipY,
            this._scale,
            this._alignment,
            this._rotate
        );
    }


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

    get flipX(): boolean {
        return this._flipX;
    }

    get flipY(): boolean {
        return this._flipY;
    }

    get scale(): number {
        return this._scale;
    }

    get alignment(): string {
        return this._alignment;
    }

    get rotate(): number {
        return this._rotate;
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

    set flipX(value: boolean) {
        this.markDirty();
        this._flipX = value;
    }

    set flipY(value: boolean) {
        this.markDirty();
        this._flipY = value;
    }

    set scale(value: number) {
        this.markDirty();
        this._scale = value;
    }

    set alignment(value: string) {
        this.markDirty();
        this._alignment = value;
    }

    set rotate(value: number) {
        this.markDirty();
        this._rotate = value;
    }

    toggleFlipX() {
        this.flipX = !this.flipX;
    }

    toggleFlipY() {
        this.flipY = !this.flipY;
    }

    toggleRepeat() {
        this.repeat = !this.repeat;
    }

    toggleAutostartNext() {
        this.autostartNext = !this.autostartNext;
    }

    toggleEnabled() {
        this.enabled = !this.enabled;
    }

    toggleAlignment() {
        if (this.alignment == "top") this.alignment = "middle";
        else if (this.alignment == "middle") this.alignment = "bottom";
        else this.alignment = "top";
    }

    toggleRotate() {
        if (this.rotate == 0) this.rotate = 90;
        else if (this.rotate == 90) this.rotate = 180;
        else if (this.rotate == 180) this.rotate = 270;
        else this.rotate = 0;
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

    setAdvancedMode() {
        this.playlist.setShowTrack(this);
    }

    isAdvancedMode() {
        return !this.playlist.isShowingAllTracks() && this.playlist.isTrackShowing(this);
    }

    duplicate() {
        this.playlist.duplicate(this);
    }
}

