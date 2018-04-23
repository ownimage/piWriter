export class TrackDTO {
    constructor(public name: string,
                public path: string,
                public repeat: boolean,
                public autostartNext: boolean,
                public enabled: boolean,
                public speed: number,
                public brightness: number) {
    };
}
