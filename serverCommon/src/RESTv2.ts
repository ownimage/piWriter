export {};

const debug = require('debug')('serverCommon/RESTv2');
debug('### serverCommon/RESTv2');

const fs = require('fs');
const path = require('path');

const {config} = require('./config');
const {logError} = require('./utils/common');

const getFiles = (dirs, result, res) => {
    let dir = dirs.pop();
    debug('dir = %o', dir);
    let fullPath = path.join(config.imagesFolder, dir.dirName);
    debug('fullPath = %s', fullPath);
    fs.readdir(fullPath, (err, files) => {
        files.map(f => {
            let stat = fs.lstatSync(path.join(fullPath, f));
            result.push({...dir, name: f, isFile: stat.isFile()});
            if (stat.isDirectory()) {
                dirs.push({parentDirName: dir.dirName, dirName: dir.dirName + '/' + f});
            }
        });
        if (dirs.length == 0) {
            res.header('Access-Control-Allow-Origin', '*');
            res.send(result);
        } else {
            getFiles(dirs, result, res);
        }
    });
};

const getImagesV2 = (req, res) => {
    try {
        debug('serverCommon/RESTv2:getImagesV1');
        getFiles([{parentDirName: '', dirName: ''}], [], res);
    } catch (e) {
        logError(e);
    }
};

module.exports = {
    getImagesV2
};