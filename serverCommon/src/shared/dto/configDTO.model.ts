export class ConfigDTO {
    constructor(public NUM_LEDS: number,
                public brightness: number,
                public debounceTimeout: number,
                public speed: number,
                public smallPreviewHeight: number,
                public largePreviewHeight: number) {
    }
}
