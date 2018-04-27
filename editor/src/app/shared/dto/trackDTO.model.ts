export class TrackDTO {
    constructor(public name: string,
                public path: string,
                public repeat: boolean,
                public autostartNext: boolean,
                public enabled: boolean,
                public speed: number,
                public brightness: number,
                public flipX: boolean,
                public flipY: boolean,
                public scale: number,
                public alignment: string,
                public rotate: number) {
    };
}
