var async = require('async'),
    redis = require("redis"),
    redisUrl = require('url').parse(process.env.REDISCLOUD_URL);
var client = redis.createClient(redisUrl.port, redisUrl.hostname, { no_ready_check: true });
client.auth(redisUrl.auth.split(":")[1]);

var OAuth2 = require("oauth").OAuth2,
    request = require("request"),
    querystring = require("querystring");




var TwitterService = function () {
  var baseUrl = "https://api.twitter.com/1.1";
  var cacheExpiryTime = 60; // 60 seconds...

  var _checkCacheOrMakeRequest = function (key, orMakeRequest, callback) {
    client.get(key, function (err, reply) {
      if (err) {
        callback(err);
      }

      if (reply) {
        callback(null, reply);
      } else {
        orMakeRequest(callback);
      }
    });
  };

  var _getAccessToken = function (callback) {
    // If we can't fetch the accessToken from Redis, then get it from Twitter's OAuth2 service.
    _checkCacheOrMakeRequest("accessToken", function (callback) {
      var key = process.env.TWITTER_KEY;
      var secret  = process.env.TWITTER_SECRET;
      var oauth2 = new OAuth2(key, secret, 'https://api.twitter.com/', null, 'oauth2/token', null);
      oauth2.getOAuthAccessToken(
        '',
        { 'grant_type': 'client_credentials' },
        function (e, accessToken) {
          console.log('Bearer ' + accessToken);
          client.set("accessToken", accessToken);
          client.expire("accessToken", cacheExpiryTime * 10);
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
          client.set(key, body);
          client.expire(key, cacheExpiryTime);
          _parseAndGoToNextCallback(err, body);
      });
    }, _parseAndGoToNextCallback);
  };

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

};

module.exports = {
  "TwitterService": TwitterService
};