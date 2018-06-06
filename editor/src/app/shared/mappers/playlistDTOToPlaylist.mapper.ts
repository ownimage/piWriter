import {PlaylistDTO} from '../dto/playlistDTO.model';

import {trackDTOToTrack} from './trackDTOToTrack.mapper';

const playlistDTOToPlaylist = (playlistRepositoryService, playlistName: string, playlist: PlaylistDTO) => {
    let model = playlistRepositoryService.createPlaylist(playlistName);
    playlist.tracks
        .map(t => trackDTOToTrack(t, model))
        .map(t => model.addTrack(t));
    model.markClean();
    return model;
};

export {playlistDTOToPlaylist};

