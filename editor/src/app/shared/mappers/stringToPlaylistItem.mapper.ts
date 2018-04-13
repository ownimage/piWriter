import { PlaylistRepositoryService } from '../repository/PlaylistRepositoryService';
import { PlaylistItem } from '../model/playlistItem.model';

const stringToPlaylistItem = (name: string) => {
    console.log(`stringToPlaylistItem ${JSON.stringify(name)}`);
    return new PlaylistItem(name);
};

export {stringToPlaylistItem};
