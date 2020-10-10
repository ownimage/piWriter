import {ServerTrack} from "../model/ServerTrack";
import {ImageSlice} from "../model/ImageSlice";

const Jimp = require("jimp");
const debug = require("debug")("serverCommon/mapper/ServerTrackToDeltaLMaxServerTrack");
debug("### serverCommon/mapper/ServerTrackToDeltaLMaxServerTrack");

export function ServerTrackToDeltaLMaxServerTrack(serverTrack: ServerTrack, max): ServerTrack {
    let image: ImageSlice[] = [];

    let last = null;
    for (let imageSlice of serverTrack.image) {
        last = limit(last, imageSlice, image, max);
    }

    return {image, track: serverTrack.track}
}

function limit(last: ImageSlice, imageSlice: ImageSlice, image: ImageSlice[], max): ImageSlice {
    let d = 0;
    let dMax = 0;
    for (let i in imageSlice.colorArray) {
        let to = Jimp.intToRGBA(imageSlice.colorArray[i]);
        if (last == null) {
            d = (to.r + to.g + to.b) / (255 * 3);
        } else {
            let from = Jimp.intToRGBA(last.colorArray[i]);
            d = (to.r - from.r + to.g - from.g + to.b - from.b) / (255 * 3);
        }
        dMax = (dMax > d) ? dMax : d;
    }

    if (dMax < max) {
        image.push(imageSlice);
        return imageSlice;
    } else {
        let altered = reduce(last, imageSlice);
        if (imageSlice.count == 1) {
            image.push(altered);
            return altered;
        } else {
            image.push(altered);
            image.push({colorArray: imageSlice.colorArray, count: imageSlice.count})
        }
    }
}

function reduce(one: ImageSlice, two: ImageSlice): ImageSlice {
    let colorArray = new Uint32Array(one.colorArray.length);
    for (let i in two.colorArray) {
        if (one != null) {
            let oneRGB = Jimp.intToRGBA(one.colorArray[i]);
            let twoRGB = Jimp.intToRGBA(two.colorArray[i]);
            let r = halfPositiveDifference(oneRGB.r, twoRGB.r);
            let g = halfPositiveDifference(oneRGB.g, twoRGB.g);
            let b = halfPositiveDifference(oneRGB.b, twoRGB.b);
            colorArray[i] = Jimp.rgbaToInt(r, g, b, twoRGB.a);

        } else {
            let twoRGB = Jimp.intToRGBA(one.colorArray[i]);
            colorArray[i] = Jimp.rgbaToInt(
                Math.floor(twoRGB.r / 2),
                Math.floor(twoRGB.g / 2),
                Math.floor(twoRGB.b / 2),
                twoRGB.a
            );
        }
    }
    return {colorArray, count: 1};
}

function halfPositiveDifference(from: number, to: number): number {
    return (to <= from) ? to : Math.floor(from + (to - from) / 2);
}

