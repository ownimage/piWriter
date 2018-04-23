import {Component, forwardRef, Input, OnInit} from '@angular/core';

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

//from https://www.w3schools.com/howto/howto_js_rangeslider.asp
// and https://embed.plnkr.co/nqKUSPWb6w5QXr8a0wEu/?show=preview

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SliderComponent),
    multi: true
};


@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.css'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class SliderComponent implements OnInit, ControlValueAccessor {
    @Input() min: number;
    @Input() max: number;
    @Input() round: boolean;

    private _value: number;
    private sliderMax: number = 1000;

    constructor() {
    }

    ngOnInit() {
    }

    private onChangeCallback: (_: any) => void = noop;
    private onTouchedCallback: () => void = noop;

    //get accessor
    get value(): any {
        return this._value;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        this._value = v;
        if (v != this._value && this._value) { // dont sent out update when initializing (i.e setting from undefined
            this.onChangeCallback(v);
        }
    }

    //get accessor
    get sliderValue(): number {
        let x = this.sliderMax * (this._value - this.min) / (this.max - this.min);
        return x;
    };

    //set accessor including call the onchange callback
    set sliderValue(v: number) {
        if (v !== this.sliderValue) {
            // Note below without the Number to start it uses string addition rather than number addition
            let newValue = Number(this.min) + (v / this.sliderMax) * (this.max - this.min);
            this._value = this.round ? Math.round(newValue) : newValue;
            this.onChangeCallback(this._value);
        }
    }

    onBlur() {
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value != this.value) {
            this.value = value;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

}