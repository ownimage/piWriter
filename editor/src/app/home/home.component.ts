import {Component, OnInit} from '@angular/core';

import{slideInOutAnimation}from'../shared/animations';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations:[slideInOutAnimation],
    host:{'[@slideInOutAnimation]':''},
})
export class HomeComponent implements OnInit {

    name: string = "newPlaylistName.json"

    constructor() {
    }

    ngOnInit() {
    }

}
