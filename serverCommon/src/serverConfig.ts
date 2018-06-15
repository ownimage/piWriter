import * as  path from "path";

export {};

const debug = require("debug")("serverCommon/serverConfig");
debug("### serverCommon/serverConfig");

export const serverConfig = {
    appFolder: path.resolve(__dirname + "/../../editor/dist/"),
    imagesFolder: path.resolve(__dirname + "/../../library/images/"),
    fontsFolder: path.resolve(__dirname + "/../../library/fonts/"),
    playlistFolder: path.resolve(__dirname + "/../../library/playlists/"),
    serverPort: 80
};