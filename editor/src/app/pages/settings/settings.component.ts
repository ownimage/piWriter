import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {config} from '../../shared/config'
import {ConfigRepositoryService} from '../../shared/repository/ConfigRepositoryService';
import {MessageModel} from '../../pageComponents/message/message.component.model';

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

    serverConfig = {};

    ngOnInit() {
        this.configRepositoryService.getConfig().subscribe(
            data => {
                console.log("config = " + JSON.stringify(data));
                this.serverConfig = data;
            },
            err => {
                console.log("error " + JSON.stringify(err))
            },
            () => {
                console.log("closed")
            }
        )
    }

    navigateToHome() {
        this.router.navigate(['/']);
    }

    testREST() {
        console.log('Test rest');
        this.configRepositoryService.ping().subscribe(
            res => {
                console.log(`ping returns ${JSON.stringify(res)}`);
                this.testRestMessage.setMessageTimeout(JSON.stringify(res), null);
            },
            err => {
                console.log(`ping returns Error ${JSON.stringify(err)}`);
                this.testRestMessage.setErrorTimeout(JSON.stringify(err), null);
            });
    }

    saveConfig() {
        console.log("saveConfig " + JSON.stringify(this.serverConfig));
        this.configRepositoryService.setConfig(this.serverConfig).subscribe(
            res => {
                this.infoMessage.setMessageTimeout(JSON.stringify(res), null);
            },
            err => {
                this.infoMessage.setErrorTimeout(JSON.stringify(err), null);
            });
    }
}
