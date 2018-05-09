import {TrackDTO} from "./TrackDTO";

export class PlaylistDTO {
    constructor(public version: number,
                public tracks: TrackDTO[]) {
    }
}
