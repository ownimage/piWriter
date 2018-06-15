import {getFiles} from "./utils/dirs";
import {serverConfig} from "./serverConfig";
import {logError} from "./utils/common";

const DEBUG = require("debug");
const debug = DEBUG("serverCommon/imageService");
debug("### serverCommon/imageService");

export function getImagesV2(req, res) {
    try {
        debug("serverCommon/imageService:getImagesV2");
        getFiles(serverConfig.imagesFolder, [{parentDirName: "", dirName: ""}], [], res);
    } catch (e) {
        logError(debug, e);
    }
};


