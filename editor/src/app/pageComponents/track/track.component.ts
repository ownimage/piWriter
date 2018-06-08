import {Component, Input, OnInit} from '@angular/core';

import {config} from '../../common/config'
import {environment} from '../../../environments/environment';
import {Track} from '../../../../../serverCommon/src/shared/model/track.model';
import {ConfigRepositoryService} from "../../common/repository/ConfigRepositoryService";
import {Config} from "../../../../../serverCommon/src/shared/model/config.model";

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

    getHeight() {
        if (!this.serverConfig) return 20;
        if (!this.track) return this.serverConfig.smallPreviewHeight;
        if (this.track.isAdvancedMode()) return this.serverConfig.largePreviewHeight;
        return this.serverConfig.smallPreviewHeight;
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
        if (this.track.alignment == 'middle') return [config.icons.alignMiddle];
        if (this.track.alignment == 'bottom') return [config.icons.alignBottom];
        return [config.icons.alignTop];
    }

    getStripesStyle() {
        if (this.track.useStripes == 'horizontal') return [config.icons.horizontal];
        if (this.track.useStripes == 'vertical') return [config.icons.vertical];
        return [config.icons.cross];
    }

    getStripesColor() {
        if (this.track.useStripes == 'false') return ['red'];
        return ['black'];
    }

    getSVG(): string {
        return "M 0 5 L 100 5 L 100 95 L 0 95 L 0 5";
        // if (this.track.end == "none") return "M 0 5 L 100 5 L 100 95 L 0 95 L 0 5";
        // let left = "M 55 95 L 0 95 L 20 80 L 0 65 L 20 50 L 0 35 L 20 20 L 0 5 L 55 5 ";
        // switch (this.track.endStyle) {
        //     case "top-down":
        //         return left + "M 65 5 L 100 5 L 65 95 L 65 5";
        //     case "bottom-up":
        //         return left + "M 65 5 L 65 95 L 100 95 L 65 5";
        //     case "diamond":
        //         return left + "M 65 5 L 100 50 L 65 95 L 65 5";
        //     case "semicircle":
        //         return left + "M 65 5 Q 100 50 65 95 L 65 5";
        //     case "ribbon":
        //         return left + "M 65 5 L 100 5 L 65 50 L 100 95 L 65 95 L 65 5";
        //}
    }

    getSVGTransform(): string {
        //if (this.track.end == "left") return "scale(-1, 1) translate(-100, 0)";
        return "";
    }

}
