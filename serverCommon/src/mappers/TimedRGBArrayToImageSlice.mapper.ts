import {rgbObject2Int} from "../shared/utils/ColorUtils";
import {RGB, TimedRGBArray} from "../model/TimedRGBArray";
import {ImageSlice} from "../model/ImageSlice";

const debug = require("debug")("serverCommon/mapper/TimedRGBArrayToImageSlice");
debug("### serverCommon/mapper/TimedRGBArrayToImageSlice");

export function TimedRGBArrayToImageSlice(start: TimedRGBArray, next: TimedRGBArray): { remainder: TimedRGBArray, imageSlice: ImageSlice } {
    if (start == null || start.duration <= 0) {
        let count = Math.floor(next.duration);
        let fraction = next.duration - count;
        let remainder: TimedRGBArray = {colorArray: next.colorArray, duration: fraction};
        let imageSlice: ImageSlice = null;
        if (count >=1) {
            let length = next.colorArray.length;
            let colorArray: Uint32Array = new Uint32Array(length);
            for (let i = 0; i < length; i++) {
                colorArray[length - 1 - i] = rgbObject2Int(next.colorArray[i]);
            }
            imageSlice = {colorArray, count};
        }
        return {remainder, imageSlice};
    }
    if (next == null) {
        let count = Math.floor(start.duration);
        let length = start.colorArray.length;
        let colorArray: Uint32Array = new Uint32Array(length);
        for (let i = 0; i < length; i++) {
            let c = start.colorArray[i];
            let c2 = {
                r: Math.min(255, Math.floor(c.r * start.duration)),
                g: Math.min(255, Math.floor(c.g * start.duration)),
                b: Math.min(255, Math.floor(c.b * start.duration))
            };
            colorArray[length - 1 - i] = rgbObject2Int(c2);
        }
        let imageSlice: ImageSlice = {colorArray, count};
        return {remainder: null, imageSlice};
    }
    // there are two cases, 1 start.duration + next.duration >= 1, 2 other
    if (start.duration + next.duration >= 1) {
        let count = Math.floor(start.duration + next.duration);
        let fraction = start.duration + next.duration - count;
        let remainder: TimedRGBArray = {colorArray: next.colorArray, duration: fraction};
        let length = next.colorArray.length;
        let colorArray: Uint32Array = new Uint32Array(length);
        for (let i = 0; i < length; i++) {
            let cStart = start.colorArray[i];
            let cNext = next.colorArray[i];
            let color = {
                r: Math.min(255, Math.floor(cStart.r * start.duration + cNext.r * (1.0 - start.duration))),
                g: Math.min(255, Math.floor(cStart.g * start.duration + cNext.g * (1.0 - start.duration))),
                b: Math.min(255, Math.floor(cStart.b * start.duration + cNext.b * (1.0 - start.duration)))
            };
            colorArray[length - 1 - i] = rgbObject2Int(next.colorArray[i]);
        }
        let imageSlice: ImageSlice = {colorArray, count};
        return {remainder, imageSlice}
    }
    // other
    let colorArray: RGB[] = [];
    for (let i = 0; i < start.colorArray.length; i++) {
        let cStart = start.colorArray[i];
        let cNext = next.colorArray[i];
        let color = {
            r: cStart.r * start.duration + cNext.r * next.duration,
            g: cStart.g * start.duration + cNext.g * next.duration,
            b: cStart.b * start.duration + cNext.b * next.duration
        };
        colorArray.push(color);
    }
    let remainder: TimedRGBArray = {colorArray, duration: start.duration + next.duration};
    return {remainder, imageSlice: null};
}


