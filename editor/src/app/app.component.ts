import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment }from '../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

console.log("environment = " + JSON.stringify(environment));

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', ]
})
export class AppComponent {
  title = 'piWriter';
}
