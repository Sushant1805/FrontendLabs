// Simple logger wrapper without external deps.
// Controls output via NODE_ENV and LOG_LEVEL.

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const envLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
const currentLevel = LEVELS[envLevel] !== undefined ? envLevel : 'info';

function shouldLog(level) {
  return LEVELS[level] <= LEVELS[currentLevel];
}

function timestamp() {
  return new Date().toISOString();
}

module.exports = {
  error: (...args) => {
    if (shouldLog('error')) console.error(`[ERROR] [${timestamp()}]`, ...args);
  },
  warn: (...args) => {
    if (shouldLog('warn')) console.warn(`[WARN]  [${timestamp()}]`, ...args);
  },
  info: (...args) => {
    if (shouldLog('info')) console.log(`[INFO]  [${timestamp()}]`, ...args);
  },
  debug: (...args) => {
    if (shouldLog('debug')) console.log(`[DEBUG] [${timestamp()}]`, ...args);
  }
};
