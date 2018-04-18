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
  it('should throw when the callback is not a function', function () {
    assert.throws(function() {
      emptyDir('./', 'foo', 'bar')
    }, /expected/);
  });

  it('should throw when invalid arguments are passed', function () {
    assert.throws(function() {
      emptyDir.sync(null);
    });

    assert.throws(function () {
      emptyDir(null)
    })
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

  describe('without a callback argument', function () {
    it('should return a Promise', function () {
      var p = emptyDir('./test/empty')
      assert.equal(typeof p.then, 'function')
      p.catch(function (err) {
        // Ignore
      })
    })

    it('should reject when given an invalid path', function (done) {
      emptyDir('/root/super/secret').catch(function (err) {
        done()
      })
    })

    it('should resolve with true if a directory is empty', function (done) {
      emptyDir('./test/empty').then(function (result) {
        assert.equal(result, true)
        done()
      })
    });

    it('should resolve with false if a directory is not empty', function (done) {
      emptyDir('./test').then(function (result) {
        assert.equal(result, false)
        done()
      })
    });
  })
});
