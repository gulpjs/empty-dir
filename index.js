const fs = require('fs');
const tryOpen = require('try-open');

function isEmpty(path, fn, callback) {
  if (arguments.length === 2) {
    callback = fn;
    fn = null;
  }

  if (!exists(path)) {
    callback(null, false);
    return;
  }

  fs.readdir(path, function(err, files) {
    if (err === null) {
      callback(null, hasFiles(files, fn));
    } else {
      callback(err);
    }
  });
};

isEmpty.sync = function(path, fn) {
  if (!exists(path)) {
    return false;
  }
  try {
    return hasFiles(fs.readdirSync(path), fn);
  } catch (err) {};
  return false;
};

function hasFiles(files, fn) {
  return files.filter(fn || function(path) {
    return !/\.DS_Store/i.test(path);
  }).length === 0;
}

function exists(path) {
  return path ? typeof tryOpen(path, 'r') === 'number' : false;
}

module.exports = isEmpty;
