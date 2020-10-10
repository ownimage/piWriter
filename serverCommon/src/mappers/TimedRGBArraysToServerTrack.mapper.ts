import {TimedRGBArrayToImageSlice} from "./TimedRGBArrayToImageSlice.mapper";
import {TimedRGBArray} from "../model/TimedRGBArray";
import {ImageSlice} from "../model/ImageSlice";
import {TrackDTO} from "../shared/dto/trackDTO.model";
import {ServerTrack} from "../model/ServerTrack";

const debug = require("debug")("serverCommon/mapper/TimedRGBArraysToServerTrack");
debug("### serverCommon/mapper/TimedRGBArraysToServerTrack");

export function TimedRGBArraysToServerTrack(timedRGBArrays: TimedRGBArray[], track: TrackDTO): ServerTrack {
    let image: ImageSlice[] = new Array<ImageSlice>();
    let remainder: TimedRGBArray = null;
    for (let timedRGBArray of timedRGBArrays) {
        let result = TimedRGBArrayToImageSlice(remainder, timedRGBArray);
        remainder = result.remainder;
        if (result.imageSlice) image.push(result.imageSlice);
    }
    let result = TimedRGBArrayToImageSlice(remainder, null);
    if (result.imageSlice) image.push(result.imageSlice);

    return {image, track};
}


