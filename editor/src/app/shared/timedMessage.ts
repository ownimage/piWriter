import {Config} from '../shared/config';
let config = new Config();

export class TimedMessage {
    constructor() {
    }

    message: string = null;

    setMessage = (newMessage, timeout) => {
        this.message = newMessage;
        setTimeout(() => {
            this.message = null;},
            timeout ? timeout : config.getDefaultUIMessageTimeout()
        );
    }
}
