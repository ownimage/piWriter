const debug = require('debug')('serverCommon/NeoPixelDriver');
debug('### serverCommon/NeoPixelDriver');

const http = require('http');
const url = require('url');
const Jimp = require('jimp');

const Gallery = require('./Gallery');
const {logError} = require('./common');

let config;

let blankArray = [];
let flashArray = null;

let gallery = new Gallery();
let playlist;
let playlistState;
let halt;

const init = (newConfig) => {
    debug('serverCommon/NeoPixelDriver:init');
    config = newConfig;

    debug('NUM_LEDS = %d', config.NUM_LEDS);
    blankArray = new Uint32Array(config.NUM_LEDS);
    config.neopixelLib.init(config.NUM_LEDS);

    setPlaylist(playlist);
    flash(2);
};


function setupFlashArray() {
    debug('serverCommon/NeoPixelDriver:setupFlashArray');
    let colors = [
        rgbValues2Int(64, 0, 0),
        rgbValues2Int(0, 64, 0),
        rgbValues2Int(0, 0, 64)
    ];
    flashArray = new Uint32Array(config.NUM_LEDS);
    for (i = 0; i < config.NUM_LEDS; i++) {
        flashArray[i] = colors[i % 3];
    }
}


function flash(n) {
    debug('serverCommon/NeoPixelDriver:flash %d', n);
    if (!n || n <= 0) return;

    if (!flashArray) {
        setupFlashArray();
    }

    config.neopixelLib.render(flashArray);
    setTimeout(() => config.neopixelLib.render(blankArray), 500);
    setTimeout(() => flash(n - 1), 1000);
}

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
    config.neopixelLib.reset();
    process.nextTick(function () {
        process.exit(0);
    });
});

function isString(obj) {
    return (Object.prototype.toString.call(obj) === '[object String]');
}

// from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbHex2Int(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return rgbValues2Int(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
}

function rgbValues2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

function rgbObject2Int(o) {
    return isString(o) ? rgbHex2Int(o) : rgbValues2Int(o.r, o.g, o.b);
}

// function buildColorArray(ca, lib) {
//     debug("buildColorArray(ca:" + JSON.stringify(ca, 2) + ")");
//     if (!ca || !(Array.isArray(ca) || isString(ca)) ) {
//         throw("buildColorArray: parameter needs to be array or the name of a library.");
//     }
//
//     let colorArray;
//     if (isString(ca)) {
//         colorArray = lib[ca];
//
//     } else {
//         colorArray = new Uint32Array(config.NUM_LEDS);
//         let j = 0;
//         for (let i = 0; i < ca.length; i++) {
//             let color = ca[i];
//             if (color.n) {
//                 debug("color.n = " + color.n)
//                 let c = rgbObject2Int(color.c);
//                 for (let k = 0; k < color.n; k++) {
//                     debug("set ... k = " + k + ", j = " + j);
//                     colorArray[j] = c;
//                     j++;
//                 }
//             } else {
//                 debug("!color.n")
//                 colorArray[j] = rgbObject2Int(ca[i]);
//                 j++;
//             }
//         }
//     }
//     debug("buildColorArray returns: " + JSON.stringify(colorArray, null, 2));
//     return colorArray;
// }
//
//
// function buildLib(libIn) {
//     debug("buildLib");
//     var lib = {};
//     for (name in libIn) {
//         debug("name = " + name + ", value = " + JSON.stringify(libIn[name], null, 2));
//         // shoud really check that this is not a duplicate
//         lib[name] = buildColorArray(libIn[name]);
//     }
//     debug("lib = " + JSON.stringify(lib, null, 2));
//     return lib;
// }
//
// function buildPicture(pictureIn) {
//     debug("buildPictureArray(pictureIn:" + JSON.stringify(pictureIn, 2) + ")");
//
//     let picture = {};
//     picture.numLeds = buildLib(pictureIn.numLeds);
//     picture.colorArrayLib = buildLib(pictureIn.colorArrayLib);
//     picture.timedArrays = [];
//     for (let i = 0; i < pictureIn.timedArrays.length; i++) {
//         let timedArray = { t: pictureIn.timedArrays[i].t, ca: buildColorArray(pictureIn.timedArrays[i].ca, picture.colorArrayLib) };
//         picture.timedArrays.push(timedArray);
//     }
//     return picture;
// }
//
// function buildPictures(picturesIn) {
//     debug("bulidPictures");
//     var pictures = {};
//     for (name in picturesIn) {
//         debug("name = " + name);
//         // shoud really check that this is not a duplicate
//         pictures[name] = buildPicture(picturesIn[name]);
//     }
//     debug("pictures = " + JSON.stringify(pictures, null, 2));
//     return pictures;
// }
//
// //function buildPictureSequence(psIn) {
// //var pictureSequence = [];
// //for (let i = 0; i < psIn.length; i++) {
// //let name = psIn[i];
// //pictureSequence.push(name);
// //}
// //debug("pictureSequence = " + JSON.stringify(pictureSequence, null, 2));
// //return pictureSequence;
// //}
//
// function buildGallery(payload) {
//     let gallery = {}
//     gallery.pictures = buildPictures(payload.pictures);
//
//     debug('gallery = ' + JSON.stringify(gallery, null, 2));
//
//     Jimp.read("60test.jpg", function (err, image) {
//         if (err) {
//             debug("Error: " + err);
//         }
//         else {
//             image.getPixelColor(10, 10);
//             debug('looking good ' + image.bitmap.width + 'x' + image.bitmap.height);
//             gallery.pictures.test = {};
//             gallery.pictures.test.timedArrays = [];
//
//             let height = Math.min(image.bitmap.height, config.NUM_LEDS);
//             for (let i = 0; i < image.bitmap.width; i++) {
//                 let colorArray = new Uint32Array(config.NUM_LEDS);
//                 for (let j = 0; j < height; j++) {
//                     let color = Jimp.intToRGBA(image.getPixelColor(i, j));
//                     colorArray[j] = rgbObject2Int(color);
//                 }
//                 let a = { t: 1, ca: colorArray };
//                 gallery.pictures.test.timedArrays.push(a);
//             }
//             debug('Done ' + image.getPixelColor(10,1));
//             debug('Done ' + image.getPixelColor(0,14));
//         }
//     });
//
//     return gallery;
// }
//
function showPicture(picture, repeat, speed) {
    debug('serverCommon/NeoPixelDriver:showPicture');
    debug('picture.speed %d', speed);
    playlistState.state = (repeat) ? 'Looping' : 'Single';
    let timeout = 20 / (config.speed * speed);

    function show(picture, i) {
        if (i < picture.timedArrays.length) {
            let timedArray = picture.timedArrays[i];
            config.neopixelLib.render(timedArray.ca);
            setTimeout(show, timedArray.t * timeout, picture, i + 1); /// was 1000
        } else {
            config.neopixelLib.render(blankArray);
            if (halt) return;
            if (playlistState.state == 'Looping') {
                show(picture, 0);
            }
            else {
                playlistState.state = "Idle";
                if (playlistState.autostartNext) {
                    next();
                }
                else {
                    config.neopixelLib.render(blankArray);
                }
            }
        }
    }

    show(picture, 0);
}


