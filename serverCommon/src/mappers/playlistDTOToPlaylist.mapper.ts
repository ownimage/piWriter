const debug = require("debug")("serverCommon/mapper/playlistDTOToPlaylist");
debug("### serverCommon/mapper/playlistDTOToPlaylist");

const Jimp = require("jimp");

import { PlaylistDTO } from "../dto/PlaylistDTO";
import { Gallery } from "../model/Gallery";
import { Playlist } from "../model/Playlist";
import { rgbObject2Int } from "../utils/ColorUtils";

export function playlistDTOToPlaylist(playlistDTO: PlaylistDTO,
                                      NUM_LEDS,
                                      brightness,
                                      imagesFolder,
                                      completeFn) {
    debug("serverCommon/Playlist:constructor");

    const gallery = new Gallery();
    const tracks = playlistDTO.tracks.filter((p) => p.enabled);

    debug("tracks = %O", tracks);
    const promises = tracks.map((track) => {
        if (!gallery.get(track)) { // dont process duplicates
            const fullPicturePath = imagesFolder + track.path;
            debug("fullPicturePath = %s", fullPicturePath);
            Jimp.read(fullPicturePath, (err, image) => {
                if (err) {
                    debug("Jimp Error: %o", err);
                } else {
                    const timedArrays = [];

                    // dont resize width as this affects timing
                    image.flip(track.flipX, track.flipY);
                    image.rotate(track.rotate);
                    image.scale(track.scale * NUM_LEDS / image.bitmap.height);
                    const verticalOffset = track.alignment === "top" ? 0
                        : track.alignment === "middle" ? Math.floor((NUM_LEDS - image.bitmap.height) / 2)
                            : NUM_LEDS - image.bitmap.height;
                    let blankArray = {t: 1, ca: new Uint32Array(NUM_LEDS)};
                    for (let x=0; x < image.bitmap.width * track.marginLeft; x++) {
                        timedArrays.push(blankArray);
                    }
                    for (let x = 0; x < image.bitmap.width; x++) {
                        const colorArray = new Uint32Array(NUM_LEDS);
                        for (let y = 0; y < image.bitmap.height; y++) {
                            const color = Jimp.intToRGBA(image.getPixelColor(x, y));
                            const b = (track.brightness / 255.0) * (brightness / 255.0);
                            const color2 = {
                                b: color.b * b,
                                g: color.g * b,
                                r: color.r * b,
                            };
                            colorArray[NUM_LEDS - 1 - y - verticalOffset] = rgbObject2Int(color2);
                        }
                        const a = {t: 1, ca: colorArray};
                        timedArrays.push(a);
                    }
                    for (let x=0; x < image.bitmap.width * track.marginRight; x++) {
                        timedArrays.push(blankArray);
                    }
                    gallery.put(track, {timedArrays});
                }
            });
        }
    });

    Promise.all(promises).then(() => {
        if (completeFn) { completeFn(); }
    });
    return new Playlist(tracks, gallery);
}
