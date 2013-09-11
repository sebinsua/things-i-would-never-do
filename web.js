var express = require("express"),
    stylus = require("stylus"),
    nib = require("nib");

var redis = require("redis"),
    redisUrl = require('url').parse(process.env.REDISCLOUD_URL);
var client = redis.createClient(redisUrl.port, redisUrl.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

var OAuth2 = require("oauth").OAuth2,
    request = require("request"),
    querystring = require("querystring");

var app = express();
app.use(express.logger());

app.engine('jade', require('jade').__express)
app.set("view engine", "jade");
app.set("views", __dirname + "/views");

app.use(stylus.middleware(
    {
        "src": __dirname + "/public/style/",
        "compile": function compile (str, path) {
            return stylus(str).set("filename", path).use(nib())
        }
    }
));
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.render("index");
});

app.get('/partial/:templateName.html', function (req, res) {
    var templateName = req.params.templateName;
    res.render("partial/" + templateName);
});

app.get('/twitter/search/tweets', function (req, res) {
    var queryString = req.query.q || '#thingsiwouldneverdo';

    async.parallel(
        [
            function (callback) {
                client.get('accessToken', function (err, accessToken) {
                    if (err) {
                        callback(err);
                    }

                    if (accessToken) {
                        callback(null, accessToken);
                    } else {
                        var key = process.env.TWITTER_KEY;
                        var secret  = process.env.TWITTER_SECRET;
                        var oauth2 = new OAuth2(key, secret, 'https://api.twitter.com/', null, 'oauth2/token', null);
                        oauth2.getOAuthAccessToken(
                            '',
                            { 'grant_type': 'client_credentials' },
                            function (e, accessToken) {
                                console.log('Bearer ' + accessToken);
                                client.set("accessToken", accessToken);
                                client.expire("accessToken", 60 * 5);
                                callback(null, accessToken);
                            }
                        );
                    }

                });
            },
            function (accessToken, callback) {
                request.get("https://api.twitter.com/1.1/search/tweets.json?" + querystring.stringify({ q: queryString }),
                            { headers: { Authorization: "Bearer " + accessToken } }, function (err, resp, body) {
                    if (err) {
                        callback(err);
                    }
                    var statuses = JSON.parse(body).statuses;
                    callback(null, statuses);
                });
            }
        ],
        function (err, statuses) {
            if (err) {
                res.json(err);
            } else {
                res.json(statuses);
            }
        }
    );
})

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});
