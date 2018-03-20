import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Track} from "../shared/track.model";

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {
    @Input() value: boolean;
    @Input() enabled: boolean;
    @Output() toggleEvent = new EventEmitter();

    constructor() {}

    getColor() {
        if (!this.enabled) return "grey";
        if (this.value) return "green";
        return "red";
    }

    ngOnInit() {}

    toggle() {
        console.log("toggle");
        this.value = !this.value;
        this.toggleEvent.emit();
    }

}
