import {Component, Input, OnInit} from '@angular/core';

import { Track }from '../shared/track.model';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
  @Input('track') track: Track;

  constructor() { }

  ngOnInit() {
  }

  toggleRepeat() {
    this.track.repeat = ! this.track.repeat;
  }
}
