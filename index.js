'use strict';

var fs = require('fs');

function emptyDir(dir, filter, cb) {
  if (arguments.length === 2) {
    cb = filter;
    filter = null;
  }

  if (typeof cb !== 'function') {
    throw new TypeError('expected callback to be a function');
  }

  if (Array.isArray(dir)) {
    cb(null, isEmpty(dir, filter));
    return;
  }

  if (typeof dir !== 'string') {
    cb(new TypeError('expected a directory or array of files'));
    return;
  }

  fs.stat(dir, function(err, stat) {
    if (err || !stat.isDirectory()) {
      cb(null, false);
      return;
    }

    fs.readdir(dir, function(err, files) {
      cb(err, isEmpty(files, filter));
    });
  });
}

/**
 * Return true if the given `files` array has zero length or only
 * includes unwanted files.
 */

function emptyDirSync(dir, filter) {
  if (Array.isArray(dir)) {
    return isEmpty(dir, filter);
  }

  if (typeof dir !== 'string') {
    throw new TypeError('expected a directory or array of files');
  }

  if (!isDirectory(dir)) {
    return false;
  }

  var files = fs.readdirSync(dir);
  return isEmpty(files, filter);
}

/**
 * Returns true if the given "files" array is empty or only
 * contains unwanted files.
 */

function isEmpty(files, filter) {
  if (files.length === 0) {
    return true;
  }

  if (typeof filter !== 'function') {
    return false;
  }

  for (var i = 0; i < files.length; ++i) {
    if (filter(files[i]) === false) {
      return false;
    }
  }
  return true;
}

/**
 * Returns true if the filepath exists and is a directory
 */

function isDirectory(filepath) {
  try {
    return fs.statSync(filepath).isDirectory();
  } catch (err) {}
  return false;
}

/**
 * Expose `emptyDir`
 */

module.exports = emptyDir;
module.exports.sync = emptyDirSync;
module.exports.isEmpty = isEmpty;
