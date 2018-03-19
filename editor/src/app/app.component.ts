import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Track }from './shared/track.model';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', ]
})
export class AppComponent {

  title = 'piWriter';
  mode: string = 'Home';

  setMode(mode)  {
      this.mode = mode;
      console.log("Mode changed to: " + this.mode);
  }

}
