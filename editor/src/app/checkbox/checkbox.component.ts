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
    @Input() forObject: any; // if a forObject is specified then it will be sent the toggle event, otherwise value will be toggled
    @Output() toggleEvent = new EventEmitter();

    trueStyle = "fa fa-check";
    falseStyle = "fa fa-times";

    constructor() {}

    ngOnInit() {}

    getColor() {
        if (!this.enabled) return "grey";
        if (this.value) return "green";
        return "red";
    }

    getClass() {
        return this.value ? this.trueStyle : this.falseStyle;
    }

    toggle() {
        console.log("toggle " + JSON.stringify(this.forObject));
        if (this.forObject) {
            this.toggleEvent.emit(this.forObject);
        } else {
            this.value = !this.value;
        }
    }

}
