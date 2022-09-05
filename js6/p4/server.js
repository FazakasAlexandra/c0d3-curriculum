const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
app.use(require('connect-livereload'));

const livereload = require('livereload');
const lrserver = livereload.createServer();
lrserver.watch(__dirname + "/src/");

// serves javascript and css files
app.get('/*.(js|css)', function (request, response) {
  response.sendFile(path.resolve(__dirname, request.path.substring(1)));
});

// serves index.html for all other cases
app.get('/*', function (_request, response) {
  response.sendFile(path.resolve(__dirname, 'src/index.html'));
});

app.listen(port);
console.log("server started on port " + port);
