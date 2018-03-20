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
    console.log("toggleRepeat");
    this.track.repeat = ! this.track.repeat;
    console.log("this.track.repeat " + this.track.repeat);
  }

    toggleAutostartNext() {
        console.log("toggleAutostartNext");
        this.track.autostartNext = ! this.track.autostartNext;
        console.log("this.track.autostartNext " + this.track.autostartNext);
    }
}
