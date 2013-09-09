var express = require("express"),
    stylus = require("stylus"),
    nib = require("nib");

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

app.get('/twitter/search/tweets', function (req, res) {
    var queryString = req.query.q || '#thingsiwouldneverdo';

    var key = process.env.TWITTER_KEY;
    var secret  = process.env.TWITTER_SECRET;
    var oauth2 = new OAuth2(key, secret, 'https://api.twitter.com/', null, 'oauth2/token', null);
    oauth2.getOAuthAccessToken(
        '',
        { 'grant_type': 'client_credentials' },
        function (e, accessToken) {
            console.log('Bearer ' + accessToken);

            request.get("https://api.twitter.com/1.1/search/tweets.json?" + querystring.stringify({ q: queryString }),
                { headers: { Authorization: "Bearer " + accessToken } }, function (err, resp, body) {
                var statuses = JSON.parse(body).statuses;
                res.json(statuses);
            });
        }
    );
})

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});
