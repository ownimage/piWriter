import {PlaylistDTO} from '../dto/playlistDTO.model';
import {trackDTOToTrack} from './trackDTOToTrack.mapper';
import {Playlist} from "../model/playlist.model";

const playlistDTOToPlaylist = (playlistName: string, playlistDTO: PlaylistDTO) => {
    let playlist = new Playlist(playlistName, []);
    playlistDTO.tracks
        .map(t => trackDTOToTrack(t, playlist))
        .map(t => playlist.addTrack(t));
    playlist.markClean();
    return playlist;
};

export {playlistDTOToPlaylist};

