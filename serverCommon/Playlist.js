
const debug = require('debug')('serverCommon/NeoPixelDriver');
debug('### serverCommon/Playlist');

const Jimp = require('jimp');

const Gallery = require('./Gallery');
const {rgbObject2Int} = require('./ColorUtils');
const {logError} = require('./common');

module.exports = class Playlist {

    // a playlist is of the format [{name: string, path: string, repeat: boolean, autostartNext: boolean }]
    // setPlaylist will take the playlist given and
    // 1) for each item in the playlist will create an entry in the global gallery.pictures object with
    //    name equal to the name of the playlist element, and
    //    timedArray which has been derrived from the image given in the playlists path element
    // 2) it will set the global playlist to the newPlaylist variable.
    // 3) it will null out the global playlistState so that next will start from the beginning
    constructor(newPlaylist, config, render, renderBlank) {
        debug('serverCommon/Playlist:constructor');

        this.render = render;
        this.renderBlank =  renderBlank;

        this.gallery = new Gallery();
        this.playlist = newPlaylist.filter(p => p.enabled);
        this.playlistState = null;
        this.halt = true;
        this.config = config;

        debug('playlist = %O', this.playlist);
        this.playlist.map(track => {
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



    showPicture(picture, repeat, speed, render, renderBlank) {
        debug('serverCommon/Playlist:showPicture');
        debug('picture.speed %d', speed);
        debug('this.playlist 1 %o', this.playlist);
        debug('render %o', render);

        this.playlistState.state = (repeat) ? 'Looping' : 'Single';
        let timeout = 20 / (this.config.speed * speed);

        const show = (picture, i, timeout, render, renderBlank) => {
            debug('serverCommon/Playlist:show');
            debug('this.playlist 2 %o', this.playlist);
            debug('render %o', render);

            if (i < picture.timedArrays.length) {
                let timedArray = picture.timedArrays[i];
                render(timedArray.ca);
                setTimeout(show, timedArray.t * timeout, picture, i + 1, timeout, render, renderBlank); /// was 1000
            } else {
                renderBlank();
                if (this.halt) return;
                debug('this.playlist 3 %o', this.playlist);
                debug('render %o', render);
                if (this.playlistState.state == 'Looping') {
                    show(picture, 0, timeout, render, renderBlank);
                }
                else {
                    this.playlistState.state = "Idle";
                    if (this.playlistState.autostartNext) {
                        this.next(render, renderBlank);
                    }
                    else {
                        renderBlank();
                    }
                }
            }
        };

        debug('render e %o', render);
        show(picture, 0, timeout, render, renderBlank);
    }


    // playlistState is defined as follows
    //    state: string one of Idle, Single, Looping, ReqStop
    //    currentPicture: int shows the index of the picture that is being shown
    //    autostartNext: boolean whether the next picture is to be started automatically
    next(render, renderBlank) {
        try {
            debug('serverCommon/Playlist:next');
            debug('playlistState = %O', this.playlistState);

            if (!this.playlist) return;
            this.halt = false;

            if (!this.playlistState) {
                debug('creating playlistState');
                this.playlistState = {state: 'Idle', currentPicture: -1, autoplay: false};
            }

            if (this.playlistState.state === 'Idle') {
                debug('Idle');
                this.playlistState.currentPicture++;
                if (this.playlistState.currentPicture >= this.playlist.length) {
                    debug('currentPicture wrap round');
                    this.playlistState.currentPicture = 0;
                }
                let currentPictureNum = this.playlistState.currentPicture;
                let currentPicture = this.playlist[currentPictureNum];
                let picture = this.gallery.get(currentPicture);
                let speed = currentPicture.speed;
                let repeat = currentPicture.repeat;
                this.playlistState.autostartNext = currentPicture.autostartNext;
                this.showPicture(picture, repeat, speed, render, renderBlank);
            }
            else if (this.playlistState.state === 'Single') {
                debug('Single');
                this.playlistState.autostartNext = true;
            }
            else if (this.playlistState.state === 'Looping') {
                debug('Looping');
                this.playlistState.state = 'ReqStop'
            }
            else if (this.playlistState.state === 'ReqStop') {
                debug('ReqStop');
                this.playlistState.autostartNext = true;
            }
            debug('playlistState = %O', this.playlistState);
        } catch (err) {
            logError(debug, err);
        }
    };

};




