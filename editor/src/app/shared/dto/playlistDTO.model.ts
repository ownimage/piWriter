import {TrackDTO} from './trackDTO.model';

export class PlaylistDTO {
    constructor(public tracks: TrackDTO[]) {
    }
}
