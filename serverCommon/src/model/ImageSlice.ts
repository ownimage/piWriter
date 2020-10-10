const debug = require("debug")("serverCommon/ImageSlice");
debug("### serverCommon/ImageSlice");

export type ImageSlice = { colorArray: Uint32Array, count: number };
