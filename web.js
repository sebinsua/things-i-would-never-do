var express = require("express");

var settings = require("./src/settings"),
    routes   = require("./src/routes");

var app = express();
app.configure(settings);
app.configure(routes);

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});
