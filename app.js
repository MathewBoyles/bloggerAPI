var serverPort = 8080;
var token;
var readline = require("readline");
var express = require("express");
var app = express();
var path = require("path");
var fs = require("fs");
var google = require("googleapis");
var blogger = google.blogger("v3");
var OAuth2 = google.auth.OAuth2;
var plus = google.plus("v1");
var config = JSON.parse(fs.readFileSync("config.json", "utf8"));
var rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

var oauth2Client = new OAuth2(
	config.clientID,
	config.clientSecret,
	`http://localhost:${serverPort}/token`
);

var accessTokens = {};
var authTokens = {};

app.use(function(request, reponse, next) {
    console.log(`${request.method} request for ${request.url}`);
    next();
});

app.use(express.static("./public"));

app.use("/packages", express.static(path.join(__dirname, "node_modules/")));
app.use("/config.json", function(req, res, next) {
   var configData = config;
    delete configData["clientSecret"];
    res.json(configData);
    next();
});

app.use("/auth", function(req, res, next) {
	var url = oauth2Client.generateAuthUrl({
	  access_type: "online",
	  scope: "https://www.googleapis.com/auth/blogger"
	});

	res.redirect(url);

    next();
});

app.use("/token", function(req, res, next) {
	var setToken = "error";

	console.log(req.query.code);
	oauth2Client.getToken(req.query.code, function (err, tokens) {
		var setToken = "error";
		if (!err) {
			setToken = tokens.access_token;
		}

		accessTokens[req.query.code] = setToken;
		authTokens[setToken] = tokens;
	});

	res.redirect(`/?code=${req.query.code}`);

    next();
});

app.use("/gettoken", function(req, res, next) {
	if(!req.query.code) res.send("error");
	else if(typeof accessTokens[req.query.code] === "undefined") res.send("error");
	else res.send(accessTokens[req.query.code]);

	console.log(req.query.code);
	console.log(accessTokens[req.query.code]);
	console.log(accessTokens);

    next();
});

app.use("/post", function(req, res, next) {
	res.json(req.query);

	var auth = oauth2Client;
    auth.setCredentials(authTokens[req.query.token]);

	blogger.posts.insert({
		blogId: config.blogID,
		resource: {
			title: req.query.title,
			content: req.query.content
		},
		auth: auth
	}, function(err, data){
		console.log(err, data);
	})
});

app.listen(serverPort, function() {
    console.log(`Server running on port ${serverPort}`);
});