import {Track} from "../model/track.model";
import {hexToRgb} from "./ColorUtils";

const debug = require('debug')('piWriter/serverCommon/shared/utils/TrackUtils.ts');
const Jimp = require('jimp');
const cache = {metrics: {}};

// letter for photoshop
/**
 a b  c  d  e  f  g  h  i  j  k  l  m  n  o  p  q  r  s  t  u  v  w  x  y  z  A  B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z  0  1  2  3  4  5  6  7  8  9  !  "  £  $  %  ^  &  *  (  )  _  -  +  =  {  }  [  ]  @  '  #  ;  :  <  >  ,  .  /  ?  |  \
 */
const textString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"£$%^&*()_-+={}[]@'#;:<>,./?|\\ ";

function endStyleIncludes(style: string, x: number, y: number) {
    switch (style) {
        case "top-down":
            return (2 * x + y) < 1;
        case "bottom-up":
            return (2 * x - y) < 0;
        case "diamond":
            return (x - y < 0) && (x + y < 1);
        case "semicircle":
            return (y - 0.5) * (y - 0.5) + x * x < 0.25;
        case "ribbon":
            return (x + y < 0.5) || (x - y < -0.5);
    }
    return true;
}

function createEnd(end: string, style: string, image, NUM_LEDS) {
    let clone = image.clone();
    let originalWidth = clone.bitmap.width;

    if (end == "left") {
        clone.flip(true, false);
    }

    if (originalWidth < NUM_LEDS / 2) {
        clone.resize(Math.floor(NUM_LEDS / 2), NUM_LEDS);
    } else {
        clone.crop(0, 0, Math.floor(NUM_LEDS / 2), NUM_LEDS)
    }

    for (let x = 0; x < clone.bitmap.width; x++) {
        for (let y = 0; y < clone.bitmap.height; y++) {
            if (!endStyleIncludes(style, x / NUM_LEDS, y / NUM_LEDS)) {
                clone.setPixelColor(0, x, y)
            }
        }
    }

    if (originalWidth < NUM_LEDS) {
        clone.resize(originalWidth, NUM_LEDS);
    }

    if (end == "left") {
        clone.flip(true, false);
    }

    return clone;
}

function applyEndStyle(track, image, NUM_LEDS) {
    // expect image to be NUM_LEDS high
    let left = track.endStyleLeft != "none" ? createEnd("left", track.endStyleLeft, image, NUM_LEDS) : null;
    let right = track.endStyleRight != "none" ? createEnd("right", track.endStyleRight, image, NUM_LEDS) : null;
    let center = track.endStyleRepeat == 0 ? 0 : image.bitmap.width;

    if (!left && !right) { // neither
        return;
    }
    else if (left && !right) { // left
        let clone = image.clone();
        image.resize(center + Math.floor(NUM_LEDS / 2), NUM_LEDS);
        image.blit(left, 0, 0);
        if (center != 0) {
            image.blit(clone, Math.floor(NUM_LEDS / 2), 0);
        }
    }
    else if (right && !left) { // right
        let clone = image.clone();
        image.resize(center + Math.floor(NUM_LEDS / 2), NUM_LEDS);
        if (center != 0) {
            image.blit(clone, 0, 0);
        }
        image.blit(right, image.bitmap.width - 72, 0);
    }
    else if (left && right) { // both
        let clone = image.clone();
        image.resize(center + NUM_LEDS, NUM_LEDS);
        image.blit(left, 0, 0);
        if (center != 0) {
            image.blit(clone, Math.floor(NUM_LEDS / 2), 0);
        }
        image.blit(right, image.bitmap.width - 72, 0);
    }
}

function applyEndRepeat(track: Track, image) {
    if (track.endStyleRepeat == 0 || track.endStyleRepeat == 1) return;
    let clone = image.clone();
    image.resize(image.bitmap.width * track.endStyleRepeat, image.bitmap.height);
    for (let i = 0; i < track.endStyleRepeat; i++) {
        image.blit(clone, i * clone.bitmap.width, 0);
    }
}

