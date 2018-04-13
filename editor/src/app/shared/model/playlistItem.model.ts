import {PlaylistRepositoryService} from '../repository/PlaylistRepositoryService';
import {Playlist} from "./playlist.model";

export class PlaylistItem {

    constructor(private _name: string) {
    };

    get name() {
        return this._name;
    };

    get displayName() {
        let playlist = PlaylistRepositoryService.cacheGetPlaylistV1Sync(this._name);
        return (playlist) ? playlist.getDisplayName() : this._name;
    }
}
