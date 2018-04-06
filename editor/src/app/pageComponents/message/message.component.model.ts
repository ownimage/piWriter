import {config} from '../../shared/config';

export class MessageModel {

    constructor() {
    }

    message: string = null;
    error: string = null;

    setMessageTimeout = (message, timeout) => {
        this.message = message;
        setTimeout(() => {
                this.message = null;
            },
            timeout ? timeout : config.getDefaultUIMessageTimeout()
        );
    };

    setErrorTimeout = (error, timeout) => {
        this.error = error;
        setTimeout(() => {
                this.error = null;
            },
            timeout ? timeout : config.getDefaultUIMessageTimeout()
        );
    };

    setMessage = (message) => {
        this.message = message;
    };

    setError = (error) => {
        this.error = error;
    };

    getMessage = () => this.message;

    getError = () => this.error;

}