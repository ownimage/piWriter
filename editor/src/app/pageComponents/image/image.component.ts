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

    private naturalWidth = 0;
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
        return {
            'float': 'left',
            'background-color': 'black',
            'height': '50px',
        };
    }

    getImgStyle() {
        let transform = `scale(${this.scale})`;
        if (this.flipX) transform += ' scaleX(-1)';
        if (this.flipY) transform += ' scaleY(-1)';
        if (this.rotate == 90) transform += ' rotate(90deg)'
        if (this.rotate == 180) transform += ' rotate(180deg)'
        if (this.rotate == 270) transform += ' rotate(270deg)'
        return {
            'height': '50px',
            //'transform': `matrix(${transform.m11}, ${transform.m12}, ${transform.m21}, ${transform.m22}, ${tx}, ${ty})`,
            transform
        }
    }

}
