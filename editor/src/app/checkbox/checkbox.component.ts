import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {
    @Input() value: boolean;
    @Input() enabled: boolean;
    @Input() trueStyle: string = "fa fa-check";
    @Input() falseStyle: string = "fa fa-times";
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
        return this.value ? this.trueStyle : this.falseStyle;
    }

    toggle() {
        console.log("toggle ");
        this.toggleEvent.emit();
    }

}
