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
    @Input() flipX: boolean = false;
    @Input() flipY: boolean = false;
    @Input() rotate: number = 0; // must be one of 0, 90, 180, 270
    @Input() scale: number = 1; // must be 0.1 .. 1
    @Input() alignment: string = "top"; // must be one of "top", "middle", "bottom"
    @Input() marginLeft: number = 0;
    @Input() marginRight: number = 0;

    private naturalWidth = 0; // this is the size of the image
    private naturalHeight = 0;
    private srcOut: string;
    private image = null;

    private actualHeight = 50; // this is the nummber of pixels heigh on the screen

    constructor() {
    }

    ngOnChanges(changes) {
        if (changes.src && changes.src.firstChange) {
            Jimp.read(this.src).then((image) => {
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

            new Jimp(Math.round((this.marginLeft + 1 + this.marginRight) * clone.bitmap.width), this.actualHeight, 0x000000, (err, out) => {
                let h = (this.alignment == 'middle') ? (this.actualHeight - clone.bitmap.height) / 2 :
                    (this.alignment == 'bottom') ? this.actualHeight - clone.bitmap.height : 0;
                out.blit(clone, Math.round(this.marginLeft * clone.bitmap.width), h, 0, 0, clone.bitmap.width, clone.bitmap.height);
                out.getBase64(Jimp.MIME_BMP, (err, data) => {
                    this.srcOut = data;
                })
            });
        }
    }

}
