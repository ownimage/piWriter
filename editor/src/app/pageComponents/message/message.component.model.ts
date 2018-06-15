import {config} from '../../common/config';

export class MessageModel {

    constructor() {
    }

    message: string = null;
    error: string = null;

    setMessageTimeout = (message, timeout?) => {
        this.message = message;
        setTimeout(() => {
                this.message = null;
            },
            timeout ? timeout : config.getDefaultUIMessageTimeout()
        );
    };

    setErrorTimeout = (error, timeout?) => {
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

    clearMessage = () => {
        this.message = null;
    };

    setError = (error) => {
        this.error = error;
    };

    clearError = () => {
        this.error = null;
    };

    clearAll = () => {
        this.message = null;
        this.error = null;
    };

    getMessage = () => this.message;

    getError = () => this.error;

}