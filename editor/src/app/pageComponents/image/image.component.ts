import {Component, Input, OnChanges} from '@angular/core';

const Jimp = require('jimp');
const debug = require('debug')('piWriter/pageComponent/image.component.ts');

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnChanges {
    @Input() src: string;
    @Input() height: number;

    @Input() flipX: boolean = false;
    @Input() flipY: boolean = false;
    @Input() rotate: number = 0; // must be one of 0, 90, 180, 270
    @Input() scale: number = 1; // must be 0.1 .. 1
    @Input() alignment: string = "top"; // must be one of "top", "middle", "bottom"
    @Input() marginLeft: number = 0;
    @Input() marginRight: number = 0;

    @Input() useColor: boolean;
    @Input() limitColor: boolean;
    @Input() useColor1: boolean;
    @Input() color1: string;
    @Input() useColor2: boolean;
    @Input() color2: string;
    @Input() useColor3: boolean;
    @Input() color3: string;

    @Input() useStripes: string;
    @Input() stripeBlackWidth: number = 1;
    @Input() stripeTotalWidth: number = 2;

    private naturalWidth = 0; // this is the size of the image
    private naturalHeight = 0;
    public srcOut: string;
    private image = null;

    private actualHeight = 144; // this is the nummber of pixels heigh on the screen

    constructor() {
    }

    ngOnChanges(changes) {
        if (changes.src && changes.src.firstChange) {
            Jimp.read(encodeURI(this.src)).then((image) => {
                this.naturalWidth = image.bitmap.width;
                this.naturalHeight = image.bitmap.height;
                this.image = image;
                this.ngOnChanges({});
            });
        } else if (this.image) {
            let clone = this.image.clone();
            clone.flip(this.flipX, this.flipY);
            clone.rotate(this.rotate);
            clone.scale(this.scale * this.actualHeight / clone.bitmap.height);

            if (this.useColor && (this.useColor1 || this.useColor2 || this.useColor3) ) {
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

            new Jimp(Math.round((this.marginLeft + 1 + this.marginRight) * clone.bitmap.width), this.actualHeight, 0x000000, (err, out) => {
                let h = (this.alignment == 'middle') ? (this.actualHeight - clone.bitmap.height) / 2 :
                    (this.alignment == 'bottom') ? this.actualHeight - clone.bitmap.height : 0;
                out.blit(clone, Math.round(this.marginLeft * clone.bitmap.width), h, 0, 0, clone.bitmap.width, clone.bitmap.height);

                if (this.useStripes == 'horizontal') {
                    for (let x = 0; x < out.bitmap.width; x++) {
                        for (let y = 0; y < out.bitmap.height; y += this.stripeTotalWidth) {
                            for (let s = 0; s < this.stripeBlackWidth; s++) {
                                out.setPixelColor(0, x, y+s)
                            }
                        }
                    }
                }

                if (this.useStripes == 'vertical') {
                    for (let y = 0; y < out.bitmap.height; y++) {
                        for (let x = 0; x < out.bitmap.width; x += this.stripeTotalWidth) {
                            for (let s = 0; s < this.stripeBlackWidth; s++) {
                                out.setPixelColor(0, x+s, y)
                            }
                        }
                    }
                }

                if (this.height && this.height != out.bitmap.height) {
                    out.scale(this.height / out.bitmap.height);
                }

                out.getBase64(Jimp.MIME_BMP, (err, data) => {
                    this.srcOut = data;
                })
            });
        }
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
