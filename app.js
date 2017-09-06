var express = require('express');
var path = require('path');

var app = express();

app.use(function(request, reponse, next){
  console.log(`${request.method} request for ${request.url}`);
  next();
});

app.use(express.static("./public"));

app.use('/packages', express.static(path.join(__dirname, 'node_modules/')));
app.use('/config', express.static(path.join(__dirname, '/')));

app.listen(3000);

console.log("Server running on port 3000");
