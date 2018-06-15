import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Track} from "../../../../../serverCommon/src/shared/model/track.model";
import {environment} from '../../../environments/environment';

const Jimp = require('../../../../../serverCommon/node_modules/jimp');
const debug = require('debug')('piWriter/pageComponent/image.component.ts');

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit, OnChanges {
    @Input() height: number;

    @Input() track: Track;
    @Input() trackVersion: number; // this is just to trigger change detection

    private currentPath = ""; // this is used to prevent the need to reread the image if src has not changed
    private src: string = "";
    public srcOut: string;
    private image = null;

    private actualHeight = 144; // this is the nummber of pixels heigh on the screen

    constructor() {
    }

    ngOnInit() {
        this.ngOnChanges({});
    }

    ngOnChanges(changes) {
        debug("ngOnChanges");

        if (this.currentPath != this.track.path) {
            this.currentPath = this.track.path;

            if (this.track.type == "image") this.src = environment.restURL + "/images" + this.track.path;
            if (this.track.type == "text") this.src = environment.restURL + "/fonts" + this.track.path;

            debug(`src = ${this.src}`);
            Jimp.read(encodeURI(this.src)).then((image) => {
                debug("got image");
                this.image = image;
                this.updateSrcOut();
            });
        }

        this.updateSrcOut();
    }


    updateSrcOut() {
        if (this.image) {
            this.track.getBase64Tranform(this.image, this.actualHeight, this.height, (err, data) => {
                this.srcOut = data;
            });
        }
    }


}
