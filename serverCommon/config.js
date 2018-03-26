const baseConfig = {
    serverPort: 3000,
    emulatorServerPort: 8085,
    appFolder: '../editor/dist',
    imagesFolder: '../library/images',
    playlistFolder: '../library/playlists'
};

let finalConfig = baseConfig;

const setConfig = (config) => {
    finalConfig = { ...baseConfig, ...config};
    console.log('final config = ' + JSON.stringify(finalConfig));
};

const getConfig = () => {
    return finalConfig;
};

module.exports = {
    setConfig,
    getConfig
};