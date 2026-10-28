"use strict";

var fs = require("node:fs");
var path = require("node:path");
var assert = require("node:assert");
var { describe, it } = require("node:test");

var emptyDir = require("../");
try {
  fs.mkdirSync(path.join(__dirname, "empty"));
} catch {
  // Ignore error
}

function isGarbageFile(filename) {
  return /(?:Thumbs\.db|\.DS_Store)$/i.test(filename);
}

describe("emptyDir", function () {
  it("should throw when the callback is not a function", function () {
    assert.throws(function () {
      emptyDir("./", "foo", "bar");
    });
  });

  it("should throw when invalid arguments are passed", function () {
    assert.throws(function () {
      emptyDir.sync(null);
    });

    assert.throws(function () {
      emptyDir(null);
    });
  });

  it("should take an array", function (t, done) {
    assert.deepStrictEqual(emptyDir.sync(["Thumbs.db", ".DS_Store"]), false);

    emptyDir(["Thumbs.db", ".DS_Store"], function (err, empty) {
      assert.deepStrictEqual(empty, false);
      done();
    });
  });

  it("should take a filter function to exclude files", function (t, done) {
    assert.deepStrictEqual(
      emptyDir.sync(["Thumbs.db", ".DS_Store"], isGarbageFile),
      true,
    );
    assert.deepStrictEqual(
      emptyDir.sync(["Thumbs.db", ".DS_Store", "foo"], isGarbageFile),
      false,
    );

    emptyDir(["Thumbs.db", ".DS_Store"], isGarbageFile, function (err, empty) {
      assert.strictEqual(empty, undefined);
      done();
    });
  });

  it("should call back with true if a directory is empty", function (t, done) {
    assert.deepStrictEqual(emptyDir.sync("./test"), false);
    assert.deepStrictEqual(emptyDir.sync("./test/empty"), true);
    emptyDir("./test/empty", function (err, empty) {
      assert.ifError(err);
      assert.deepStrictEqual(empty, true);
      done();
    });
  });

  it("should be false if a directory does not exist", function (t, done) {
    assert.deepStrictEqual(emptyDir.sync("./foo/bar/baz"), false);
    emptyDir("./foo/bar/baz", function (err) {
      done(err);
    });
  });

  it("should call back with false if a directory is not empty", function (t, done) {
    assert.deepStrictEqual(emptyDir.sync("./"), false);
    emptyDir("./", function (err, empty) {
      assert.ifError(err);
      assert.strictEqual(empty, false);
      done();
    });
  });

  it("surfaces readdir error if one occurs", function (t, done) {
    t.mock.method(fs, "readdir", function (dirpath, cb) {
      cb(new Error("boom"));
    });

    emptyDir("./test/empty", function (err, empty) {
      assert.notStrictEqual(err, undefined);
      assert.deepStrictEqual(empty, undefined);
      done();
    });
  });

  describe("without a callback argument", function () {
    it("should return a Promise", function (t, done) {
      var p = emptyDir("./test/empty");
      assert.deepStrictEqual(typeof p.then, "function");
      p.then(function () {
        done();
      });
    });

    it("should resolve with false if a directory does not exist", function (t, done) {
      emptyDir("/root/super/secret").then(function (result) {
        assert.deepStrictEqual(result, false);
        done();
      });
    });

    it("should resolve with true if a directory is empty", function (t, done) {
      emptyDir("./test/empty").then(function (result) {
        assert.deepStrictEqual(result, true);
        done();
      });
    });

    it("should resolve with false if a directory is not empty", function (t, done) {
      emptyDir("./test").then(function (result) {
        assert.deepStrictEqual(result, false);
        done();
      });
    });
  });
});
