var services = require('./services');

module.exports = {
    'index': function (req, res) {
        res.render("index");
    },
    'getPartial': function (req, res) {
        var templateName = req.params.templateName;
        res.render("partial/" + templateName, {}, function (err, html) {
            if (err) {
                res.send("Nothing found!", 404);
            } else {
                res.end(html);
            }
        });
    },
   'twitterSearchTweets': function (req, res) {
      var queryString = req.query.q || '#thingsiwouldneverdo';

      var twitter = new services.TwitterService();
      twitter.searchTweets(queryString, function (err, statuses) {
        if (err) {
          res.json(err);
        } else {
          res.json(statuses);
        }
      });
    }
};
