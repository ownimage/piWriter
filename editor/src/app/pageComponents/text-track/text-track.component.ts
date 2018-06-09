import {Component, Input, OnInit} from '@angular/core';
import {Track} from "../../../../../serverCommon/src/shared/model/track.model";

@Component({
  selector: 'app-text-track',
  templateUrl: './text-track.component.html',
  styleUrls: ['./text-track.component.css']
})
export class TextTrackComponent implements OnInit {

    @Input() track: Track;
    @Input() isFirst: boolean;
    @Input() isLast: boolean;
    @Input() mode: string = "";

    constructor() { }

  ngOnInit() {
  }

}
