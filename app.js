var express = require('express');
var https   = require('https');
var path    = require('path');
var fs      = require('fs');
var config  = require('./config');
var routes  = require('./routes');
var user    = require('./routes/user');
var message = require('./routes/message');
var db      = require('./models');

console.info('***** Starting Up');

var app = express();

var options = {
  key: fs.readFileSync(path.join(__dirname, config.ssl.key)),
  cert: fs.readFileSync(path.join(__dirname, config.ssl.cert))
}

// Configuration - All Environments
app.configure(function() {
  app.set('port', config.port);
  app.set('apiVersion', config.apiVersion);
  app.use(express.favicon());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// Configuration - Development Environment
app.configure('development', function() {
  console.info('**** RUNNING IN DEVELOPMENT MODE');
  app.enable('debug');
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});

// Configuration - Production Environment
app.configure('production', function() {
  console.info('**** RUNNING IN PRODUCTION MODE');
  app.disable('debug');
  app.use(express.logger());
});

// Check API Authentication
app.all('*', function(req, res, next) {
  routes.checkAuthentication(req, res, next, config.permissions.all);
});

// Routing Information
app.post('/users/register', user.register);
app.post('/users/login', user.login);
app.post('/users/logout', user.logout);
app.post('/users/search', user.search);

app.get('/messages', message.get);
app.post('/messages/send', message.send);

app.get('/api/version', function(req, res) {
  res.send({
    version: app.get('apiVersion')
  });
});

// DB Setup and Server Initialization
db.sequelize.sync(config.syncOptions).complete(function(err) {
  if (err) {
    throw err;
  } else {
    var server = https.createServer(options, app).listen(app.get('port'), function() {
      console.info('*** Server listening on port ' + app.get('port'));
    });
    
    process.on('SIGINT', function() {
      console.info('\b\b***** SIGINT Caught');
      server.close();
    });

    process.on('SIGTERM', function() {
      console.info('***** SIGTERM Caught');
      server.close();
    });

    server.on('close', function() {
      // TODO: Clear database of all tokens
      console.info('***** Shutdown Complete');
    });
  }
});

