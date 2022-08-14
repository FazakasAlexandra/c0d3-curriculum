const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

// servers javascript and css files
app.get('/*.(js|css)', function (request, response) {
  response.sendFile(path.resolve(__dirname, request.path.substring(1)));
});

// serves index.html for all other cases
app.get('/*', function (_request, response) {
  response.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port);
console.log("server started on port " + port);