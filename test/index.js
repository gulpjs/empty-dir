var emptyDir = require('../');
var assert = require('assert');
var path = require('path');
var fs = require('fs');

try {
  fs.mkdirSync(path.join(__dirname, 'empty'));
} catch (e) {}

function isGarbageFile(filename) {
  return /(?:Thumbs\.db|\.DS_Store)$/i.test(filename);
}

describe('emptyDir', function () {
  it('should throw when a callback is not passed', function () {
    assert.throws(function() {
      emptyDir('./')
    }, /expected/);
  });

  it('should throw when invalid arguments are passed', function (done) {
    assert.throws(function() {
      emptyDir.sync(null);
    });

    emptyDir(null, function(err) {
      assert(err);
      assert(/expected/.test(err.message));
      done();
    });
  });

  it('should take an array', function (done) {
    assert(!emptyDir.sync(['Thumbs.db', '.DS_Store']));
    emptyDir(['Thumbs.db', '.DS_Store'], function(err, empty) {
      assert(!empty);
      done();
    });
  });

  it('should take a filter function to exclude files', function (done) {
    assert(emptyDir.sync(['Thumbs.db', '.DS_Store'], isGarbageFile));
    assert(!emptyDir.sync(['Thumbs.db', '.DS_Store', 'foo'], isGarbageFile));

    emptyDir(['Thumbs.db', '.DS_Store'], isGarbageFile, function(err, empty) {
      assert(empty);
      done();
    });
  });

  it('should call back with true if a directory is empty', function (done) {
    assert(!emptyDir.sync('./'));
    emptyDir('./', function(err, empty) {
      assert(!empty);
      done();
    });
  });

  it('should be false if a directory does not exist', function (done) {
    assert(!emptyDir.sync('./foo/bar/baz'));
    emptyDir('./foo/bar/baz', function (err, empty) {
      assert(!empty);
      done();
    });
  });

  it('should call back with false if a directory is not empty', function (done) {
    assert(!emptyDir.sync('./test'));
    assert(emptyDir.sync('./test/empty'));
    emptyDir('./test/empty', function (err, empty) {
      assert(empty);
      done();
    });
  });
});
