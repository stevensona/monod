if ('production' === process.env.NODE_ENV || 'test' === process.env.NODE_ENV) {
  const express = require('express');
  const compression = require('compression');
  const bodyParser = require('body-parser');
  const path = require('path');
  const fs = require('fs');

  const app = express();
  const api = express.Router();

  // config
  const staticPath = path.join(__dirname, '/build');
  const dataDir = process.env.MONOD_DATA_DIR || path.join(__dirname, '/data');

  app.set('port', process.env.PORT || 3000);
  app.set('etag', false);

  // middlewares
  app.use(compression());
  app.use(express.static(staticPath));
  app.use(bodyParser.json());
  app.use(api);

  const isValidId = (uuid) => {
    return /[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/.test(uuid);
  };

  // Match UUIDs
  app.get('/[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}', (req, res) => {
    res.sendFile('index.html', {
      root: staticPath
    });
  });

  // API
  api.get('/documents/:uuid', (req, res) => {
    const uuid = req.params.uuid;

    // request validation
    if (!isValidId(uuid)) {
      return res.status(400).json();
    }

    return fs.readFile(path.join(dataDir, uuid), (err, data) => {
      if (err) {
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

    const filename = path.join(dataDir, uuid);

    return fs.readFile(filename, (readErr, data) => {
      const document = readErr ? {} : JSON.parse(data);

      if (!!document.readonly) {
        delete(document.readonly);

        return res.status(403).json(document);
      }

      document.uuid = uuid;
      document.content = req.body.content;
      document.last_modified = Date.now();
      document.template = req.body.template || '';

      fs.writeFile(filename, JSON.stringify(document), (err) => {
        if (err) {
          return res.status(500).json();
        }

        return res.status(readErr ? 201 : 200).json(document);
      });
    });
  });

  // Listen only when doing: `node app/server.js`
  if (require.main === module) {
    app.listen(app.get('port'), () => {
      console.log(`API backend running at http://localhost:${app.get('port')}`);
    });
  }

  module.exports = app;
} else {
  const port = 4000;
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const config = require('./webpack.config');

  new WebpackDevServer(webpack(config), {
    hot: true,
    historyApiFallback: true,
    publicPath: '/',
    proxy: {
      '/documents/*': {
        target: 'http://localhost:3000',
      }
    }
  }).listen(port, 'localhost', function (err) {
    if (err) {
      return console.log(err);
    }

    console.log(`Development server running at http://localhost:${port}`);
  });
}
