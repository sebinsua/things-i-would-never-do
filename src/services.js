/* jslint node: true */
'use strict';

var config = require('./config');

var async = require('async'),
    redis = require("redis"),
    url = require('url');

var OAuth2 = require("oauth").OAuth2,
    requestLib = require("request"),
    querystring = require("querystring");




var TwitterService = function (mockCacheClient, mockOauth2, mockRequest) {
  var baseUrl = "https://api.twitter.com/1.1";
  
  var cacheClient = null;
  var oauth2 = null;
  var request = null;

  var shortCacheExpiryTime = 15;
  var longCacheExpiryTime = 60;

  this.searchTweets = function (queryString, renderResponseCallback) {
    async.waterfall([
      _getAccessToken,
      _generateMakeRequestWithAccessTokenFunctionFromParameters({ q: queryString, count: 8 }),
      function parseStatuses (data, callback) {
        var statuses = data.statuses;
        callback(null, statuses);
      }
    ], renderResponseCallback);
  };

  var _init = function (mockCacheClient, mockOauth2, mockRequest) {
    if (mockCacheClient || mockOauth2 || mockRequest) {
      if (mockCacheClient) {
        cacheClient = mockCacheClient.object;
      }
      if (mockOauth2) {
        oauth2 = mockOauth2.object;
      }
      if (mockRequest) {
        request = mockRequest.object;
      }
      return true;
    }

    var redisUrl = url.parse(config.REDISCLOUD_URL);
    var redisAuth = redisUrl.auth ? redisUrl.auth.split(":")[1] : '';

    cacheClient = redis.createClient(redisUrl.port, redisUrl.hostname, { no_ready_check: true });
    cacheClient.on("error", function (err) {
      console.log("ERROR: " + err);
    });
    cacheClient.auth(redisAuth);

    oauth2 = new OAuth2(config.TWITTER_KEY, config.TWITTER_SECRET, 'https://api.twitter.com/', null, 'oauth2/token', null);

    request = requestLib;
  };

  this.revealPrivates = function () {
    this._checkCacheOrMakeRequest = _checkCacheOrMakeRequest;
    this._getAccessToken = _getAccessToken;
    this._generateUrlFromParameters = _generateUrlFromParameters;
    this._generateMakeRequestWithAccessTokenFunctionFromParameters = _generateMakeRequestWithAccessTokenFunctionFromParameters;
    this._makeRequestWithAccessToken = _makeRequestWithAccessToken;
  }

  var _checkCacheOrMakeRequest = function (key, orMakeRequest, callback) {
    cacheClient.get(key, function (err, reply) {
      if (err) {
        return orMakeRequest(callback);
      }

      if (reply) {
        return callback(null, reply);
      } else {
        return orMakeRequest(callback);
      }
    });
  };

  var _getAccessToken = function (callback) {
    // If we can't fetch the accessToken from Redis, then get it from Twitter's OAuth2 service.
    _checkCacheOrMakeRequest("accessToken", function (callback) {
      oauth2.getOAuthAccessToken(
        '',
        { 'grant_type': 'client_credentials' },
        function (err, accessToken) {
          if (err) {
            return callback(err);
          }

          cacheClient.set("accessToken", accessToken);
          cacheClient.expire("accessToken", longCacheExpiryTime * 10);

          return callback(null, accessToken);
        }
      );

    }, callback);
  };

  var _generateUrlFromParameters = function (parameters) {
    var url = baseUrl + "/search/tweets.json?" + querystring.stringify(parameters);
    return url;
  };

  var _generateMakeRequestWithAccessTokenFunctionFromParameters = function (parameters) {
    var url = _generateUrlFromParameters(parameters);
    
    return function (accessToken, callback) {
      _makeRequestWithAccessToken(url, accessToken, callback);
    };
  }

  var _makeRequestWithAccessToken = function (url, accessToken, callback) {
    var _parseAndGoToNextCallback = function (err, reply) {
      if (err) {
        return callback(err);
      }
      var data = JSON.parse(reply);
      return callback(null, data);
    };

    var key = "tweetsForUrl-" + url;
    _checkCacheOrMakeRequest(key, function () {
      request.get(url, { headers: { Authorization: "Bearer " + accessToken } },
        function (err, resp, body) {
          if (err) {
            return _parseAndGoToNextCallback(err);
          }

          cacheClient.set(key, body);
          cacheClient.expire(key, shortCacheExpiryTime);

          return _parseAndGoToNextCallback(err, body);
      });
    }, _parseAndGoToNextCallback);
  };

  _init(mockCacheClient, mockOauth2, mockRequest);
};

module.exports = {
  "TwitterService": TwitterService
};
