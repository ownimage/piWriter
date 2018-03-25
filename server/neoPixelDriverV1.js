const ws281x = require('rpi-ws281x-native');
const http = require('http');
const url = require('url');
const sleep = require('sleep');
const Jimp = require("jimp");

const NUM_LEDS = parseInt(process.argv[2], 10) || 10;
const blankArray = new Uint32Array(NUM_LEDS);
const PORT = 8081;
const TEST_BUTTON_PORT = 8082;

var gallery;
var playlist;
var playlistState;

ws281x.init(NUM_LEDS);

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
    ws281x.reset();
    process.nextTick(function () { process.exit(0); });
});

function isString (obj) {
    return (Object.prototype.toString.call(obj) === '[object String]');
}

// from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbHex2Int(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return rgbValues2Int(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
}

function rgbValues2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

function rgbObject2Int(o) {
    return isString(o) ? rgbHex2Int(o) : rgbValues2Int(o.r, o.g, o.b);
}

function buildColorArray(ca, lib) {
    console.log("buildColorArray(ca:" + JSON.stringify(ca, 2) + ")");
    if (!ca || !(Array.isArray(ca) || isString(ca)) ) {
        throw("buildColorArray: parameter needs to be array or the name of a library.");
    }

    let colorArray;
    if (isString(ca)) {
        colorArray = lib[ca];

    } else {
        colorArray = new Uint32Array(NUM_LEDS);
        let j = 0;
        for (let i = 0; i < ca.length; i++) {
            let color = ca[i];
            if (color.n) {
                console.log("color.n = " + color.n)
                let c = rgbObject2Int(color.c);
                for (let k = 0; k < color.n; k++) {
                    console.log("set ... k = " + k + ", j = " + j);
                    colorArray[j] = c;
                    j++;
                }
            } else {
                console.log("!color.n")
                colorArray[j] = rgbObject2Int(ca[i]);
                j++;
            }
        }
    }
    console.log("buildColorArray returns: " + JSON.stringify(colorArray, null, 2));
    return colorArray;
}


function buildLib(libIn) {
    console.log("buildLib");
    var lib = {};
    for (name in libIn) {
        console.log("name = " + name + ", value = " + JSON.stringify(libIn[name], null, 2));
        // shoud really check that this is not a duplicate
        lib[name] = buildColorArray(libIn[name]);
    }
    console.log("lib = " + JSON.stringify(lib, null, 2));
    return lib;
}

function buildPicture(pictureIn) {
    console.log("buildPictureArray(pictureIn:" + JSON.stringify(pictureIn, 2) + ")");

    let picture = {};
    picture.numLeds = buildLib(pictureIn.numLeds);
    picture.colorArrayLib = buildLib(pictureIn.colorArrayLib);
    picture.timedArrays = [];
    for (let i = 0; i < pictureIn.timedArrays.length; i++) {
        let timedArray = { t: pictureIn.timedArrays[i].t, ca: buildColorArray(pictureIn.timedArrays[i].ca, picture.colorArrayLib) };
        picture.timedArrays.push(timedArray);
    }
    return picture;
}

function buildPictures(picturesIn) {
    console.log("bulidPictures");
    var pictures = {};
    for (name in picturesIn) {
        console.log("name = " + name);
        // shoud really check that this is not a duplicate
        pictures[name] = buildPicture(picturesIn[name]);
    }
    console.log("pictures = " + JSON.stringify(pictures, null, 2));
    return pictures;
}

//function buildPictureSequence(psIn) {
//var pictureSequence = [];
//for (let i = 0; i < psIn.length; i++) {
//let name = psIn[i];
//pictureSequence.push(name);
//}
//console.log("pictureSequence = " + JSON.stringify(pictureSequence, null, 2));
//return pictureSequence;
//}

function buildGallery(payload) {
    let gallery = {}
    gallery.pictures = buildPictures(payload.pictures);

    console.log('gallery = ' + JSON.stringify(gallery, null, 2));

    Jimp.read("60test.jpg", function (err, image) {
        if (err) {
            console.log("Error: " + err);
        }
        else {
            image.getPixelColor(10, 10);
            console.log('looking good ' + image.bitmap.width + 'x' + image.bitmap.height);
            gallery.pictures.test = {};
            gallery.pictures.test.timedArrays = [];

            let height = Math.min(image.bitmap.height, NUM_LEDS);
            for (let i = 0; i < image.bitmap.width; i++) {
                let colorArray = new Uint32Array(NUM_LEDS);
                for (let j = 0; j < height; j++) {
                    let color = Jimp.intToRGBA(image.getPixelColor(i, j));
                    colorArray[j] = rgbObject2Int(color);
                }
                let a = { t: 1, ca: colorArray };
                gallery.pictures.test.timedArrays.push(a);
            }
            console.log('Done ' + image.getPixelColor(10,1));
            console.log('Done ' + image.getPixelColor(0,14));
        }
    });

    return gallery;
}

