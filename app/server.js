var express = require('express');
var path    = require('path');
var app     = express();

var static_path = path.join(__dirname, '/../build');

app.set('port', process.env.PORT || 3000);
app.use(express.static(static_path));

app.get('/', function (req, res) {
  res.sendFile('index.html', {
    root: static_path
  });
});

app.listen(app.get('port'), function () {
  console.log('Running at localhost:' + app.get('port'));
});
