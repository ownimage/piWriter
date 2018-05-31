export {};

import * as  fs from "fs";
import * as  path from "path";

import { getConfig } from "./config";
import { serverConfig} from "./serverConfig";
import { logError } from "./utils/common";

const DEBUG = require("debug");
const debug = DEBUG("serverCommon/RESTv2");
debug("### serverCommon/RESTv2");

const getFiles = (dirs, result, res) => {
    const dir = dirs.pop();
    debug("dir = %o", dir);
    const fullPath = path.join(serverConfig.imagesFolder, dir.dirName);
    debug("fullPath = %s", fullPath);
    fs.readdir(fullPath, (err, files) => {
        files.map((f) => {
            const stat = fs.lstatSync(path.join(fullPath, f));
            result.push({...dir, name: f, isFile: stat.isFile()});
            if (stat.isDirectory()) {
                dirs.push({parentDirName: dir.dirName, dirName: dir.dirName + "/" + f});
            }
        });
        if (dirs.length === 0) {
            res.header("Access-Control-Allow-Origin", "*");
            res.send(result);
        } else {
            getFiles(dirs, result, res);
        }
    });
};

const getImagesV2 = (req, res) => {
    try {
        debug("serverCommon/RESTv2:getImagesV1");
        getFiles([{parentDirName: "", dirName: ""}], [], res);
    } catch (e) {
        logError(debug, e);
    }
};

export const RESTv2 = {
    getImagesV2,
};
