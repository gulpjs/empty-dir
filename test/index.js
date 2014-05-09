const emptyDir = require('../');
const expect = require('chai').expect;
const fs = require('fs');

try {
  fs.mkdirSync('./test/empty');
} catch (e) {}

describe('emptyDir', function () {
  it('should call back with true if a directory is empty', function (done) {
    expect(emptyDir.sync('./')).to.be.false;
    emptyDir('./', function (err, result) {
      expect(result).to.be.false;
      done();
    });
  });

  it('should call back with false if a directory is not empty', function (done) {
    expect(emptyDir.sync('./test/empty')).to.be.true;
    emptyDir('./test/empty', function (err, result) {
      expect(result).to.be.true;
      done();
    });
  });
});
