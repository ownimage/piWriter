import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {
    @Input() value: boolean;
    @Input() enabled: boolean;
    @Output() toggleEvent = new EventEmitter();

    trueStyle = "fa fa-check";
    falseStyle = "fa fa-times";

    constructor() {
    }

    ngOnInit() {
    }

    getColor() {
        if (!this.enabled) return "grey";
        if (this.value) return "green";
        return "red";
    }

    getClass() {
        return this.value ? this.trueStyle : this.falseStyle;
    }

    toggle() {
        console.log("toggle ");
        this.toggleEvent.emit();
    }

}
