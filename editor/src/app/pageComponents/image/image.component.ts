import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

const debug = require('debug')('piWriter/pageComponent/image.component.ts');

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
    @Input() src: string;
    @Input() flipX: boolean = false;
    @Input() flipY: boolean = false;
    @Input() rotate: number = 0; // must be one of 0, 90, 180, 270
    @Input() scale: number = 1; // must be 0.1 .. 1
    @Input() alignment: string = "top"; // must be one of "top", "middle", "bottom"

    @ViewChild('img') image: ElementRef;

    private naturalWidth = 0; // this is the size of the image
    private naturalHeight = 0;
    private ready: boolean = false;

    constructor() {
    }

    ngOnInit() {
    }

    imageLoad() {
        debug('imageLoad w x h = %d x %d', this.image.nativeElement.naturalWidth, this.image.nativeElement.naturalHeight);
        this.naturalWidth = this.image.nativeElement.naturalWidth;
        this.naturalHeight = this.image.nativeElement.naturalHeight;

        this.ready = true;
    }

    getDivStyle() {
        let width = (this.rotate == 0 || this.rotate == 180) ? this.scale * this.naturalWidth * 50 / this.naturalHeight :
            this.scale * this.naturalHeight * 50 / this.naturalWidth;
        let style = {
            'float': 'left',
            'background-color': 'pink',
            'height': '50px',
            'width': `${width}px`
        };
        debug('getDivStyle return %o', style);
        return style;
    }

    getImgStyle() {
        let scale = (this.rotate == 0 || this.rotate == 180) ? this.scale * 50 / this.naturalHeight :
            this.scale * 50 / this.naturalWidth;
        let scaledHeight = scale * this.naturalHeight;
        let scaledWidth = scale * this.naturalWidth;
        let scaledVertical = (this.rotate == 90 || this.rotate == 270) ? scaledWidth : scaledHeight;

        let transform = `scale(${scale}) `;
        if (this.flipX) transform = ` translate(${scaledWidth}px, 0px) scaleX(-1) ` + transform;
        if (this.flipY) transform = ` translate(0px, ${scaledHeight}px) scaleY(-1) ` + transform;

        //if (this.rotate == 0) transform = ` scale(${scale}) ` + transform;
        if (this.rotate == 90) transform = ` translate(${scaledHeight}px, 0px) rotate(90deg)` + transform;
        if (this.rotate == 180) transform = ` translate(${scaledWidth}px, ${scaledHeight}px) rotate(180deg) ` + transform;
        if (this.rotate == 270) transform = ` translate(0px, ${scaledWidth}px) rotate(270deg) ` + transform;

        if (this.alignment == 'middle') transform = ` translate(0px, ${(50 - scaledVertical)/2}px) ` + transform;
        if (this.alignment == 'bottom') transform = ` translate(0px, ${50 - scaledVertical}px) ` + transform;

        debug('getImgStyle return %o', transform);
        return {
            'transform-origin': '0px 0px',
            //'height': '50px',
            //'transform': `matrix(${transform.m11}, ${transform.m12}, ${transform.m21}, ${transform.m22}, ${tx}, ${ty})`,
            transform
        }
    }

}
