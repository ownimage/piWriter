import {Track} from '../model/track.model';
import {Playlist} from '../model/playlist.model';
import {TrackDTO} from '../dto/trackDTO.model';

const trackDTOToTrack = (track: TrackDTO, playlist: Playlist) => {
    return new Track(
        playlist,
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
        track.rotate,
        track.marginLeft,
        track.marginRight,
        track.useColor,
        track.limitColor,
        track.useColor1,
        track.color1,
        track.useColor2,
        track.color2,
        track.useColor3,
        track.color3,
        track.useStripes,
        track.stripeBlackWidth,
        track.stripeTotalWidth
    );
};

export {trackDTOToTrack};

