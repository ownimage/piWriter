export class ServerInfoDTO {
    constructor(public uptime: { d, h, m, s },
                public totalmem: number,
                public freemem: number,
                public loadavg: [number, number, number],
                public temp: number,
                public diskSize: number,
                public diskUsedPercent: number,
                public diskFree: number
    ) {
    };
}
