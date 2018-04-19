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

    toggleRepeat() {
        debug('toggleRepeat %s', this.isPlayMode());
        if (this.isPlayMode()) return;
        this.track.repeat = !this.track.repeat;
        debug('this.track.repeat %s', this.track.repeat);
    }

    toggleAutostartNext() {
        debug('toggleAutostartNext');
        if (this.isPlayMode()) return;
        this.track.autostartNext = !this.track.autostartNext;
        debug('this.track.autostartNext %s', this.track.autostartNext);
    }

    toggleEnabled() {
        debug('toggleEnabled');
        if (this.isPlayMode()) return;
        this.track.enabled = !this.track.enabled;
        debug('this.track.enabled %s', this.track.enabled);
    }

    isPlayMode() {
        return this.mode == 'play';
    }

    isEditMode() {
        return !this.isPlayMode();
    }
}
