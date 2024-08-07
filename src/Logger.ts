import util from 'util';
interface ANSI_CODES_Interface {
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
    reset: string;
    bold: string;
    orange: string;
}

const ANSI_CODES: ANSI_CODES_Interface = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    orange: '\x1b[48:5:166m',
};

export const debugColor = (msg: string): string => ANSI_CODES.magenta + msg + ANSI_CODES.reset;
export const infoColor = (msg: string): string => ANSI_CODES.cyan + msg + ANSI_CODES.reset;
export const warnColor = (msg: string): string => ANSI_CODES.orange + msg + ANSI_CODES.reset;
export const errorColor = (msg: string): string => ANSI_CODES.red + msg + ANSI_CODES.reset;
export const titleBold = (msg: string): string => ANSI_CODES.bold + msg + ANSI_CODES.reset;

interface LoggerMessageOptions {
    args?: any[];
    trim?: boolean;
}

export enum LogLevel {
    debug = 0,
    info = 1,
    warn = 2,
    error = 3,
    fatal = 4
}

const noop = (): void => { };

function getTimestamp(): string {
    return new Date().toISOString();
}

export class DefaultLogger{
    name : string
    logLevel : LogLevel

    constructor(name, logLevel = LogLevel.debug ) {
        this.name = name;
        this.logLevel = logLevel;
    }

    get isDebug() {
        if (this.logLevel == LogLevel.debug ) {
            return true;
        }
        return false;
    }

    getLoggerMessage({ args = [], trim = !this.isDebug }: LoggerMessageOptions): string {
        return args
            .flat(Infinity)
            .map(arg => {
                if (typeof arg === 'string') {
                    if (trim && arg.length > 100) {
                        return (
                            arg.slice(0, 100) +
                            '...\n' +
                            '<Message is too long. Enable DEBUG=1 to see the full message.>'
                        );
                    }
                    return arg;
                } else if (typeof arg === 'object' && arg?.stack != null) {
                    return arg.stack;
                }
                return util.inspect(arg);
            })
            .join(' ');
    }

    get prefix() {
        return this.logLevel ? titleBold(LogLevel[this.logLevel].toUpperCase()) : ``;
    }

    // log method
    log(...args: any[]): void {
        if (this.logLevel > LogLevel.info) {
            return noop();
        }

        const message = this.getLoggerMessage({
            args,
        });

        const fullMessage = `[${getTimestamp()}] ${this.prefix}: ${message}`;

        if (process?.stderr?.write(fullMessage + '\n')) {
            return;
        }
        
        console.log(fullMessage);
    }
    // warn method 
    warn(...args: any[]): void {
        if (this.logLevel > LogLevel.warn) {
            return noop();
        }

        const message = this.getLoggerMessage({
            args,
        });

        const fullMessage = `[${getTimestamp()}] ${this.prefix}: ⚠️ ${warnColor(message)}`;

        if (process?.stderr?.write) {
            process.stderr.write(fullMessage + '\n');
            return;
        }
        
        console.warn(fullMessage);
    }
    // info method
    info(...args: any[]): void {
        if (this.logLevel > LogLevel.info) {
            return noop();
        }

        const message = this.getLoggerMessage({
            args,
        });

        const fullMessage = `[${getTimestamp()}] ${this.prefix}: 💡 ${infoColor(message)}`;

        if (typeof process?.stderr?.write === 'function') {
            process.stderr.write(fullMessage + '\n');
            return;
        }
        
        console.info(fullMessage);
    }
    // error method
    error(...args: any[]): void {
        if (this.logLevel > LogLevel.error) {
            return noop();
        }

        const message = this.getLoggerMessage({
            args,
            trim: false,
        });

        const fullMessage = `[${getTimestamp()}] ${this.prefix}: 💥 ${errorColor(message)}`;

        if (typeof process?.stderr?.write === 'function') {
            process.stderr.write(fullMessage + '\n');
            return;
        }
        
        console.error(fullMessage);
    }
}

