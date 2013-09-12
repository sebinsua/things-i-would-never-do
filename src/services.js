/* jslint node: true */
'use strict';

var config = require('./config');

var async = require('async'),
    redis = require("redis"),
    url = require('url');

var OAuth2 = require("oauth").OAuth2,
    request = require("request"),
    querystring = require("querystring");




var TwitterService = function (stubCacheClient) {
  var baseUrl = "https://api.twitter.com/1.1";
  
  var cacheClient = null;
  var shortCacheExpiryTime = 15;
  var longCacheExpiryTime = 60;

  this.searchTweets = function (queryString, renderResponseCallback) {
    var url = baseUrl + "/search/tweets.json?" + querystring.stringify({ q: queryString, count: 10 });

    async.waterfall([
      _getAccessToken,
      function (accessToken, callback) {
        _makeRequestWithAccessToken(url, accessToken, callback);
      }, function (data, callback) {
        var statuses = data.statuses;
        callback(null, statuses);
      }
    ], renderResponseCallback);
  };

  var _init = function (stubCacheClient) {
    if (stubCacheClient) {
      cacheClient = stubCacheClient.object;
      return true;
    }

    var redisUrl = url.parse(config.REDISCLOUD_URL);
    var redisAuth = redisUrl.auth ? redisUrl.auth.split(":")[1] : '';

    cacheClient = redis.createClient(redisUrl.port, redisUrl.hostname, { no_ready_check: true });
    cacheClient.on("error", function (err) {
      console.log("ERROR: " + err);
    });
    cacheClient.auth(redisAuth);
  };

  this.revealPrivates = function () {
    this._getCacheClient = _getCacheClient;
    this._checkCacheOrMakeRequest = _checkCacheOrMakeRequest;
    this._getAccessToken = _getAccessToken;
    this._makeRequestWithAccessToken = _makeRequestWithAccessToken;
  }

  var _getCacheClient = function () {
    return cacheClient;
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

      var oauth2 = new OAuth2(config.TWITTER_KEY, config.TWITTER_SECRET, 'https://api.twitter.com/', null, 'oauth2/token', null);
      oauth2.getOAuthAccessToken(
        '',
        { 'grant_type': 'client_credentials' },
        function (e, accessToken) {
          console.log('Bearer ' + accessToken);
          cacheClient.set("accessToken", accessToken);
          cacheClient.expire("accessToken", longCacheExpiryTime * 10);
          callback(null, accessToken);
        }
      );

    }, callback);
  };

  var _makeRequestWithAccessToken = function (url, accessToken, callback) {
    var _parseAndGoToNextCallback = function (err, reply) {
      if (err) {
        callback(err);
      }
      var data = JSON.parse(reply);
      callback(null, data);
    };

    var key = "tweetsForUrl-" + url;
    _checkCacheOrMakeRequest(key, function () {
      request.get(url, { headers: { Authorization: "Bearer " + accessToken } },
        function (err, resp, body) {
          cacheClient.set(key, body);
          cacheClient.expire(key, shortCacheExpiryTime);
          _parseAndGoToNextCallback(err, body);
      });
    }, _parseAndGoToNextCallback);
  };

  _init(stubCacheClient);
};

module.exports = {
  "TwitterService": TwitterService
};
