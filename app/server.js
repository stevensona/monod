var express = require('express');
var path = require('path');
var compression = require('compression');

var app = express();

var static_path = path.join(__dirname, '/../build');

app.set('port', process.env.PORT || 3000);

app.use(compression());
app.use(express.static(static_path, { maxAge: '1y' }));

// Match UUIDs
app.get('/[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}', function (req, res) {
  res.sendFile('index.html', {
    root: static_path
  });
});

app.listen(app.get('port'), function () {
  console.log('Running at localhost:' + app.get('port'));
});
