export {};

const os = require('os');

import {ServerInfoDTO} from "./dto/serverInfoDTO.model";

const DEBUG = require("debug");
const debug = DEBUG("serverCommon/serverInfo");
debug("### serverCommon/serverInfo");

export const getServerInfo = (additionalServerInfo) => {
    return async (req, res, next) => {
        try {
            const ais = await additionalServerInfo();
            console.log(`ais = ${JSON.stringify(ais)}`);
            let info: ServerInfoDTO = new ServerInfoDTO(
                convertS(os.uptime()),
                os.totalmem(),
                os.freemem(),
                os.loadavg(),
                ais.temp,
                ais.diskSize,
                ais.diskUsedPercent,
                ais.diskFree
            );
            debug("info = %o", info);
            res.header("Access-Control-Allow-Origin", "*");
            res.send(info);
        }
        catch
            (err) {
            res.header("Access-Control-Allow-Origin", "*");
            res.sendStatus(500);
            res.send(err);
        }
    };
};

// from https://gist.github.com/remino/1563878
function convertS(s) {
    var d, h, m, s;
    s = Math.floor(s);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return {d, h, m, s};
}


