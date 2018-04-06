import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {config} from '../../shared/config';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {
    @Input() value: boolean;
    @Input() enabled: boolean = true;
    @Input() styles: string[] = [config.icons.tick, config.icons.cross];
    @Input() colors: string[] = ["green", "red", "grey"];
    @Output() toggleEvent = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    getColor() {
        if (!this.enabled) return this.colors[2];
        if (this.value) return this.colors[0];
        return this.colors[1];
    }

    getClass() {
        if (!this.enabled && this.styles.length >= 3) return this.styles[2];
        else if (!this.value && this.styles.length >= 2) return this.styles[1];
        else return this.styles[0];
    }

    toggle() {
        console.log("toggle ");
        this.toggleEvent.emit();
    }

}
