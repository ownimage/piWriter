export {};

const debug = require('debug')('serverCommon/Player');
debug('### serverCommon/Player');

import {Playlist} from './Playlist';

const {logError} = require('../utils/common');

class Player {

    // Player
    //    state: string one of Idle, Single, Looping, ReqStop
    //    currentTrack: int shows the index of the picture that is being shown
    //    autostartNext: boolean whether the next picture is to be started automatically
    constructor(private playlist: Playlist = null,
                private state: string = 'Idle',
                private currentTrack: number = -1,
                private autostartNext: boolean = false,
                private halt: boolean = true,
                private speed: number = 1) {
    }

    private showPicture(picture, repeat, speed, render, renderBlank) {
        debug('showPicture');
        debug('picture.speed %d', speed);
        debug('this.playlist 1 %o', this.playlist);
        debug('render %o', render);

        this.state = (repeat) ? 'Looping' : 'Single';
        let timeout = 20 / (this.speed * speed);

        const show = (picture, i, timeout, render, renderBlank) => {
            debug('show');
            debug('this.playlist 2 %o', this.playlist);
            debug('render %o', render);

            if (i < picture.timedArrays.length) {
                let timedArray = picture.timedArrays[i];
                render(timedArray.ca);
                setTimeout(show, timedArray.t * timeout, picture, i + 1, timeout, render, renderBlank); /// was 1000
            } else {
                renderBlank();
                if (this.halt) return;
                debug('this.playlist 3 %o', this.playlist);
                debug('render %o', render);
                if (this.state == 'Looping') {
                    show(picture, 0, timeout, render, renderBlank);
                }
                else {
                    this.state = "Idle";
                    if (this.autostartNext) {
                        this.next(render, renderBlank);
                    }
                    else {
                        renderBlank();
                    }
                }
            }
        };

        debug('render e %o', render);
        show(picture, 0, timeout, render, renderBlank);
    }


    next(render, renderBlank) {
        try {
            debug('next');

            if (!this.playlist) return;
            this.halt = false;

            if (this.state === 'Idle') {
                debug('Idle');
                this.currentTrack++;
                if (this.currentTrack >= this.playlist.getTrackCount()) {
                    debug('currentTrack wrap round');
                    this.currentTrack = 0;
                }
                let currentTrackNum = this.currentTrack;
                debug('currentTrackNum %d', currentTrackNum);
                let currentTrack = this.playlist.getTrack(currentTrackNum);
                debug('currentTrack %o', currentTrack);
                let picture = this.playlist.getPicture(currentTrackNum);
                debug('picture %o', picture);
                let speed = currentTrack.speed;
                let repeat = currentTrack.repeat;
                this.autostartNext = currentTrack.autostartNext;
                this.showPicture(picture, repeat, speed, render, renderBlank);
            }
            else if (this.state === 'Single') {
                debug('Single');
                this.autostartNext = true;
            }
            else if (this.state === 'Looping') {
                debug('Looping');
                this.state = 'ReqStop'
            }
            else if (this.state === 'ReqStop') {
                debug('ReqStop');
                this.autostartNext = true;
            }
        } catch (err) {
            logError(debug, err);
        }
    };

    play(playlist: Playlist) {
        this.halt = true;
        this.autostartNext = false;
        this.currentTrack = -1;
        this.state = 'Idle'
        this.playlist = playlist;
    }

    setConfig(config) {
        this.speed = config.speed;
        this.play(this.playlist);
    }

};

module.exports = new Player();


