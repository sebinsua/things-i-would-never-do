/* jslint node: true */
'use strict';

var sinon = require("sinon"),
    chai = require("chai");
var expect = chai.expect;

var controllers = require("../../../src/controllers");

describe("Controllers", function () {

    describe("index", function () {
        it("should be a function", function () {
            expect(controllers.index).to.be.a("function");
        });

        it("should return the index view", function () {
            var mockReq = null;
            var mockRes = {
                render: function (viewName) {
                    expect(viewName).to.exist;
                    expect(viewName).to.equal("index");
                }
            };
            controllers.index(mockReq, mockRes);
        });
    });

    describe("getPartial", function () {
        it("should be a function", function () {
            expect(controllers.getPartial).to.be.a("function");
        });

        it("should return a particular template view", function () {
            var mockReq = {
                params: {
                    templateName: 'tweets'
                }
            };
            var mockRes = {
                render: function (viewName) {
                    expect(viewName).to.exist;
                    expect(viewName).to.equal("partial/tweets");
                }
            };
            controllers.getPartial(mockReq, mockRes);
        });
    });

    describe("twitterSearchTweets", function () {
        it("should be a function", function () {
            expect(controllers.twitterSearchTweets).to.be.a("function");
        });

        it("should return some json always", function () {
            var mockReq = {
                query: {}
            };
            var mockRes = {
                json: sinon.spy()
            };
            controllers.twitterSearchTweets(mockReq, mockRes);

            expect(mockRes.json.called).to.be.true;
        });        
    });      
});