import {Track} from "../model/track.model";

const Jimp = require('jimp');
import {hexToRgb} from "./ColorUtils";

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
            return  (x + y < 0.5) ||(x - y < -0.5);
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

    if (!left && !right) { // neither
        return;
    }
    else if (left && !right) { // left
        let clone = image.clone();
        image.resize(image.bitmap.width + Math.floor(NUM_LEDS/2), NUM_LEDS);
        image.blit(left, 0, 0);
        image.blit(clone, Math.floor(NUM_LEDS/2), 0);

    }
    else if (right && !left) { // right
        let clone = image.clone();
        image.resize(image.bitmap.width + Math.floor(NUM_LEDS/2), NUM_LEDS);
        image.blit(clone, 0, 0);
        image.blit(right, image.bitmap.width-72, 0);
    }
    else if (left && right) { // both
        let clone = image.clone();
        image.resize(image.bitmap.width + NUM_LEDS, NUM_LEDS);
        image.blit(left, 0, 0);
        image.blit(clone, Math.floor(NUM_LEDS/2), 0);
        image.blit(right, image.bitmap.width-72, 0);
    }
}

function applyEndRepeat(track: Track, image) {
    if (track.endStyleRepeat == 1) return;
    let clone = image.clone();
    image.resize(image.bitmap.width * track.endStyleRepeat, image.bitmap.height);
    for (let i = 0; i < track.endStyleRepeat; i++) {
        image.blit(clone, i * clone.bitmap.width, 0);
    }
}

export function tranformImage(track: Track, image, NUM_LEDS, height, callback) {
    let clone = image.clone();
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
