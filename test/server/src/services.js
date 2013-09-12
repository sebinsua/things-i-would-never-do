/* jslint node: true */
'use strict';

var sinon = require("sinon"),
    chai = require("chai"),
    expect = chai.expect;

var services = require("../../../src/services");

describe("TwitterService", function () {
    var _mockCache, _mockOauth2, _mockRequest;
    beforeEach(function () {
        _mockCache = {
            get: function (key, callback) { },
            set: function (key, body) { },
            expire: function (key, expiryTime) { }
        };
        _mockOauth2 = {
            getOAuthAccessToken: function (str, options, callback) { }
        };
        _mockRequest = {
            get: function (url, options, callback) { }
        }
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
    
    describe('_getAccessToken', function () {
        it('should be a function', function () {
            var mockCacheClient = sinon.mock(_mockCache);

            var twitter = new services.TwitterService(mockCacheClient);
            twitter.revealPrivates();

            expect(twitter._getAccessToken).to.be.a('function');
        });

        it('should set the cache and call the callback if there is a cache miss', function () {
            var mockCacheClient = sinon.mock(_mockCache);
            mockCacheClient.expects('get').callsArgWith(1, null, null); // cache miss!
            mockCacheClient.expects('set').once().withArgs("accessToken", "accessToken goes here");
            mockCacheClient.expects('expire').once().withArgs("accessToken", 600);

            var mockOauthClient = sinon.mock(_mockOauth2);
            mockOauthClient.expects('getOAuthAccessToken').once().callsArgWith(2, null, "accessToken goes here");

            var callbackSpy = sinon.spy();

            var twitter = new services.TwitterService(mockCacheClient, mockOauthClient);
            
            twitter.revealPrivates();
            twitter._getAccessToken(callbackSpy);
            
            expect(callbackSpy.calledOnce).is.true;
            expect(callbackSpy.getCall(0).args[0]).is.null;
            expect(callbackSpy.getCall(0).args[1]).to.equal("accessToken goes here");
            
            mockCacheClient.verify();
            mockOauthClient.verify();
        });

        it('should call the callback if oauth errors', function () {
            var mockCacheClient = sinon.mock(_mockCache);
            mockCacheClient.expects('get').callsArgWith(1, null, null); // cache miss!

            var mockOauthClient = sinon.mock(_mockOauth2);
            mockOauthClient.expects('getOAuthAccessToken').once().callsArgWith(2, "An error happens.", null);

            var callbackSpy = sinon.spy();

            var twitter = new services.TwitterService(mockCacheClient, mockOauthClient);
            
            twitter.revealPrivates();
            twitter._getAccessToken(callbackSpy);
            
            expect(callbackSpy.calledOnce).is.true;
            expect(callbackSpy.getCall(0).args[0]).to.equal("An error happens.");
            expect(callbackSpy.getCall(0).args[1]).is.undefined;
            
            mockCacheClient.verify();
            mockOauthClient.verify();
        });

        it('should call the callback if the cache was there', function () {
            var mockCacheClient = sinon.mock(_mockCache);
            mockCacheClient.expects('get').callsArgWith(1, null, "accessToken goes here"); 

            var mockOauthClient = sinon.mock(_mockOauth2);

            var callbackSpy = sinon.spy();

            var twitter = new services.TwitterService(mockCacheClient, mockOauthClient);
            
            twitter.revealPrivates();
            twitter._getAccessToken(callbackSpy);
            
            expect(callbackSpy.calledOnce).is.true;
            expect(callbackSpy.getCall(0).args[0]).is.null;
            expect(callbackSpy.getCall(0).args[1]).to.equal("accessToken goes here");
            
            mockCacheClient.verify();
            mockOauthClient.verify();
        });
    });

    describe('_makeRequestWithAccessToken', function () {
        it('should be a function', function () {
            var mockCacheClient = sinon.mock(_mockCache);

            var twitter = new services.TwitterService(mockCacheClient);
            twitter.revealPrivates();

            expect(twitter._makeRequestWithAccessToken).to.be.a('function');
        });

        it('should set the cache and call the callback with json if there is a cache miss', function () {
            var mockCacheClient = sinon.mock(_mockCache);
            mockCacheClient.expects('get').callsArgWith(1, null, null); // cache miss!
            mockCacheClient.expects('set').once().withArgs("tweetsForUrl-fake url", '{ "statuses": [] }');
            mockCacheClient.expects('expire').once().withArgs("tweetsForUrl-fake url", 15);

            var mockRequestClient = sinon.mock(_mockRequest);
            mockRequestClient.expects('get').once().callsArgWith(2, null, null, '{ "statuses": [] }');

            var callbackSpy = sinon.spy();

            var twitter = new services.TwitterService(mockCacheClient, null, mockRequestClient);
            
            twitter.revealPrivates();
            var url = "fake url", accessToken = "fake accessToken";
            twitter._makeRequestWithAccessToken(url, accessToken, callbackSpy);
            
            expect(callbackSpy.calledOnce).is.true;
            expect(callbackSpy.getCall(0).args[0]).is.null;
            expect(callbackSpy.getCall(0).args[1]).to.eql({ "statuses": [] });
            
            mockCacheClient.verify();
            mockRequestClient.verify();
        });

        it('should call the callback if request errors', function () {
            var mockCacheClient = sinon.mock(_mockCache);
            mockCacheClient.expects('get').callsArgWith(1, null, null); // cache miss!

            var mockRequestClient = sinon.mock(_mockRequest);
            mockRequestClient.expects('get').once().callsArgWith(2, "An error happens.", null, null);

            var callbackSpy = sinon.spy();

            var twitter = new services.TwitterService(mockCacheClient, null, mockRequestClient);
            
            twitter.revealPrivates();
            var url = "fake url", accessToken = "fake accessToken";
            twitter._makeRequestWithAccessToken(url, accessToken, callbackSpy);
            
            expect(callbackSpy.calledOnce).is.true;
            expect(callbackSpy.getCall(0).args[0]).to.equal("An error happens.");
            expect(callbackSpy.getCall(0).args[1]).is.undefined;
            
            mockCacheClient.verify();
            mockRequestClient.verify();
        });

        it('should call the callback with json if the request cache was there', function () {
            var mockCacheClient = sinon.mock(_mockCache);
            mockCacheClient.expects('get').callsArgWith(1, null, '{ "statuses": [] }');
            // Actually this doesn't quite make sense, the first time it had meant to return the accessToken
            // and the second time the statuses...

            var mockRequestClient = sinon.mock(_mockRequest);

            var callbackSpy = sinon.spy();

            var twitter = new services.TwitterService(mockCacheClient, null, mockRequestClient);
            
            twitter.revealPrivates();
            var url = "fake url", accessToken = "fake accessToken";
            twitter._makeRequestWithAccessToken(url, accessToken, callbackSpy);
            
            expect(callbackSpy.calledOnce).is.true;
            expect(callbackSpy.getCall(0).args[0]).is.null;
            expect(callbackSpy.getCall(0).args[1]).to.eql({ "statuses": [] });
            
            mockCacheClient.verify();
            mockRequestClient.verify();
        });
      
    });

    // searchTweets is too complex to test, either way - all it does is use lesser functions.
});
