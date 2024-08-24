export { HttpStatusCode } from "./constants/Response"
export { Logger, LogLevel } from "./Logger"

export { isDataLocked, delLocked, redis } from "./Redis"


export { LogTxT } from "./LogTxT"
/*
import LogTxT from '...';

const logger = new LogTxT('./ex', 'log1.txt');

logger.writeLog('test message.', 'INFO');
logger.overrideConsole();

console.info('info');
console.error('error');

*/