import {TrackDTO} from './trackDTO.model';

export class PlaylistDTO {
    constructor(public version: number,
                public tracks: TrackDTO[]) {
    }
}
