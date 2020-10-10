const debug = require("debug")("serverCommon/TimedRGBArray");
debug("### serverCommon/model/TimedRGBArray");

const Jimp = require("jimp");

export type RGB = { r: number, g: number, b: number };
export type TimedRGBArray = { colorArray: RGB[], duration: number };
