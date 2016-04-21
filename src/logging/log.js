'use strict';

var os = require('os');
var process = require('process');

var name;
var version;

/**
 * @returns current log level
 */
function getCurrentLogLevel() {
  return process.env.LOG_LEVEL || 'INFO'; // eslint-disable-line no-process-env
}

/**
 * Convert a log level name to a corresponding numerical value
 *
 * @param logLevel log level to convert
 * @returns numerical log level
 */

function getNumericalLogLevel(logLevel) {
  var logLevels = {
    OFF: 0,
    ERROR: 1,
    WARN: 2,
    WARNING: 2,
    INFO: 3,
    DEBUG: 4
  };

  var numericalLogLevel = logLevels[logLevel.toUpperCase()];
  return numericalLogLevel;
}

/**
 * Log as JSON to stdout
 *
 * @param level log level
 * @param msg message to log
 * @param args map of additional key/values to log
 */
function doLog(level, msg, args) {
  var currentNumericalLogLevel = getNumericalLogLevel(getCurrentLogLevel());
  var targetNumericalLogLevel = getNumericalLogLevel(level);
  if (currentNumericalLogLevel < targetNumericalLogLevel) {
    return; // level low, do nothing
  }

  var blob = {
    '@timestamp': (new Date()).toISOString(),
    '@version': 1,
    app: name,
    version: version,
    level: level.toUpperCase(),
    host: os.hostname(),
    pid: process.pid,
    msg: msg
  };
  console.log(JSON.stringify(Object.assign(blob, args))); // eslint-disable-line no-console
}

module.exports = {
  log: doLog,
  info: (msg, args) => doLog('info', msg, args),
  warn: (msg, args) => doLog('warn', msg, args),
  error: (msg, args) => doLog('error', msg, args),
  debug: (msg, args) => doLog('debug', msg, args)
};

//exports.log = doLog;
//exports.info = (msg, args) => doLog('info', msg, args);
//exports.warn = (msg, args) => doLog('warn', msg, args);
//exports.error = (msg, args) => doLog('error', msg, args);
//exports.debug = (msg, args) => doLog('debug', msg, args);