// playlistState is defined as follows
//    state: string one of Idle, Single, Looping, ReqStop
//    currentPicture: int shows the index of the picture that is being shown
//    autostartNext: boolean whether the next picture is to be started automatically
const next = () => {
    try {
        debug('serverCommon/NeoPixelDriver:next');
        debug('playlistState = %O', playlistState);

        if (!playlist) return;
        halt = false;

        if (!playlistState) {
            debug('creating playlistState');
            playlistState = {state: 'Idle', currentPicture: -1, autoplay: false};
        }

        if (playlistState.state === 'Idle') {
            debug('Idle');
            playlistState.currentPicture++;
            if (playlistState.currentPicture >= playlist.length) {
                debug('currentPicture wrap round');
                playlistState.currentPicture = 0;
            }
            let picture = gallery.get(playlist[playlistState.currentPicture]);
            let speed = playlist[playlistState.currentPicture].speed;
            let repeat = playlist[playlistState.currentPicture].repeat;
            playlistState.autostartNext = playlist[playlistState.currentPicture].autostartNext;
            showPicture(picture, repeat, speed);
        }
        else if (playlistState.state === 'Single') {
            debug('Single');
            playlistState.autostartNext = true;
        }
        else if (playlistState.state === 'Looping') {
            debug('Looping');
            playlistState.state = 'ReqStop'
        }
        else if (playlistState.state === 'ReqStop') {
            debug('ReqStop');
            playlistState.autostartNext = true;
        }
        debug('playlistState = %O', playlistState);
    } catch (err) {
        logError(err);
    }
};

// a playlist is of the format [{name: string, path: string, repeat: boolean, autostartNext: boolean }]
// setPlaylist will take the playlist given and
// 1) for each item in the playlist will create an entry in the global gallery.pictures object with
//    name equal to the name of the playlist element, and
//    timedArray which has been derrived from the image given in the playlists path element
// 2) it will set the global playlist to the newPlaylist variable.
// 3) it will null out the global playlistState so that next will start from the beginning
const setPlaylist = (newPlaylist) => {
    debug('serverCommon/NeoPixelDriver:setPlaylist');
    if (!newPlaylist) return;

    gallery = new Gallery();
    playlist = newPlaylist.filter(p => p.enabled);
    playlistState = null;
    halt = true;

    debug('playlist = %O', playlist);
    playlist.map(track => {
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
                            let color2 = {r: color.r * brightness, g: color.g * brightness, b: color.b * brightness,};
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

module.exports = {
    init,
    setPlaylist,
    next
};


