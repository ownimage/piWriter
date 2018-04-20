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

    private _value: number;

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
        if (v !== this._value) {
            this._value = v;
            this.onChangeCallback(v);
        }
    }

    onBlur() {
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.value) {
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