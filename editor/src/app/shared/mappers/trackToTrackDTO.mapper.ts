import { Track } from '../model/track.model';
import { TrackDTO } from '../dto/trackDTO.model';

const trackToTrackDTO = (track: Track) => {
    return new TrackDTO(
        track.name,
        track.path,
        track.repeat,
        track.autostartNext,
        track.enabled,
        track.speed,
        track.brightness,
        track.flipX,
        track.flipY,
        track.scale,
        track.alignment,
        track.rotate);
};

export {trackToTrackDTO};

