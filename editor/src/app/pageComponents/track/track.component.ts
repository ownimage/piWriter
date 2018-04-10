import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {config} from '../../shared/config'
import {environment} from '../../../environments/environment';
import {Track} from '../../shared/model/track.model';

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
    @Output() onMoveUp = new EventEmitter();
    @Output() onMoveDown = new EventEmitter();
    @Output() onCut = new EventEmitter();
    icons = config.icons;
    restURL = environment.restURL;

    constructor() {
    }

    ngOnInit() {
    }

    toggleRepeat() {
        console.log('toggleRepeat ' + this.isPlayMode());
        if (this.isPlayMode()) return;
        this.track.repeat = !this.track.repeat;
        console.log('this.track.repeat ' + this.track.repeat);
    }

    toggleAutostartNext() {
        console.log('toggleAutostartNext');
        if (this.isPlayMode()) return;
        this.track.autostartNext = !this.track.autostartNext;
        console.log('this.track.autostartNext ' + this.track.autostartNext);
    }

    toggleEnabled() {
        console.log('toggleEnabled');
        if (this.isPlayMode()) return;
        this.track.enabled = !this.track.enabled;
        console.log('this.track.enabled ' + this.track.enabled);
    }

    moveUp(data) {
        //console.log('up ' + JSON.stringify(data));
        if (this.isPlayMode()) return;
        this.onMoveUp.emit(data);
    }

    moveDown(data) {
        //console.log('down ' + JSON.stringify(data));
        if (this.isPlayMode()) return;
        this.onMoveDown.emit(data);
    }

    cut(data) {
        //console.log('down ' + JSON.stringify(data));
        if (this.isPlayMode()) return;
        this.onCut.emit(data);
    }

    isPlayMode() {
        return this.mode == 'play';
    }

    isEditMode() {
        return !this.isPlayMode();
    }
}
