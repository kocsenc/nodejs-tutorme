/**
 * Main server executable.
 * @title Application Executable
 * @overview Executable file that comprises the intiation of the server.
 * @copyright (c) 2014, Craig Cabrey
 * @license MIT
 * @author Craig Cabrey
 *
*/

var log = require('npmlog');
var express = require('express');
var path = require('path');
var fs = require('fs');
var middleware = require('./util/middleware');
var config = require('./config');
var routes = require('./routes');
var user = require('./routes/user');
var message = require('./routes/message');
var profile = require('./routes/profile');
var db = require('./models');

log.info('[\u2026]', 'Initializing application...');

var app = express();

// Configuration - All Environments
app.configure(function() {
  app.use(express.favicon());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(middleware.responseUtils);
  app.use(middleware.loadUser);
  
  app.use(app.router);
  
  if (config.ssl.enabled) {
    config.serverOptions = {
      key: fs.readFileSync(path.join(__dirname, config.ssl.key)),
      cert: fs.readFileSync(path.join(__dirname, config.ssl.cert))
    }
  }
});

// Configuration - Development Environment
app.configure('development', function() {
  log.info('[\u2026]', 'Development Mode (hard hats on)');
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});

// Configuration - Production Environment
app.configure('production', function() {
  log.info('[\u2026]', 'Production Mode');
});

// Check API Authentication
app.all('*', function(req, res, next) {
  routes.authenticate(req, res, next, config.permissions.all);
});

// Routing Information
app.post('/users/register', user.register);
app.post('/users/login', user.login);
app.post('/users/logout', user.logout);
app.post('/users/update', user.update);
app.delete('/users', user.delete);

app.get('/messages', message.get);
app.post('/messages/send', message.send);

app.get('/profiles/:id', profile.get);
app.post('/profiles/vote/:id', profile.vote);
app.post('/profiles/search', profile.search);

app.get('/version', routes.version);

// DB Setup and Server Initialization
db.sequelize.sync(config.syncOptions).complete(function(err) {
  if (err) {
    throw err;
  } else {
    if (config.ssl.enabled) {
      var server = require('https').createServer(config.serverOptions, app).listen(config.port, function() {
        log.info('[\u2713]', 'Listening on port: ' + config.port + ' (SSL)');
      });
    } else {
      var server = require('http').createServer(app).listen(config.port, function() {
        log.info('[\u2713]', 'Listening on port: ' + config.port);
      });
    }
    
    process.on('SIGINT', function() {
      process.stdout.write('\b\b'); // stupid hack to get rid of '^C' string
                                    // that some terminals print.
      log.info('[\u26A0]', 'Caught SIGINT!');
      server.close();
    });

    process.on('SIGTERM', function() {
      log.info('[\u26A0]', 'Caught SIGTERM!');
      server.close();
    });

    server.on('close', function() {
      log.info('[\u2026]', 'Cleaning up authentication tokens...');
      user.clearUserTokens(function() {
        log.info('[\u2713]', 'Cleanup complete!');
        log.info('[\u2639]', 'Bye!');
      });
    });
  }
});

