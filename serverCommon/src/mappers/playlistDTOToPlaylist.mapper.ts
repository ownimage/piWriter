const debug = require('debug')('serverCommon/mapper/playlistDTOToPlaylist');
debug('### serverCommon/mapper/playlistDTOToPlaylist');

const Jimp = require('jimp');

import  {rgbObject2Int} from '../utils/ColorUtils';
import {PlaylistDTO} from '../dto/PlaylistDTO';
import {Playlist} from '../model/Playlist';
import {Gallery} from '../model/Gallery';

export function playlistDTOToPlaylist(playlistDTO: PlaylistDTO,
                               NUM_LEDS,
                               brightness,
                               imagesFolder,
                               completeFn) {
    debug('serverCommon/Playlist:constructor');

    let gallery = new Gallery();
    let tracks = playlistDTO.tracks.filter(p => p.enabled);

    debug('tracks = %O', tracks);
    let promises = tracks.map(track => {
        if (!gallery.get(track)) { // dont process duplicates
            let fullPicturePath = imagesFolder + track.path;
            debug('fullPicturePath = %s', fullPicturePath);
            Jimp.read(fullPicturePath, function (err, image) {
                if (err) {
                    debug('Jimp Error: %o', err);
                }
                else {
                    let timedArrays = [];

                    // dont resize width as this affects timing
                    image.flip(track.flipX, track.flipY);
                    image.rotate(track.rotate);
                    image.scale(track.scale * NUM_LEDS /image.bitmap.height);
                    let verticalOffset = track.alignment == "top" ? 0
                        : track.alignment == "middle" ? Math.floor((NUM_LEDS - image.bitmap.height) / 2)
                            : NUM_LEDS - image.bitmap.height;
                    for (let x = 0; x < image.bitmap.width; x++) {
                        let colorArray = new Uint32Array(NUM_LEDS);
                        for (let y = 0; y < image.bitmap.height; y++) {
                            let color = Jimp.intToRGBA(image.getPixelColor(x, y));
                            let b = (track.brightness / 255.0) * (brightness / 255.0);
                            let color2 = {
                                r: color.r * b,
                                g: color.g * b,
                                b: color.b * b,
                            };
                            colorArray[NUM_LEDS - 1 - y - verticalOffset] = rgbObject2Int(color2);
                        }
                        let a = {t: 1, ca: colorArray};
                        timedArrays.push(a);
                    }
                    gallery.put(track, {timedArrays});
                }
            });
        }
    });

    Promise.all(promises).then(() => {
        if (completeFn) completeFn();
    });
    return new Playlist(tracks, gallery);
};


