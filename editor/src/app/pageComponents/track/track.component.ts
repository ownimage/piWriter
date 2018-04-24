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

}
