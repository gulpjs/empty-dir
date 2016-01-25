const emptyDir = require('../');
const expect = require('chai').expect;
const fs = require('fs');

try {
  fs.mkdirSync('./test/empty');
} catch (e) {}

describe('emptyDir', function () {
  it('should call back with true if a directory is empty', function (done) {
    expect(emptyDir.sync('./')).to.be.false;
    emptyDir('./', function (err, empty) {
      expect(empty).to.be.false;
      done();
    });
  });

  it('should be false if a directory does not exist', function (done) {
    expect(emptyDir.sync('./foo/bar/baz')).to.be.false;
    emptyDir('./foo/bar/baz', function (err, empty) {
      expect(empty).to.be.false;
      done();
    });
  });

  it('should call back with false if a directory is not empty', function (done) {
    expect(emptyDir.sync('./test/empty')).to.be.true;
    emptyDir('./test/empty', function (err, empty) {
      expect(empty).to.be.true;
      done();
    });
  });
});
