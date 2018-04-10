import { Playlist } from '../model/playlist.model';
import { PlaylistDTO } from '../dto/playlistDTO.model';

import { trackToTrackDTO } from '../mappers/trackToTrackDTO.mapper';

const playlistToPlaylistDTO = (playlist: Playlist) => {
    return new PlaylistDTO(
        playlist.tracks
            .map(  t => trackToTrackDTO(t))
    );
};

export {playlistToPlaylistDTO};

