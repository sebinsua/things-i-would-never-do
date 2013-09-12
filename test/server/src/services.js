/* jslint node: true */
'use strict';

var sinon = require("sinon"),
    chai = require("chai"),
    expect = chai.expect;

var services = require("../../../src/services");

describe("TwitterService", function () {
    var _mockCache;
    beforeEach(function () {
        _mockCache = {
            get: function (key, callback) { },
            set: function (key, body) { },
            expire: function (key, expiryTime) { }
        };
    });

    describe("cacheClient", function () {
        it('should be mocked correctly', function () {
            var mockCacheClient = sinon.mock(_mockCache);
            mockCacheClient.expects("get").once().returns(42);
            
            expect(_mockCache.get()).to.equal(42);
            mockCacheClient.verify();
        });
    });

    describe("_checkCacheOrMakeRequest", function () {

        it('should be a function', function () {
            var mockCacheClient = sinon.mock(_mockCache);

            var twitter = new services.TwitterService(mockCacheClient);
            twitter.revealPrivates();

            expect(twitter._checkCacheOrMakeRequest).to.be.a('function');
        });

        it('should call the callback if there is a reply', function () {
            var mockCacheClient = sinon.mock(_mockCache);
            mockCacheClient.expects('get').callsArgWith(1, null, 'here is a reply');
            
            var makeRequestSpy = sinon.spy();
            var callbackSpy = sinon.spy();

            var twitter = new services.TwitterService(mockCacheClient);
            
            twitter.revealPrivates();
            twitter._checkCacheOrMakeRequest('fakeKey', makeRequestSpy, callbackSpy);
            

            expect(makeRequestSpy.called).is.false;
            expect(callbackSpy.calledOnce).is.true;
            expect(callbackSpy.getCall(0).args[0]).to.equal(null);
            expect(callbackSpy.getCall(0).args[1]).to.equal('here is a reply');
            mockCacheClient.verify();
        });


        it('should call makeRequest if there is an error', function () {
            var mockCacheClient = sinon.mock(_mockCache);
            mockCacheClient.expects('get').callsArgWith(1, 'some error message');
            
            var makeRequestSpy = sinon.spy();
            var callbackSpy = sinon.spy();

            var twitter = new services.TwitterService(mockCacheClient);
            
            twitter.revealPrivates();
            twitter._checkCacheOrMakeRequest('fakeKey', makeRequestSpy, callbackSpy);
            
            expect(callbackSpy.called).is.false;
            expect(makeRequestSpy.calledOnce).is.true;
            expect(makeRequestSpy.getCall(0).args[0]).to.equal(callbackSpy);
            mockCacheClient.verify();
        });

        it('should call makeRequest if there is no error but no reply', function () {
            var mockCacheClient = sinon.mock(_mockCache);
            mockCacheClient.expects('get').callsArgWith(1, null, null);
            
            var makeRequestSpy = sinon.spy();
            var callbackSpy = sinon.spy();

            var twitter = new services.TwitterService(mockCacheClient);
            
            twitter.revealPrivates();
            twitter._checkCacheOrMakeRequest('fakeKey', makeRequestSpy, callbackSpy);
            
            expect(callbackSpy.called).is.false;
            expect(makeRequestSpy.calledOnce).is.true;
            expect(makeRequestSpy.getCall(0).args[0]).to.equal(callbackSpy);
            mockCacheClient.verify();
        });

    });
});
