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
        if (this.styles.length == 1 || this.value || (this.styles.length == 2 && !this.enabled)) return this.styles[0];
        if (this.styles.length == 2 && !this.value) return this.styles[1];
        if (this.styles.length == 3 && !this.enabled) return this.styles[2];
    }

    toggle() {
        console.log("toggle ");
        this.toggleEvent.emit();
    }

}
