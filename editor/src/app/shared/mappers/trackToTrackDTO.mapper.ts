import { Track } from '../model/track.model';
import { TrackDTO } from '../dto/trackDTO.model';

const trackToTrackDTO = (track: Track) => {
    return new TrackDTO(
        track.name,
        track.path,
        track.repeat,
        track.autostartNext,
        track.enabled
    );
};

export {trackToTrackDTO};

