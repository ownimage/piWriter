import {playlistDTOToPlaylist} from "../shared/mappers/playlistDTOToPlaylist.mapper";
import {PlaylistDTO} from "../shared/dto/playlistDTO.model";
import {ServerGallery} from "../model/ServerGallery";
import {ServerPlaylist} from "../model/ServerPlaylist";
import {rgbObject2Int} from "../shared/utils/ColorUtils";
import {tranformImage} from "../shared/utils/TrackUtils";

const debug = require("debug")("serverCommon/mapper/playlistDTOToPlaylist");
debug("### serverCommon/mapper/playlistDTOToPlaylist");

const Jimp = require("jimp");

export function playlistDTOToServerPlaylist(playlistDTO: PlaylistDTO,
                                            NUM_LEDS,
                                            brightness,
                                            imagesFolder,
                                            fontsFolder,
                                            completeFn) {
    debug("serverCommon/Playlist:constructor");

    const gallery = new ServerGallery();
    const playlist = playlistDTOToPlaylist("", playlistDTO);
    const tracks = playlist.tracks.filter((p) => p.enabled);

    debug("tracks = %O", tracks);
    const promises = tracks.map((track) => {
        if (!gallery.get(track)) { // dont process duplicates
            const fullPicturePath = (track.type == "image") ? imagesFolder + track.path : fontsFolder + track.path;
            debug("fullPicturePath = %s", fullPicturePath);
            Jimp.read(fullPicturePath, (err, image) => {
                if (err) {
                } else {
                    const timedArrays = [];
                    tranformImage(track, image, NUM_LEDS, NUM_LEDS, (err, out) => {

                        for (let x = 0; x < out.bitmap.width; x++) {
                            const colorArray = new Uint32Array(NUM_LEDS);
                            for (let y = 0; y < out.bitmap.height; y++) {
                                const color = Jimp.intToRGBA(out.getPixelColor(x, y));
                                const b = (track.brightness / 255.0) * (brightness / 255.0);
                                const color2 = {
                                    b: color.b * b,
                                    g: color.g * b,
                                    r: color.r * b,
                                };
                                colorArray[NUM_LEDS - 1 - y] = rgbObject2Int(color2);
                            }
                            const a = {t: 1, ca: colorArray};
                            timedArrays.push(a);
                        }
                        gallery.put(track, {timedArrays});
                    });
                }
            });
        }
    });

    Promise.all(promises).then(() => {
        if (completeFn) {
            completeFn();
        }
    });
    return new ServerPlaylist(tracks, gallery);
}
