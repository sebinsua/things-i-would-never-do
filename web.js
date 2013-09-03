var express = require("express"),
    stylus = require("stylus"),
    nib = require("nib");

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

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});
