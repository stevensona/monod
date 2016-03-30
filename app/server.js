var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

var app = express();
var api = express.Router();

// config
var static_path = path.join(__dirname, '/../build');
var data_dir    = process.env.MONOD_DATA_DIR || path.join(__dirname, '/../data');

app.set('port', process.env.PORT || 3000);

// middlewares
app.use(compression());
app.use(express.static(static_path));
app.use(bodyParser.json());
app.use(api);

const isValidId = (uuid) => {
  return /[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/.test(uuid);
};

// Match UUIDs
app.get('/[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}', (req, res) => {
  res.sendFile('index.html', {
    root: static_path
  });
});

// API
api.get('/documents/:uuid', (req, res) => {
  var uuid = req.params.uuid;

  // request validation
  if (!isValidId(uuid)) {
    return res.status(400).json();
  }

  fs.readFile(path.join(data_dir, uuid), (err, data) => {
    if (err) {
      console.log(err);
      return res.status(404).json();
    }

    return res.json(JSON.parse(data));
  });
});

api.put('/documents/:uuid', (req, res) => {
  const uuid = req.params.uuid;

  // request validation
  if (!isValidId(uuid) || !req.body.content) {
    return res.status(400).json();
  }

  const filename = path.join(data_dir, uuid);

  fs.readFile(filename, (err, data) => {
    const isNew = err ? true : false;
    const document = isNew ? { version: 0 } : JSON.parse(data);

    document.uuid          = uuid;
    document.content       = req.body.content;
    document.last_modified = new Date();
    document.version       = document.version + 1;

    fs.writeFile(filename, JSON.stringify(document), (err) => {
      if (err) {
        return res.status(500).json();
      }

      return res.status(isNew ? 201 : 200).json(document);
    });
  });
});

// Listen only when doing: `node app/server.js`
if (require.main === module) {
  app.listen(app.get('port'), () => {
    console.log('Running at localhost:' + app.get('port'));
  });
}

module.exports = app;
