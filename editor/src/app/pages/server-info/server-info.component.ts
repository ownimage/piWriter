import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {config} from '../../shared/config'
import {ServerInfoRepositoryService} from '../../shared/repository/ServerInfoRepositoryService';
import {ServerInfoDTO} from "../../shared/dto/serverInfoDTO.model";

const debug = require('debug')('piWriter/settings.component.ts');

@Component({
    selector: 'app-settings',
    templateUrl: './server-info.component.html',
    styleUrls: ['./server-info.component.css'],
    providers: [ServerInfoRepositoryService],
})
export class ServerInfoComponent implements OnInit {

    constructor(private router: Router,
                private serverInfoRepositoryService: ServerInfoRepositoryService) {
    }

    icons = config.icons;
    serverInfo: ServerInfoDTO;
    freemem: string;
    totalmem: string;
    uptime: string;
    diskSize: string;
    diskPercentUsed: string;
    diskFree: string;

    ngOnInit() {
        this.getServerInfo();
    }

    getServerInfo() {
        this.serverInfoRepositoryService.getServerInfo().subscribe(
            data => {
                debug('config = %O', data);
                this.serverInfo = data;
                this.freemem = this.formatBytes(data.freemem);
                this.totalmem = this.formatBytes(data.totalmem);
                this.uptime = `${data.uptime.d} d ${data.uptime.h} hr ${data.uptime.m} mi ${data.uptime.s} s`;
                this.diskSize = this.formatBytes(data.diskSize);
                this.diskPercentUsed = data.diskUsedPercent + ' %';
                this.diskFree = this.formatBytes(data.diskFree);
            },
            err => {
                debug('error %o', err)
            },
            () => {
                debug('closed')
            }
        )
    }

    // from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    formatBytes(a, b?) {
        if (0 == a) return "0 Bytes";
        var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            f = Math.floor(Math.log(a) / Math.log(c));
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
    }

    navigateToHome() {
        this.router.navigate(['/']);
    }

}
