import { Playlist } from '../model/playlist.model';
import { PlaylistDTO } from '../dto/playlistDTO.model';

import { trackToTrackDTO } from './trackToTrackDTO.mapper';

const playlistToPlaylistDTO = (playlist: Playlist) => {
    return new PlaylistDTO(
        1,
        playlist.tracks
            .map(  t => trackToTrackDTO(t))
    );
};

export {playlistToPlaylistDTO};

