import { PlaylistRepositoryService } from '../repository/PlaylistRepositoryService';
import { PlaylistItem } from '../model/playlistItem.model';

const stringToPlaylistItem = (playlistRepositoryService: PlaylistRepositoryService, name: string) => {
    console.log(`stringToPlaylistItem ${JSON.stringify(name)}`);
    return playlistRepositoryService.createPlaylistItem(name);
};

export {stringToPlaylistItem};
