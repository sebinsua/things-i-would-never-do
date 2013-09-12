/* jslint node: true */
'use strict';

var services = require('./services');
var twitter = new services.TwitterService();

module.exports = {
    'index': function (req, res) {
        res.render("index");
    },
    'getPartial': function (req, res) {
        var templateName = req.params.templateName;
        res.render("partial/" + templateName, {}, function (err, html) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end("Nothing found here!");
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(html);
            }
        });
    },
   'twitterSearchTweets': function (req, res) {
      var queryString = req.query.q || '#thingsiwouldneverdo';
      twitter.searchTweets(queryString, function (err, statuses) {
        if (err) {
          res.json(err);
        } else {
          res.json(statuses);
        }
      });
    }
};
