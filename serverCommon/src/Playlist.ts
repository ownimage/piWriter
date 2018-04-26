const debug = require('debug')('serverCommon/Playlist');
debug('### serverCommon/Playlist');

const Jimp = require('jimp');

const Gallery = require('./Gallery');
const {rgbObject2Int} = require('./ColorUtils');
const {logError} = require('./common');

export class Playlist {

    // a playlist is of the format [{name: string, path: string, repeat: boolean, autostartNext: boolean }]
    // setPlaylist will take the playlist given and
    // 1) for each item in the playlist will create an entry in the global gallery.pictures object with
    //    name equal to the name of the playlist element, and
    //    timedArray which has been derrived from the image given in the playlists path element
    // 2) it will set the global playlist to the newPlaylist variable.
    // 3) it will null out the global playlistState so that next will start from the beginning
    constructor(private newPlaylist,
                private config,
                private gallery = null,
                private tracks = null,
        ) {
        debug('serverCommon/Playlist:constructor');

        this.gallery = new Gallery();
        this.tracks = newPlaylist.filter(p => p.enabled);

        debug('playlist = %O', this.tracks);
        this.tracks.map(track => {
            if (!this.gallery.get(track)) { // dont process duplicates
                let gallery = this.gallery;
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
    };

    getTrackCount(): number {
        return this.tracks.length;
    };

    getTrack(i: number) {
        return this.tracks[i];
    };

    getPicture(i: number) {
        return this.gallery.get(this.getTrack(i));
    };

 };