function showPicture(picture, repeat) {
    console.log('showPicture picture = ' + JSON.stringify(picture, null, 2));
    playlistState.state = (repeat) ? 'Looping' : 'Single';

    function show(picture, i) {
        //console.log('show i = ' + i + ' picture = ' + JSON.stringify(picture, null, 2));
        if (i < picture.timedArrays.length) {
            let timedArray = picture.timedArrays[i];
            //console.log('timedArray = ' + JSON.stringify(timedArray, null, 2));
            ws281x.render(timedArray.ca);
            setTimeout(show, timedArray.t * 1, picture, i+1); /// was 1000
        }
        else {
            if (playlistState.state == 'Looping') {
                show(picture, 0);
            }
            else {
                playlistState.state = "Idle";
                if (playlistState.autoplay) {
                    playlistNext();
                }
                else {
                    ws281x.render(blankArray);
                }
            }
        }
    }

    show(picture, 0);

    //   do {
    //       for (let i = 0; i < picture.timedArrays.length; i++) {
    //           let timedArray = picture.timedArrays[i];
    //           ws281x.render(timedArray.ca);
    //           sleep.sleep(timedArray.t);
    //       }
    //   } while (playlistState.state == 'Looping');

    //playlistState.state = "Idle";
    //if (picture.playNext || playlistState.autoplay) {
    //playlistState.autoplay = false;
    //process.nextTick(function () { playlistNext(); });
    //}
    //ws281x.render(blankArray);
}

function playlistNext() {
    console.log('playlistNext');
    if (playlistState === undefined) {
        console.log("playlistState set")
        playlistState = {currentPicture: -1, state: "Idle", autoplay: false};
    }

    if (playlistState.state === "Idle") {
        console.log("Idle")
        playlistState.currentPicture++;
        if (playlistState.currentPicture >= playlist.length) {
            console.log("currentPicture wrap round")
            playlistState.currentPicture = 0;
        }
        let picture = gallery.pictures[playlist[playlistState.currentPicture].picture];
        let repeat = playlist[playlistState.currentPicture].repeat;
        playlistState.autoplay = playlist[playlistState.currentPicture].playNext;
        showPicture(picture, repeat);
    }
    else if (playlistState.state === "Single") {
        console.log("Single")
        playlistState.autoplay = true;
    }
    else if (playlistState.state === "Looping") {
        console.log("Looping")
        playlistState.state = "ReqStop"
    }
    else if (playlistState.state === "ReqStop") {
        console.log("ReqStop")
        playlistState.autoplay = true;
    }
    console.log('playlistState = ' + JSON.stringify(playlistState, null, 2));
}

function playPlaylist(playlist) {
    this.playlist = playlist;
    this.playlistState == null;
}

// http.createServer(function (req, res) {
//     let urlObject = url.parse(req.url, true);
//     console.log(JSON.stringify(urlObject));
//     console.log(JSON.stringify(req.method));
//
//     let body = [];
//     req.on('data', (chunk) => {
//         body.push(chunk);
//     }).on('end', () => {
//         try {
//             body = Buffer.concat(body).toString();
//             console.log('body = ' + body);
//
//             let payload = JSON.parse(body);
//             console.log('payload = ' + JSON.stringify(payload, null, 2));
//
//             if (req.method === 'POST' && urlObject.path === '/piWriter/gallery') {
//                 gallery = buildGallery(payload);
//             }
//             if (req.method === 'POST' && urlObject.path === '/piWriter/playlist') {
//                 playlist = payload;
//             }
//
//             res.writeHead(200, {'Content-Type': 'text/plain'});
//             res.end('Hello World\n');
//         }
//         catch (e) {
//             console.log(e);
//             let msg = isString(e) ? e : "";
//             if (e.message) msg += e.message;
//             if (e.stack) msg += ' | stack: ' + e.stack;
//             res.writeHead(500, {'Content-Type': 'text/plain'});
//             res.end(msg);
//         }
//     });
//
// }).listen(PORT);
// console.log('Server running on port ' + PORT +  '.');
//
// http.createServer(function (req, res) {
//     try {
//         console.log('button press');
//         process.nextTick(function () { playlistNext(); });
//
//         res.writeHead(200, {'Content-Type': 'text/plain'});
//         res.end('Hello World\n');
//     }
//     catch (e) {
//         console.log(e);
//         let msg = isString(e) ? e : "";
//         if (e.message) msg += e.message;
//         if (e.stack) msg += ' | stack: ' + e.stack;
//         res.writeHead(500, {'Content-Type': 'text/plain'});
//         res.end(msg);
//     }
//
// }).listen(TEST_BUTTON_PORT);
// console.log('Server running on port ' + TEST_BUTTON_PORT +  '.');


modeule.export = {
    playPlaylist: playPlaylist
}