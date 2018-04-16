import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {config} from "../../shared/config";
import {Router} from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    @Input() leftIcon: string = '';
    @Output() leftIconClick = new EventEmitter();
    title = 'piWriter';
    icons = config.icons;

    constructor(private router: Router) {
    }

    ngOnInit() {
        console.log(`leftIcon =${this.leftIcon}`);
    }

    doLeftIconClick(x) {
        console.log('onClick()');
        this.leftIconClick.emit(x);
    }

    doMenuClick() {
        this.router.navigate(['/', 'settings']);
    }


}
