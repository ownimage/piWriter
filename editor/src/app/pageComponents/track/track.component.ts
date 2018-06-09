import {Component, Input, OnInit} from '@angular/core';
import {Track} from "../../../../../serverCommon/src/shared/model/track.model";

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

    constructor() {
    }

    ngOnInit() {
    }

}
