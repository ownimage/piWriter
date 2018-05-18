export class ServerInfoDTO {
    constructor(public uptime: { d, h, m, s },
                public totalmem: number,
                public freemem: 12001468416,
                public loadavg: [number, number, number],
                public temp: number
    ) {
    };
}