function metrics(image, path) {
    let cacheHit = cache.metrics[path];
    if (cacheHit) {
        debug('cache hit');
        return cacheHit;
    }

    debug('cache miss');
    const y = image.bitmap.height - 1;
    let previous = null;
    let start = null;
    let metrics = [];
    for (let x = 0; x < image.bitmap.width; x++) {
        let current = (image.getPixelColor(x, y) != 0x000000FF);
        if (previous == null) {
            previous = current;
        }
        else if (current && previous != current) {
            // start of character
            start = x;
            previous = current;
        }
        else if (!current && previous != current) {
            // end of character
            metrics.push({start, end: x, length: x - start});
            previous = current;
        }
    }
    // this is for space taken from a-b
    start = metrics[0].end + 1;
    let end = metrics[1].start - 1;
    let length = end - start;
    metrics.push({start, end, length});
    cache.metrics[path] = metrics;
    return metrics;
}

function applyText(track: Track, image) {
    if (track.type != "text") return;
    let text = track.name;
    let clone = image.clone();
    let m = metrics(image, track.path);

    let width = 0;
    for (let c of text) {
        let i = textString.indexOf(c);
        if (i != -1) {
            debug(c + " " + i);
            width += m[i].length;
        }
    }

    image.resize(width, image.bitmap.height - 1);
    let start = 0;
    for (let c of text) {
        let i = textString.indexOf(c);
        if (i != -1) {
            image.blit(clone, start, 0, m[i].start, 0, m[i].length, image.bitmap.height);
            start += m[i].length;
        }
    }


    // let start = m[2].start;
    // let end = m[2].end - start;
    // image.crop(start, 0, end, image.bitmap.height - 1);
}

export function tranformImage(track: Track, image, NUM_LEDS, height, callback) {
    let clone = image.clone();
    applyText(track, clone);
    clone.flip(track.flipX, track.flipY);
    clone.rotate(track.rotate);
    clone.scale(NUM_LEDS / clone.bitmap.height);

    applyEndRepeat(track, clone);
    applyEndStyle(track, clone, NUM_LEDS);

    clone.scale(track.scale);
    if (track.useColor && (track.useColor1 || track.useColor2 || track.useColor3)) {
        for (let x = 0; x < clone.bitmap.width; x++) {
            for (let y = 0; y < clone.bitmap.height; y++) {
                let c = Jimp.intToRGBA(clone.getPixelColor(x, y));
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

                clone.setPixelColor(Jimp.rgbaToInt(r, g, b, 255), x, y)
            }
        }
    }

    new Jimp(Math.round((track.marginLeft + 1 + track.marginRight) * clone.bitmap.width), NUM_LEDS, 0x000000, (err, out) => {
        let h = (track.alignment == 'middle') ? (NUM_LEDS - clone.bitmap.height) / 2 :
            (track.alignment == 'bottom') ? NUM_LEDS - clone.bitmap.height : 0;
        out.blit(clone, Math.round(track.marginLeft * clone.bitmap.width), h, 0, 0, clone.bitmap.width, clone.bitmap.height);

        if (track.useStripes == 'horizontal') {
            for (let x = 0; x < out.bitmap.width; x++) {
                for (let y = 0; y < out.bitmap.height; y += track.stripeTotalWidth) {
                    for (let s = 0; s < track.stripeBlackWidth; s++) {
                        out.setPixelColor(0, x, y + s)
                    }
                }
            }
        }

        if (track.useStripes == 'vertical') {
            for (let y = 0; y < out.bitmap.height; y++) {
                for (let x = 0; x < out.bitmap.width; x += track.stripeTotalWidth) {
                    for (let s = 0; s < track.stripeBlackWidth; s++) {
                        out.setPixelColor(0, x + s, y)
                    }
                }
            }
        }

        if (height && height != out.bitmap.height) {
            out.scale(height / out.bitmap.height);
        }

        callback(err, out);
    });
}
