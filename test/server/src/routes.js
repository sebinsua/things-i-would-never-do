var settings = require("../../../src/settings"),
    routes = require("../../../src/routes");

var express = require("express"),
    request = require("supertest");

describe("Routes", function () {
    var app;
    before(function () {
        app = express();
        app.configure(settings);
        app.configure(routes);
    });

    describe("GET /", function () {
        it("should always return a successful text/html document", function (done) {
            request(app)
                .get('/')
                .expect('Content-type', /html/)
                .expect(200, done);
        });
    });

    describe("GET /404", function () {
        it("should always return an unsuccessful text/plain document", function (done) {
            request(app)
                .get('/404')
                .expect('Content-type', /plain/)
                .expect(404, done);
        });
    });

    describe("GET /partial/tweets.html", function () {
        it("should always return a successful text/html document", function (done) {
            request(app)
                .get('/partial/tweets.html')
                .expect('Content-type', /html/)
                .expect(200, done);
        });
    });

    describe("GET /partial/non-existent-template.html", function () {
        it("should always return an unsuccessful text/plain document", function (done) {
            request(app)
                .get('/partial/non-existent-template.html')
                .expect('Content-type', /plain/)
                .expect(404, done);
        });
    });

    describe("GET /twitter/search/tweets", function () {
        it("should always return a successful application/json document", function (done) {
            request(app)
                .get('/twitter/search/tweets')
                .expect('Content-type', /json/)
                .expect(200, done);
        });
    });
});