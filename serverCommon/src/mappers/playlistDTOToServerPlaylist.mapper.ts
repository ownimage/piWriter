import {PlaylistDTO} from "../shared/dto/playlistDTO.model";
import {ServerPlaylist} from "../model/ServerPlaylist";
import {tranformImage2} from "../shared/utils/TrackUtils";
import {ServerTrack} from "../model/ServerTrack";
import {ImageToTimedRGBArrays} from "./ImageToTimedRGBArrays.mapper";
import {TimedRGBArraysToServerTrack} from "./TimedRGBArraysToServerTrack.mapper";
import {ServerTrackToDeltaLMaxServerTrack} from "./ServerTrackToDeltaLMaxLimitedServerTrack.mapper";

const debug = require("debug")("serverCommon/mapper/playlistDTOToServerPlaylist");
debug("### serverCommon/mapper/playlistDTOToServerPlaylist");

const Jimp = require("jimp");

export async function playlistDTOToServerPlaylist(playlistDTO: PlaylistDTO,
                                                  NUM_LEDS,
                                                  brightness,
                                                  speed,
                                                  imagePixelTime,
                                                  neopixelRefreshTime,
                                                  lmax,
                                                  dlmax,
                                                  imagesFolder,
                                                  fontsFolder) {

    const tracks = playlistDTO.tracks.filter((p) => p.enabled);

    const serverPlaylist: ServerTrack[] = [];
    for (let track of tracks) {
        const fullPicturePath = (track.type == "image") ? imagesFolder + track.path : fontsFolder + track.path;
        const image = await Jimp.read(fullPicturePath);
        const transformedImage = await tranformImage2(image, track, brightness, NUM_LEDS, NUM_LEDS);
        const rgbArrays = ImageToTimedRGBArrays(transformedImage, track, speed, imagePixelTime, neopixelRefreshTime);
        const serverTrack = TimedRGBArraysToServerTrack(rgbArrays, track);
        //const limitedServerTrack = ServerTrackToDeltaLMaxServerTrack(serverTrack, dlmax);
        serverPlaylist.push(serverTrack);
    }

    return serverPlaylist;
}
