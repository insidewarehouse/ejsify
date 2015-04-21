"use strict"

var ejsify = require("../index")
  , browserify = require("browserify")
  , concatStream = require("concat-stream")
  , path = require("path")
  , assert = require("assert")
  , jsdom = require("jsdom-compat")

function bundleAndLoad(entryFile, cb) {
  browserify({basedir: path.join(__dirname, "fixtures")})
    .transform(ejsify)
    .require(entryFile, {expose: "myApp"})
    .bundle()
    .pipe(concatStream(function (bundleJs) {
      jsdom.env({
        html: "<!doctype html>",
        src: [bundleJs],
        loaded: function (err, window) {
          assert.equal(err, null, "jsdom.env failed");
          cb(null, window)
        }
      })
    }))
}

describe("ejsify", function () {

  it("should process ejs files", function (done) {

    bundleAndLoad("./trivial/entry", function (err, window) {

      assert.equal(err, null, "injection failed")

      var runApp = window.require("myApp")
      runApp()

      assert.equal(window.document.body.innerHTML, "Ohai, Test &lt;b&gt;escaped&lt;/b&gt;")

      done()

    });

  })

})
