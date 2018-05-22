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
                private _rotate: number = 0,
                private _marginLeft: number = 0,
                private _marginRight: number = 0,
                private _useColor: boolean = false,
                private _useColor1: boolean = false,
                private _limitColor: boolean = false,
                private _color1: string = "",
                private _useColor2: boolean = false,
                private _color2: string = "",
                private _useColor3: boolean = false,
                private _color3: string = "",
                public _useStripes: boolean = false,
                public _stripeBlackWidth: number = 1,
                public _stripeTotalWidth: number = 2) {
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
            this._rotate,
            this._marginLeft,
            this._marginRight,
            this._useColor,
            this._limitColor,
            this._useColor1,
            this._color1,
            this._useColor2,
            this._color2,
            this._useColor3,
            this._color3,
            this._useStripes,
            this._stripeBlackWidth,
            this._stripeTotalWidth
        )
            ;
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

    get marginLeft(): number {
        return this._marginLeft;
    }

    get marginRight(): number {
        return this._marginRight;
    }

    get useColor(): boolean {
        return this._useColor;
    }

    get limitColor(): boolean {
        return this._limitColor;
    }

    get useColor1(): boolean {
        return this._useColor1;
    }

    get color1(): string {
        return this._color1;
    }

    get useColor2(): boolean {
        return this._useColor2;
    }

    get color2(): string {
        return this._color2;
    }

    get useColor3(): boolean {
        return this._useColor3;
    }

    get color3(): string {
        return this._color3;
    }

    get useStripes(): boolean {
        return this._useStripes;
    }

    get stripeBlackWidth(): number {
        return this._stripeBlackWidth;
    }

    get stripeTotalWidth(): number {
        return this._stripeTotalWidth;
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

    set marginLeft(value: number) {
        this.markDirty();
        this._marginLeft = value;
    }

    set marginRight(value: number) {
        this.markDirty();
        this._marginRight = value;
    }

    set useColor(value: boolean) {
        this.markDirty();
        this._useColor = value;
    }

    set limitColor(value: boolean) {
        this.markDirty();
        this._limitColor = value;
    }

    set useColor1(value: boolean) {
        this.markDirty();
        this._useColor1 = value;
    }

    set color1(value: string) {
        this.markDirty();
        this._color1 = value;
    }

    set useColor2(value: boolean) {
        this.markDirty();
        this._useColor2 = value;
    }

    set color2(value: string) {
        this.markDirty();
        this._color2 = value;
    }

    set useColor3(value: boolean) {
        this.markDirty();
        this._useColor3 = value;
    }

    set color3(value: string) {
        this.markDirty();
        this._color3 = value;
    }

    set useStripes(value: boolean) {
        this.markDirty();
        this._useStripes = value;
    }

    set stripeBlackWidth(value: number) {
        this.markDirty();
        this._stripeBlackWidth = value;
    }

    set stripeTotalWidth(value: number) {
        this.markDirty();
        this._stripeTotalWidth = value;
        if (this._stripeBlackWidth >= this._stripeTotalWidth) {
            this._stripeBlackWidth = this._stripeTotalWidth -1;
        }
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

    toggleUseColor() {
        this.useColor = !this.useColor;
    }

    toggleUseStripes() {
        this.useStripes = !this.useStripes;
    }

    toggleLimitColor() {
        this.limitColor = !this.limitColor;
    }

    toggleUseColor1() {
        this.useColor1 = !this.useColor1;
    }

    toggleUseColor2() {
        this.useColor2 = !this.useColor2;
    }

    toggleUseColor3() {
        this.useColor3 = !this.useColor3;
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

