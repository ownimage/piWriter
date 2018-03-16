import { Component } from '@angular/core';

import { Track }from './shared/track.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tracks: Track[] = [
    new Track("trackName1", "trackLocation"),
    new Track("trackName2", "trackLocation")
  ];

  title = 'piWriter';
  mode: string = 'Home';

  setMode(mode)  {
      this.mode = mode;
      console.log("Mode changed to: " + this.mode);
  }

}
