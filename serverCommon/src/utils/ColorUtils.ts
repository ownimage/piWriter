export {};

const debug = require("debug")("serverCommon/ColorUtils");
debug("### serverCommon/ColorUtils");

function isString(obj) {
    return (Object.prototype.toString.call(obj) === "[object String]");
}

// from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function rgbHex2Int(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return rgbValues2Int(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
}

export function rgbValues2Int(r, g, b) {
    // tslint:disable-next-line no-bitwise
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

export function rgbObject2Int(o) {
    return isString(o) ? rgbHex2Int(o) : rgbValues2Int(o.r, o.g, o.b);
}
