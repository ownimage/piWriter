import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {config} from '../../common/config'
import {ConfigRepositoryService} from '../../common/repository/ConfigRepositoryService';
import {MessageModel} from '../../pageComponents/message/message.component.model';
import {Config} from '../../shared/model/config.model';

const debug = require('debug')('piWriter/settings.component.ts');

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [ConfigRepositoryService],
})
export class SettingsComponent implements OnInit {

    constructor(private router: Router,
                private configRepositoryService: ConfigRepositoryService) {
    }

    icons = config.icons;
    testRestMessage = new MessageModel();
    infoMessage = new MessageModel();

    serverConfig: Config;

    ngOnInit() {
        this.getConfig();
    }

    getConfig() {
        this.configRepositoryService.getConfig().subscribe(
            data => {
                debug('config = %O', data);
                this.serverConfig = data;
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

    testREST() {
        debug('Test rest');
        this.configRepositoryService.ping().subscribe(
            res => {
                debug('ping returns %o', res);
                this.testRestMessage.setMessageTimeout(JSON.stringify(res));
            },
            err => {
                debug('ping returns Error %o', err);
                this.testRestMessage.setErrorTimeout(JSON.stringify(err));
            });
    }

    saveConfig() {
        debug('saveConfig %O', this.serverConfig);
        this.configRepositoryService.setConfig(this.serverConfig).subscribe(
            res => {
                this.serverConfig = res;
                this.infoMessage.setMessageTimeout('Success :)');
            },
            err => {
                this.infoMessage.setErrorTimeout(JSON.stringify(err));
                this.getConfig();
            });
    }
}
