console.log('### serverCommon/RESTv1');

const fs = require('fs');
const path = require('path');

const {config} = require('./config');
const {logError} = require('./common');

const getFiles = (dirs, result, res) => {
    let dir = dirs.pop();
    console.log(`dir = ${JSON.stringify(dir)}`);
    let fullPath = path.join(config.imagesFolder, dir.dirName);
    console.log(`fullPath = ${fullPath}`);
    fs.readdir(fullPath, (err, files) => {
        files.map(f => {
            console.log(path.join(dir.dirName, f));
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
        console.log('serverCommon/RESTv2:getImagesV1');
        getFiles([{parentDirName: '', dirName: ''}], [], res);
    } catch (e) {
        logError(e);
    }
};

module.exports = {
    getImagesV2
};