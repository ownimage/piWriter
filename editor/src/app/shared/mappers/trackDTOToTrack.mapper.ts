import { Track } from '../model/track.model';
import { Playlist } from '../model/playlist.model';
import { TrackDTO } from '../dto/trackDTO.model';

const trackDTOToTrack = (track: TrackDTO, playlist: Playlist) => {
    return new Track(
        playlist,
        track.name,
        track.path,
        track.repeat,
        track.autostartNext,
        track.enabled
    );
};

export {trackDTOToTrack};
