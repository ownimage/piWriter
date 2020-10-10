import {RGB, TimedRGBArray} from "../model/TimedRGBArray";
import {TrackDTO} from "../shared/dto/trackDTO.model";

const debug = require("debug")("serverCommon/mapper/ImageToTimedRGBArrays");
debug("### serverCommon/mapper/ImageToTimedRGBArrays");

const Jimp = require("jimp");

export function ImageToTimedRGBArrays(image, track: TrackDTO, speed: number, imagePixelTime, neopixelRefreshTime): TimedRGBArray[] {
    let duration = imagePixelTime / (neopixelRefreshTime * track.speed * speed);
    let timedRGBArrays: TimedRGBArray[] = [];
    for (let x = 0; x < image.bitmap.width; x++) {
        let colorArray: RGB[] = new Array<RGB>(image.bitmap.height);
        for (let y = 0; y < image.bitmap.height; y++) {
            const color = Jimp.intToRGBA(image.getPixelColor(x, y));
            const color2 = {b: color.b, g: color.g, r: color.r,};
            colorArray[y] = color2;
        }
        let timedRGBArray = {colorArray, duration};
        timedRGBArrays.push(timedRGBArray);
    }
    return timedRGBArrays;
}

