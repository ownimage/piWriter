console.log('### serverCommon/RESTv1');

const fs = require('fs');
const path = require('path');

const {config} = require('./config');
const {logError} = require('./common');

const getFiles = (dirs, result, res) => {
    let dir = dirs.pop();
    console.log(`dir = ${JSON.stringify(dir)}`);
    let fullPath = path.join(config.imagesFolder, dir.dir);
    console.log(`fullPath = ${fullPath}`);
    fs.readdir(fullPath, (err, files) => {
        files.map(f => {
            console.log(path.join(dir.dir, f));
            let stat = fs.lstatSync(path.join(fullPath, f));
            result.push({...dir, name: f, isFile: stat.isFile()});
            if (stat.isDirectory()) {
                dirs.push({parentDir: dir.dir, dir: path.join(dir.dir, f)});
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
        console.log(`dir = ${req.params.dir}`);
        getFiles([{parentDir: '', dir: ''}], [], res);
    } catch (e) {
        logError(e);
    }
};

module.exports = {
    getImagesV2
};