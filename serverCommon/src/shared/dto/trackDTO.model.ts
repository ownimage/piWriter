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
                public rotate: number,
                public marginLeft: number,
                public marginRight: number,
                public useColor: boolean,
                public limitColor: boolean,
                public useColor1: boolean,
                public color1: string,
                public useColor2: boolean,
                public color2: string,
                public useColor3: boolean,
                public color3: string,
                public useStripes: string,
                public stripeBlackWidth: number,
                public stripeTotalWidth: number,
                public endStyleLeft: string,
                public endStyleRight: string) {
    };
}
