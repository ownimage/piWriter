const debug = require("debug")("serverCommon/mapper/playlistDTOToPlaylist");
debug("### serverCommon/mapper/playlistDTOToPlaylist");

const Jimp = require("jimp");

import { PlaylistDTO } from "../dto/playlistDTO.model";
import { Gallery } from "../model/Gallery";
import { Playlist } from "../model/Playlist";
import { rgbObject2Int, hexToRgb } from "../utils/ColorUtils";

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

                    image.flip(track.flipX, track.flipY);
                    image.rotate(track.rotate);
                    image.scale(track.scale * NUM_LEDS / image.bitmap.height);

                    if (track.useColor && (track.useColor1 || track.useColor2 || track.useColor3) ) {
                        for (let x = 0; x < image.bitmap.width; x++) {
                            for (let y = 0; y < image.bitmap.height; y++) {
                                let c = Jimp.intToRGBA(image.getPixelColor(x, y));
                                let r = 0;
                                let g = 0;
                                let b = 0;
                                let rmax = 0;
                                let gmax = 0;
                                let bmax = 0;

                                if (track.useColor1 && track.color1) {
                                    let color1 = hexToRgb(track.color1);
                                    r += c.r * color1.r;
                                    g += c.r * color1.g;
                                    b += c.r * color1.b;
                                    rmax += 255 * color1.r;
                                    gmax += 255 * color1.g;
                                    bmax += 255 * color1.b;
                                }
                                if (track.useColor2 && track.color2) {
                                    let color2 = hexToRgb(track.color2);
                                    r += c.g * color2.r;
                                    g += c.g * color2.g;
                                    b += c.g * color2.b;
                                    rmax += 255 * color2.r;
                                    gmax += 255 * color2.g;
                                    bmax += 255 * color2.b;
                                }
                                if (track.useColor3 && track.color3) {
                                    let color3 = hexToRgb(track.color3);
                                    r += c.b * color3.r;
                                    g += c.b * color3.g;
                                    b += c.b * color3.b;
                                    rmax += 255 * color3.r;
                                    gmax += 255 * color3.g;
                                    bmax += 255 * color3.b;
                                }

                                if (track.limitColor) {
                                    r = (r == 0) ? 0 : Math.round(255 * r / rmax);
                                    g = (g == 0) ? 0 : Math.round(255 * g / gmax);
                                    b = (b == 0) ? 0 : Math.round(255 * b / bmax);
                                } else {
                                    r = Math.min(255, Math.round(r / 255));
                                    g = Math.min(255, Math.round(g / 255));
                                    b = Math.min(255, Math.round(b / 255));
                                }

                                image.setPixelColor(Jimp.rgbaToInt(r, g, b, 255), x, y)
                            }
                        }
                    }

                    new Jimp(Math.round((track.marginLeft + 1 + track.marginRight) * image.bitmap.width), NUM_LEDS, 0x000000, (err, out) => {
                        let h = (track.alignment == 'middle') ? (NUM_LEDS - image.bitmap.height) / 2 :
                            (track.alignment == 'bottom') ? NUM_LEDS - image.bitmap.height : 0;
                        out.blit(image, Math.round(track.marginLeft * image.bitmap.width), h, 0, 0, image.bitmap.width, image.bitmap.height);

                        if (track.useStripes) {
                            debug("striping");
                            for (let x = 0; x < out.bitmap.width; x++) {
                                for (let y = 0; y < out.bitmap.height; y += track.stripeTotalWidth) {
                                    for (let s = 0; s < track.stripeBlackWidth; s++) {
                                        out.setPixelColor(0, x, y + s)
                                    }
                                }
                            }
                        }

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
        if (completeFn) { completeFn(); }
    });
    return new Playlist(tracks, gallery);
}
