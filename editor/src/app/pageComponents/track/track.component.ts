import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {config} from '../../shared/config'
import {environment} from '../../../environments/environment';
import {Track} from '../../shared/model/track.model';
import {ConfigRepositoryService} from "../../shared/repository/ConfigRepositoryService";
import {Config} from "../../shared/model/config.model";

const debug = require('debug')('piWriter/track.component.ts');

@Component({
    selector: 'app-track',
    templateUrl: './track.component.html',
    styleUrls: ['./track.component.css'],
    providers: [ConfigRepositoryService]
})
export class TrackComponent implements OnInit {
    @Input() track: Track;
    @Input() isFirst: boolean;
    @Input() isLast: boolean;
    @Input() mode: string = "";

    icons = config.icons;
    restURL = environment.restURL;
    serverConfig: Config;

    constructor(private configRepositoryService: ConfigRepositoryService) {
    }

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

    isPlayMode() {
        return this.mode == 'play';
    }

    isEditMode() {
        return !this.isPlayMode();
    }

    getRotateStyle() {
        if (this.track.rotate == 90) return [config.icons.rotate90];
        if (this.track.rotate == 180) return [config.icons.rotate180];
        if (this.track.rotate == 270) return [config.icons.rotate270];
        return [config.icons.rotate0];
    }

    getAlignmentStyle() {
        if (this.track.alignment == "middle") return [config.icons.alignMiddle];
        if (this.track.alignment == "bottom") return [config.icons.alignBottom];
        return [config.icons.alignTop];
    }

}
