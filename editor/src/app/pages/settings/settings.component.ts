import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {config} from '../../shared/config'
import {RepositoryService} from '../../shared/repository.service';
import {MessageModel} from '../../pageComponents/message/message.component.model';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [RepositoryService],
})
export class SettingsComponent implements OnInit {

    constructor(private router: Router,
                private repositoryService: RepositoryService) {
    }

    icons = config.icons;
    testRestMessage = new MessageModel();

    ngOnInit() {
    }

    navigateToHome() {
        this.router.navigate(['/']);
    }

    testREST() {
        console.log('Test rest');
        this.repositoryService.ping().subscribe(
            res => {
                console.log(`ping returns ${JSON.stringify(res)}`);
                this.testRestMessage.setMessageTimeout(JSON.stringify(res), null);
            },
            err => {
                console.log(`ping returns Error ${JSON.stringify(err)}`);
                this.testRestMessage.setErrorTimeout(JSON.stringify(err), null);
            });
    }
}
