import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {config} from '../../shared/config'
import {environment} from '../../../environments/environment';
import {Track} from '../../shared/model/track.model';

const debug = require('debug')('piWriter/track.component.ts');

@Component({
    selector: 'app-track',
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
    @Input() track: Track;
    @Input() isFirst: boolean;
    @Input() isLast: boolean;
    @Input() mode: string = "";

    icons = config.icons;
    restURL = environment.restURL;

    constructor() {
    }

    ngOnInit() {
    }

    isPlayMode() {
        return this.mode == 'play';
    }

    isEditMode() {
        return !this.isPlayMode();
    }

    getRotateStyle() {
        if (this.track.rotate == 90) return [config.icons.rotate90];
        if (this.track.rotate == 180) return [config.icons.rotate180];
        if (this.track.rotate == 270) return [config.icons.rotate270];
        return [config.icons.rotate0];
    }

    getAlignmentStyle() {
        if (this.track.alignment == "middle") return [config.icons.alignMiddle];
        if (this.track.alignment == "bottom") return [config.icons.alignBottom];
        return [config.icons.alignTop];
    }

}
