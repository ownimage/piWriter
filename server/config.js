const fs = require('fs')

hasNeopixelLib = () => fs.existsSync("node_modules/rpi-ws281x-native");


module.exports = {
    serverPort: 3000,
    emulatorServerPort: 8085,
    appFolder: '../editor/dist',
    imagesFolder: '../library/images',
    playlistFolder: '../library/playlists',
    hasNeopixelLib: hasNeopixelLib()
}