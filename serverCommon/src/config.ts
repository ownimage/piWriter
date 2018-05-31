import {logError} from "./utils/common";
import * as  path from "path";

import {ConfigDTO} from "./dto/configDTO.model";
import {NeoPixelDriver} from "./NeoPixelDriver";

export {};

const debug = require("debug")("serverCommon/config");
debug("### serverCommon/config");

let config = new ConfigDTO(
    144,
    path.resolve(__dirname + "/../../editor/dist/"),
    254,
    301,
    path.resolve(__dirname + "/../../library/images/"),
    path.resolve(__dirname + "/../../library/playlists/"),
    80,
    1.1,
    72,
    144,
);

export function getConfig(): ConfigDTO {
    return config
}

export function setConfig(newConfig: ConfigDTO) {
    config = newConfig;
}

export function RESTgetConfig(req, res) {
    debug("serverCommon/server:getConfig");
    res.header("Access-Control-Allow-Origin", "*");
    res.send(config);
}

export function RESTpostConfig(req, res) {
    try {
        debug("serverCommon/server:postConfig");
        debug("req.body =" + JSON.stringify(req.body));

        let NUM_LEDS = req.body.NUM_LEDS;
        if (12 > NUM_LEDS || NUM_LEDS > 144) {
            NUM_LEDS = config.NUM_LEDS;
        }

        let brightness = req.body.brightness;
        if (16 > brightness || brightness > 255) {
            brightness = config.brightness;
        }

        let speed = req.body.speed;
        if (0.2 > speed || speed > 5) {
            speed = config.speed;
        }

        let debounceTimeout = req.body.debounceTimeout;
        if (10 > debounceTimeout || debounceTimeout > 1000) {
            debounceTimeout = config.debounceTimeout;
        }

        config.brightness = brightness;
        config.speed = speed;
        config.debounceTimeout = debounceTimeout;
        config.NUM_LEDS = NUM_LEDS;
        config.smallPreviewHeight = req.body.smallPreviewHeight;
        config.largePreviewHeight = req.body.largePreviewHeight;

        debug(`config = ${JSON.stringify(config)}`);

        NeoPixelDriver.init();

        res.header("Access-Control-Allow-Origin", "*");
        res.send(config);
    } catch (e) {
        res.header("Access-Control-Allow-Origin", "*");
        res.sendStatus(500);
        logError(debug, e);
    }
}


