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
    uptime: string;

    ngOnInit() {
        this.getServerInfo();
    }

    getServerInfo() {
        this.serverInfoRepositoryService.getServerInfo().subscribe(
            data => {
                debug('config = %O', data);
                this.serverInfo = data;
                this.uptime = `${data.uptime.d} d ${data.uptime.h} hr ${data.uptime.m} mi ${data.uptime.s} s`;
            },
            err => {
                debug('error %o', err)
            },
            () => {
                debug('closed')
            }
        )
    }

    navigateToHome() {
        this.router.navigate(['/']);
    }

}
