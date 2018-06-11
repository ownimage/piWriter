import {getFiles} from "./utils/dirs";
import {serverConfig} from "./serverConfig";
import {logError} from "./utils/common";

const DEBUG = require("debug");
const debug = DEBUG("serverCommon/fontService");
debug("### serverCommon/fontService");

export function getFontsV2(req, res) {
    try {
        debug("serverCommon/fontService:getFontsV2");
        getFiles(serverConfig.fontsFolder, [{parentDirName: "", dirName: ""}], [], res);
    } catch (e) {
        logError(debug, e);
    }
};


