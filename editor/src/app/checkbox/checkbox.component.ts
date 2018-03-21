import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {
    @Input() value: boolean;
    @Input() enabled: boolean = true;
    @Input() styles: string[] = ["fa fa-check", "fa fa-cross"];
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
        return this.value ? this.styles[0] : this.styles[1];
    }

    toggle() {
        console.log("toggle ");
        this.toggleEvent.emit();
    }

}
