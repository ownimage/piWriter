const debug = require('debug')('piWriter/stringToPlaylistItem.mapper.ts');

const stringToPlaylistItem = (playlistRepositoryService, name: string) => {
    debug('stringToPlaylistItem %o', name);
    return playlistRepositoryService.createPlaylistItem(name);
};

export {stringToPlaylistItem};
