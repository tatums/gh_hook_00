var express = require('express');
var app = express();
var bodyParser = require('body-parser');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', function (req, res) {
  console.log('req', req.body);
  res.json({'ok': 'true'});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
