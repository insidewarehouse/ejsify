"use strict"

var ejsify = require("../index")
  , browserify = require("browserify")
  , concatStream = require("concat-stream")
  , path = require("path")
  , assert = require("assert")
  , jsdom = require("jsdom-compat")

function injectStript(cb) {
  return function (bundleJs) {
    jsdom.env({
      html: "<!doctype html>",
      src: [bundleJs],
      loaded: function (err, window) {
        assert.equal(err, null, "jsdom.env failed");
        cb(null, window)
      }
    })
  }
}

describe("ejsify", function () {

  it("should process ejs files", function (done) {

    browserify({basedir: path.join(__dirname, "fixtures")})
      .transform(ejsify)
      .require("./entry.js", {expose: "myApp"})
      .bundle()
      .pipe(concatStream(injectStript(function (err, window) {

        assert.equal(err, null, "injection failed")
        assert(window.require, "require() was not created")

        var execBundle = window.require("myApp")
        execBundle()

        assert.equal(window.document.body.innerHTML, "Ohai, Test &lt;b&gt;escaped&lt;/b&gt;")

        done()

      })))

  })

})
