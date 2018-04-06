import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    @Input() leftIcon: string = '';
    @Output() leftIconClick = new EventEmitter();

    constructor() {
    }

    title = 'piWriter';

    ngOnInit() {
        console.log(`leftIcon =${this.leftIcon}`);
    }

    doLeftIconClick(x) {
        console.log('onClick()');
        this.leftIconClick.emit(x);
    }
    doMenuClick() {
        console.log('x doMenuClick()');
    }


}
