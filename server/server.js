'use strict';

var loopback = require('loopback');
var path = require('path');
var boot = require('loopback-boot');

var app = module.exports = loopback();

// find path to client folder containing the website
const clientPath = path.resolve(__dirname, '../client');

// if no hash, send to index
app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, '/', 'index.html'));
});

app.get(/^(.+)$/, (req, res) => {
  const scriptPath = req.params[0];
  res.sendFile(path.join(clientPath, '/', scriptPath));
});

app.start = function() {
  // start the web server

  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});