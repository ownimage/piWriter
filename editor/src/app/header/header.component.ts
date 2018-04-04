import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    @Input() leftIcon: string = '';
    @Output() click = new EventEmitter();

    constructor() {
    }

    title = 'piWriter';

    ngOnInit() {
        console.log(`leftIcon =${this.leftIcon}`);
    }

    doClick(x) {
        console.log('onClick()');
        this.click.emit(x);
    }

}
