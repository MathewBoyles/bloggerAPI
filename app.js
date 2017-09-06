var serverPort = 8080;

var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();

app.use(function(request, reponse, next) {
    console.log(`${request.method} request for ${request.url}`);
    next();
});

app.use(express.static("./public"));

app.use("/packages", express.static(path.join(__dirname, "node_modules/")));
app.use("/config.json", function(req, res, next) {
    var configData = JSON.parse(fs.readFileSync("config.json", "utf8"));
    delete configData["clientSecret"];
    res.json(configData);
    next();
});

app.listen(serverPort, function() {
    console.log(`Server running on port ${serverPort}`);
});
