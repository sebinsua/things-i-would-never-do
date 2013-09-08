var express = require("express"),
    stylus = require("stylus"),
    nib = require("nib");

var OAuth2 = require("OAuth").OAuth2,
    request = require("request"),
    querystring = require("querystring");

var app = express();
app.use(express.logger());
app.use(express.static(__dirname + "/public"));
app.use(stylus.middleware(
    {
        "src": __dirname + "/public/style",
        "compile": function compile(str, path) {
            return stylus(str).set("filename", path).use(nib())
        }
    }
));
app.engine('jade', require('jade').__express)
app.set("view engine", "jade");
app.set("views", __dirname + "/views");

app.get("/", function (req, res) {
    // res.send("Hello World");
    res.render("index");
});

app.get('/twitter/search/tweets', function (req, res) {
    var queryString = req.query.q || '#thingsiwouldneverdo';

    // @todo: https://devcenter.heroku.com/articles/config-vars
    // http://stackoverflow.com/questions/4870328/how-to-read-environment-variable-in-node-js
    var key = '490JGQJGcD15z4cfyqgGGg';
    var secret  = 'AV1VabuE9o0puFXBWAJf89MZrVpEGgd3EDtmR4zU';
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
