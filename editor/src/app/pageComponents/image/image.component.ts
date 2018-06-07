import {Component, Input, OnChanges} from '@angular/core';
import {Track} from "../../../../../serverCommon/src/shared/model/track.model";

const Jimp = require('../../../../../serverCommon/node_modules/jimp');
const debug = require('debug')('piWriter/pageComponent/image.component.ts');

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnChanges {
    @Input() src: string;
    @Input() height: number;

    @Input() track: Track;
    @Input() trackVersion: number; // this is just to trigger change detection

    private naturalWidth = 0; // this is the size of the image
    private naturalHeight = 0;
    public srcOut: string;
    private image = null;

    private actualHeight = 144; // this is the nummber of pixels heigh on the screen

    constructor() {
    }

    ngOnChanges(changes) {
        debug("ngOnChanges");
        if (changes.src && changes.src.firstChange) {
            debug("src.firstChange");
            debug(`encodeURI(this.src) = ${encodeURI(this.src)}`);
            Jimp.read(encodeURI(this.src)).then((image) => {
                debug("got image");
                this.image = image;
                this.ngOnChanges({});
            });
        } else if (this.image) {
            debug("!src.firstChange");
            let clone = this.image.clone();
            this.track.getBase64Tranform(this.image, this.actualHeight, this.height, (err, data) => {this.srcOut = data;});
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
