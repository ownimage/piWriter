const debug = require('debug')('serverCommon/mapper/playlistDTOToPlaylist');
debug('### serverCommon/mapper/playlistDTOToPlaylist');

const Jimp = require('jimp');


const {rgbObject2Int} = require('../utils/ColorUtils');
import {PlaylistDTO} from '../dto/PlaylistDTO';

const {Playlist} = require('../model/Playlist');

const {Gallery} = require('../model/Gallery');


const playlistDTOToPlaylist = (playlistDTO: PlaylistDTO,
                               config,) => {
    debug('serverCommon/Playlist:constructor');

    let gallery = new Gallery();
    let tracks = playlistDTO.tracks.filter(p => p.enabled);

    debug('tracks = %O', tracks);
    tracks.map(track => {
        if (!gallery.get(track)) { // dont process duplicates
            let fullPicturePath = config.imagesFolder + track.path;
            debug('fullPicturePath = %s', fullPicturePath);
            Jimp.read(fullPicturePath, function (err, image) {
                if (err) {
                    debug('Jimp Error: %o', err);
                }
                else {
                    let timedArrays = [];

                    let height = Math.min(image.bitmap.height, config.NUM_LEDS);
                    // dont resize width as this affects timing
                    image.resize(image.bitmap.width, height);
                    image.flip(track.flipX, track.flipY);
                    for (let i = 0; i < image.bitmap.width; i++) {
                        let colorArray = new Uint32Array(config.NUM_LEDS);
                        for (let j = 0; j < height; j++) {
                            let color = Jimp.intToRGBA(image.getPixelColor(i, j));
                            let brightness = (track.brightness / 255.0) * (config.brightness / 255.0);
                            let color2 = {
                                r: color.r * brightness,
                                g: color.g * brightness,
                                b: color.b * brightness,
                            };
                            colorArray[height - 1 - j] = rgbObject2Int(color2);
                        }
                        let a = {t: 1, ca: colorArray};
                        timedArrays.push(a);
                    }
                    gallery.put(track, {timedArrays});
                }
            });
        }
    });
    return new Playlist(tracks, gallery);
};

export {playlistDTOToPlaylist};

