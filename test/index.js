var fs = require('fs');
var path = require('path');

var expect = require('expect');

var emptyDir = require('../');
try {
  fs.mkdirSync(path.join(__dirname, 'empty'));
} catch (e) {
  // Ignore error
}

function isGarbageFile(filename) {
  return /(?:Thumbs\.db|\.DS_Store)$/i.test(filename);
}

describe('emptyDir', function () {
  it('should throw when the callback is not a function', function (done) {
    expect(function () {
      emptyDir('./', 'foo', 'bar');
    }).toThrow(/expected/);
    done();
  });

  it('should throw when invalid arguments are passed', function (done) {
    expect(function () {
      emptyDir.sync(null);
    }).toThrow();

    expect(function () {
      emptyDir(null);
    }).toThrow();
    done();
  });

  it('should take an array', function (done) {
    expect(emptyDir.sync(['Thumbs.db', '.DS_Store'])).toEqual(false);
    emptyDir(['Thumbs.db', '.DS_Store'], function (err, empty) {
      expect(empty).toEqual(false);
      done();
    });
  });

  it('should take a filter function to exclude files', function (done) {
    expect(emptyDir.sync(['Thumbs.db', '.DS_Store'], isGarbageFile)).toEqual(
      true
    );
    expect(
      emptyDir.sync(['Thumbs.db', '.DS_Store', 'foo'], isGarbageFile)
    ).toEqual(false);

    emptyDir(['Thumbs.db', '.DS_Store'], isGarbageFile, function (err, empty) {
      expect(empty).toEqual(true);
      done();
    });
  });

  it('should call back with true if a directory is empty', function (done) {
    expect(emptyDir.sync('./test')).toEqual(false);
    expect(emptyDir.sync('./test/empty')).toEqual(true);
    emptyDir('./test/empty', function (err, empty) {
      expect(empty).toEqual(true);
      done();
    });
  });

  it('should be false if a directory does not exist', function (done) {
    expect(emptyDir.sync('./foo/bar/baz')).toEqual(false);
    emptyDir('./foo/bar/baz', function (err) {
      done(err);
    });
  });

  it('should call back with false if a directory is not empty', function (done) {
    expect(emptyDir.sync('./')).toEqual(false);
    emptyDir('./', function (err, empty) {
      expect(empty).toEqual(false);
      done();
    });
  });

  describe('without a callback argument', function () {
    it('should return a Promise', function (done) {
      var p = emptyDir('./test/empty');
      expect(typeof p.then).toEqual('function');
      p.then(function () {
        done();
      });
    });

    it('should resolve with false if a directory does not exist', function (done) {
      emptyDir('/root/super/secret').then(function (result) {
        expect(result).toEqual(false);
        done();
      });
    });

    it('should resolve with true if a directory is empty', function (done) {
      emptyDir('./test/empty').then(function (result) {
        expect(result).toEqual(true);
        done();
      });
    });

    it('should resolve with false if a directory is not empty', function (done) {
      emptyDir('./test').then(function (result) {
        expect(result).toEqual(false);
        done();
      });
    });
  });
});
