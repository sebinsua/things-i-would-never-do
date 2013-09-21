/* jslint node: true */
'use strict';

var chai = require("chai");
chai.should();
chai.use(require("chai-things"));
var expect = chai.expect;

var settings = require("../../../src/settings");
var express = require("express");

describe("Settings", function () {
    var app;
    before(function () {
        app = express();
        app.configure(settings);
    });

    describe('global.baseDir', function () {
        it('should exist', function () {
            expect(global.baseDir).to.exist;
            expect(global.baseDir).is.a('string');
        });
    });

    describe('logger middleware', function () {
        it('should have been setup', function () {
            expect(app.stack).to.include.something.with.deep.property("handle.name", "logger");
        });
    });

    describe('view engine', function () {
        it('should have been loaded as jade', function () {
            var jade = require("jade");
            expect(app.engines['.jade']).to.equal(jade.__express);
        });

        it('should be set to jade', function () {
            expect(app.settings['view engine']).to.equal('jade');
        });
    });

    describe('views folder', function () {
        it('should be set to baseDir + views', function () {
            expect(app.settings['views']).to.equal(global.baseDir + '/views');
        });
    });

    describe('stylus middleware', function () {
        it('should have been setup', function () {
          expect(app.stack).to.include.something.with.deep.property("handle.name", "stylus");
        });
    });

    describe('static middleware', function () {
        it('should have been setup', function () {
          expect(app.stack).to.include.something.with.deep.property("handle.name", "static");
        });
    });

});
