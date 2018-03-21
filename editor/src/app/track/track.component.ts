import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Track} from '../shared/track.model';

@Component({
    selector: 'app-track',
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
    @Input() track: Track;
    @Input() isFirst: boolean;
    @Input() isLast: boolean;
    @Input() showButtons: boolean = true;
    @Output() onMoveUp = new EventEmitter();
    @Output() onMoveDown = new EventEmitter();
    @Output() onCut = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    toggleRepeat() {
        console.log("toggleRepeat");
        this.track.repeat = !this.track.repeat;
        console.log("this.track.repeat " + this.track.repeat);
    }

    toggleAutostartNext() {
        console.log("toggleAutostartNext");
        this.track.autostartNext = !this.track.autostartNext;
        console.log("this.track.autostartNext " + this.track.autostartNext);
    }

    moveUp(data) {
        console.log("up " + JSON.stringify(data));
        this.onMoveUp.emit(data);
    }

    moveDown(data) {
        console.log("down " + JSON.stringify(data));
        this.onMoveDown.emit(data);
    }

    cut(data) {
        console.log("down " + JSON.stringify(data));
        this.onCut.emit(data);
    }}
