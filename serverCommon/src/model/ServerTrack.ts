import {ImageSlice} from "./ImageSlice";
import {TrackDTO} from "../shared/dto/trackDTO.model";

const debug = require("debug")("serverCommon/ServerTrack");
debug("### serverCommon/ServerTrack");


export type ServerTrack = { image: ImageSlice[], track: TrackDTO };
