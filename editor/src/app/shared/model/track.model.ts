import {Playlist} from './playlist.model';

const Jimp = require('jimp');

export class Track {
    private _version: number = 0;

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
                private _alignment: string = 'top',
                private _rotate: number = 0,
                private _marginLeft: number = 0,
                private _marginRight: number = 0,
                private _useColor: boolean = false,
                private _limitColor: boolean = false,
                private _useColor1: boolean = false,
                private _color1: string = "",
                private _useColor2: boolean = false,
                private _color2: string = '',
                private _useColor3: boolean = false,
                private _color3: string = '',
                private _useStripes: string = 'false',
                private _stripeBlackWidth: number = 1,
                private _stripeTotalWidth: number = 2) {
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
        );
    }

    get version(): number {
        return this._version;
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

    get useStripes(): string {
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

    set useStripes(value: string) {
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
            this._stripeBlackWidth = this._stripeTotalWidth - 1;
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
        if (this.useStripes == 'false') this.useStripes = 'horizontal';
        else if (this.useStripes == 'horizontal') this.useStripes = 'vertical';
        else this.useStripes = 'false';
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
        this._version++;
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

    canCopySettings() {
        return this.playlist.getPrevious(this) != null;
    }

    copySettings() {
        let track = this.playlist.getPrevious(this);
        this._speed = track._speed;
        this._brightness = track._brightness;
        this._scale = track._scale;
        this._alignment = track._alignment;
        this._useColor = track._useColor;
        this._limitColor = track._limitColor;
        this._useColor1 = track._useColor1;
        this._color1 = track._color1;
        this._useColor2 = track._useColor2;
        this._color2 = track._color2;
        this._useColor3 = track._useColor3;
        this._color3 = track._color3;
        this._useStripes = track._useStripes;
        this._stripeBlackWidth = track._stripeBlackWidth;
        this._stripeTotalWidth = track._stripeTotalWidth;
    }

    getBase64Tranform(image, NUM_LEDS, height, callback) {
        let clone = image.clone();
        clone.flip(this.flipX, this.flipY);
        clone.rotate(this.rotate);
        clone.scale(this.scale * NUM_LEDS / clone.bitmap.height);

        if (this.useColor && (this.useColor1 || this.useColor2 || this.useColor3)) {
            for (let x = 0; x < clone.bitmap.width; x++) {
                for (let y = 0; y < clone.bitmap.height; y++) {
                    let c = Jimp.intToRGBA(clone.getPixelColor(x, y));
                    let r = 0;
                    let g = 0;
                    let b = 0;
                    let rmax = 0;
                    let gmax = 0;
                    let bmax = 0;

                    if (this.useColor1 && this.color1) {
                        let color1 = this.hexToRgb(this.color1);
                        r += c.r * color1.r;
                        g += c.r * color1.g;
                        b += c.r * color1.b;
                        rmax += 255 * color1.r;
                        gmax += 255 * color1.g;
                        bmax += 255 * color1.b;
                    }
                    if (this.useColor2 && this.color2) {
                        let color2 = this.hexToRgb(this.color2);
                        r += c.g * color2.r;
                        g += c.g * color2.g;
                        b += c.g * color2.b;
                        rmax += 255 * color2.r;
                        gmax += 255 * color2.g;
                        bmax += 255 * color2.b;
                    }
                    if (this.useColor3 && this.color3) {
                        let color3 = this.hexToRgb(this.color3);
                        r += c.b * color3.r;
                        g += c.b * color3.g;
                        b += c.b * color3.b;
                        rmax += 255 * color3.r;
                        gmax += 255 * color3.g;
                        bmax += 255 * color3.b;
                    }

                    if (this.limitColor) {
                        r = (r == 0) ? 0 : Math.round(255 * r / rmax);
                        g = (g == 0) ? 0 : Math.round(255 * g / gmax);
                        b = (b == 0) ? 0 : Math.round(255 * b / bmax);
                    } else {
                        r = Math.min(255, Math.round(r / 255));
                        g = Math.min(255, Math.round(g / 255));
                        b = Math.min(255, Math.round(b / 255));
                    }

                    clone.setPixelColor(Jimp.rgbaToInt(r, g, b, 255), x, y)
                }
            }
        }

        new Jimp(Math.round((this.marginLeft + 1 + this.marginRight) * clone.bitmap.width), NUM_LEDS, 0x000000, (err, out) => {
            let h = (this.alignment == 'middle') ? (NUM_LEDS - clone.bitmap.height) / 2 :
                (this.alignment == 'bottom') ? NUM_LEDS - clone.bitmap.height : 0;
            out.blit(clone, Math.round(this.marginLeft * clone.bitmap.width), h, 0, 0, clone.bitmap.width, clone.bitmap.height);

            if (this.useStripes == 'horizontal') {
                for (let x = 0; x < out.bitmap.width; x++) {
                    for (let y = 0; y < out.bitmap.height; y += this.stripeTotalWidth) {
                        for (let s = 0; s < this.stripeBlackWidth; s++) {
                            out.setPixelColor(0, x, y + s)
                        }
                    }
                }
            }

            if (this.useStripes == 'vertical') {
                for (let y = 0; y < out.bitmap.height; y++) {
                    for (let x = 0; x < out.bitmap.width; x += this.stripeTotalWidth) {
                        for (let s = 0; s < this.stripeBlackWidth; s++) {
                            out.setPixelColor(0, x + s, y)
                        }
                    }
                }
            }

            if (height && height != out.bitmap.height) {
                out.scale(height / out.bitmap.height);
            }

            out.getBase64(Jimp.MIME_BMP, (err, data) => callback(err, data));
        });
    }


// from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}

