const Jimp = require('jimp');

function removeUnwantedGaps(image) {
    let y = image.bitmap.height-1;
    let started = false;
    let totalGapLen = 0;
    let gapCnt = 0;
    let gapLen = 0;
    for (let x = 0; x < image.bitmap.width; x++) {
        let w = image.getPixelColor(x, y) != 0x000000FF;
        if (w && gapLen != 0) {
            gapCnt++;
            totalGapLen += gapLen;
            gapLen = 0;
        }
        if (w) {
            started = true;
        }
        if (!w && started) {
            gapLen++;
        }
    }

    let halfAvgGap = 0.5 * totalGapLen / gapCnt;
    console.log(`halfAvgGap=${halfAvgGap}`);

    let start = 0;
    for (let x = 0; x < image.bitmap.width; x++) {
        let w = image.getPixelColor(x, y) != 0x000000FF;
        if (!w && start == 0) {
            start = x;
        }
        if (w && start != 0) {
            let len = x - start;
            console.log(`len=${len}`);
            if (len < halfAvgGap) {
                for (let x2 = start; x2 < x;x2++) {
                    image.setPixelColor(0xFFFFFFFF, x2, y);
                }
            }
            start = 0;
        }
    }
}

function identify(filename) {
    Jimp.read(filename, (err, image) => {
        if (err) {
            console.log("Jimp Error: %o", err);
        } else {
            let clone = image.clone();
            clone.resize(image.bitmap.width, image.bitmap.height + 1);
            clone.blit(image, 0, 0);
            for (let x = 0; x < image.bitmap.width; x++) {
                let allBlack = true;
                for (let y = 0; y < image.bitmap.height; y++) {
                    if (clone.getPixelColor(x, y) != 0x000000FF) {
                        allBlack = false;
                    }
                }
                let c = allBlack ? 0x000000FF : 0xFFFFFFFF;
                clone.setPixelColor(c, x, image.bitmap.height);
            }
            removeUnwantedGaps(clone);
            clone.write("out.png");
            console.log(`${image.bitmap.width}x${image.bitmap.height}`)
        }
    });
}

const action = process.argv[2];
const filename = process.argv[3];

switch (action) {
    case "identify":
        identify(filename);
        break;
}