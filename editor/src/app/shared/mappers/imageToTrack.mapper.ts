import {Playlist} from '../model/playlist.model';
import {Track} from "../model/track.model";
import {Image} from "../model/image.model";

const imageToTrack = (image: Image, playlist: Playlist) => {
    return new Track(
        playlist,
        image.name,
        image.dirName + '/' + image.name,
    );
};

export {imageToTrack};

