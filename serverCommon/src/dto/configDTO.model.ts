export class ConfigDTO {
    constructor(public NUM_LEDS: number,
                public appFolder: string,
                public brightness: number,
                public debounceTimeout: number,
                public imagesFolder: string,
                public playlistFolder: string,
                public serverPort: number,
                public speed: number,
                public smallPreviewHeight: number,
                public largePreviewHeight: number) {
    }
}
