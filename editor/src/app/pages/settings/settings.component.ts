import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {config} from '../../shared/config'

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    constructor(private router: Router) {
    }

    icons = config.icons;

    ngOnInit() {
    }

    navigateToHome() {
        this.router.navigate(['/']);
    }
}
