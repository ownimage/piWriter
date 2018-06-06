import {Track} from '../model/track.model';
import {TrackDTO} from '../dto/trackDTO.model';

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
        track.stripeTotalWidth,
        track.end,
        track.endStyle);
};

export {trackToTrackDTO};

