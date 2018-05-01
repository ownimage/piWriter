import {PlaylistRepositoryService} from '../repository/PlaylistRepositoryService';

export class PlaylistItem {

    constructor(private playlistRepositoryService: PlaylistRepositoryService,
                private _name: string) {
    };

    get name() {
        return this._name;
    };

    get displayName() {
        let playlist = this.playlistRepositoryService.cacheGetPlaylistV1Sync(this._name);
        return (playlist) ? playlist.getDisplayName() : this._name;
    }
}
