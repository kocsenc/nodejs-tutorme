var express = require('express');
var path    = require('path');
var fs      = require('fs');
var config  = require('./config');
var routes  = require('./routes');
var user    = require('./routes/user');
var message = require('./routes/message');
var profile = require('./routes/profile');
var db      = require('./models');

console.info('***** Starting Up');

var app = express();

// Configuration - All Environments
app.configure(function() {
  app.set('port', config.port);
  app.set('apiVersion', config.apiVersion);
  app.use(express.favicon());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(injectMiddleware);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  
  if (config.ssl.enabled) {
    config.serverOptions = {
      key: fs.readFileSync(path.join(__dirname, config.ssl.key)),
      cert: fs.readFileSync(path.join(__dirname, config.ssl.cert))
    }
  }
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

function injectMiddleware(req, res, next) {
  res.error = function(message) {
    res.send({
      status: 'error',
      message: message
    });
  }

  res.success = function(resObj) {
    resObj.status = 'success';
    res.send(resObj);
  }

  next();
}

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

app.post('/profiles', profile.create);
app.get('/profiles/:id', profile.get);

app.get('/version', function(req, res) {
  res.send({
    status: 'success',
    version: app.get('apiVersion')
  });
});

// DB Setup and Server Initialization
db.sequelize.sync(config.syncOptions).complete(function(err) {
  if (err) {
    throw err;
  } else {
    if (config.ssl.enabled) {
      var server = require('https').createServer(config.serverOptions, app).listen(app.get('port'), function() {
        console.info('*** Server listening on port ' + app.get('port') + ' (SSL)');
      });
    } else {
      var server = require('http').createServer(app).listen(app.get('port'), function() {
        console.info('*** Server listening on port ' + app.get('port'));
      });
    }
    
    process.on('SIGINT', function() {
      console.info('\b\b***** SIGINT Caught');
      server.close();
    });

    process.on('SIGTERM', function() {
      console.info('***** SIGTERM Caught');
      server.close();
    });

    server.on('close', function() {
      console.info('*** Clearing user tokens');
      user.clearUserTokens(function() {
        console.info('***** Shutdown Complete');
      });
    });
  }
});

