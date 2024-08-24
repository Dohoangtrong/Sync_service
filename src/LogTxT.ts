import * as fs from 'fs';
import * as path from 'path';

function checkExist(): void {
    if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
    }
}

function getCurrentDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}


function checkTimeFormat(
    message: string
): boolean {
    const timeRegex = /\b([01]\d|2[0-3]):[0-5]\d:[0-5]\d\b/;
    return timeRegex.test(message);
}


export class LogTxT {
    private logDir: string;
    private logFileName: string;
    private logFilePath: string;

    constructor(logDir: string = './logs', logFileName: string = `log${getCurrentDateString()}.txt`) {
        this.logDir = logDir;
        this.logFileName = logFileName;
        this.logFilePath = path.join(this.logDir, this.logFileName);
        checkExist();
    }

    public writeLog(message: string, logLevel: string = "DEBUG"): void {
        let logMessage: string = `${message}\n`;
        if (!checkTimeFormat(message)) {
            const now = new Date();
            const timestamp = now.toTimeString().split(' ')[0];
            logMessage = `${timestamp} [${logLevel}] ${message}\n`;
        }

        fs.appendFile(this.logFilePath, logMessage, (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            }
        });
    }

    public overrideConsole(): void {
        const _debug = console.debug;
        const _info = console.info;
        const _warn = console.warn;
        const _error = console.error;
        const _log = console.log;

        console.debug = (...args: any[]): void => {
            const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
            _debug.apply(console, args);
            this.writeLog(message);
        };

        console.info = (...args: any[]): void => {
            const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
            _info.apply(console, args);
            this.writeLog(message, "INFO");
        };

        console.warn = (...args: any[]): void => {
            const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
            _warn.apply(console, args);
            this.writeLog(message, "WARN");
        };

        console.error = (...args: any[]): void => {
            const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
            _error.apply(console, args);
            this.writeLog(message, "ERROR");
        };

        console.log = (...args: any[]): void => {
            const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
            _log.apply(console, args);
            this.writeLog(message, '');
        };
    }
}

export default LogTxT;
