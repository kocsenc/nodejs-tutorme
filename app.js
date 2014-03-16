var express = require('express');
var https   = require('https');
var path    = require('path');
var fs      = require('fs');
var config  = require('./config');
var routes  = require('./routes');
var user    = require('./routes/user');
var message = require('./routes/message');
var db      = require('./models');

var app = express();

var options = {
  key: fs.readFileSync(path.join(__dirname, config.ssl.key)),
  cert: fs.readFileSync(path.join(__dirname, config.ssl.cert))
}

// Configuration - All Environments
app.configure(function() {
  app.set('port', config.port);
  app.use(express.favicon());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// Configuration - Development Environment
app.configure('development', function() {
  console.log('***** RUNNING IN DEVELOPMENT MODE *****');
  app.enable('debug');
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});

// Configuration - Production Environment
app.configure('production', function() {
  console.log('***** RUNNING IN PRODUCTION MODE *****');
  app.disable('debug');
  app.use(express.logger());
});

// Check API Authentication
app.all('*', function(req, res, next) {
  routes.checkAuthentication(req, res, next);
});

// Routing Information
app.post('/users/register', user.register);
app.post('/users/login', user.login);
app.post('/users/logout', user.logout);
app.post('/users/search', user.search);

app.post('/messages/send', message.send);

// DB Setup and Server Initialization
db.sequelize.sync(config.syncOptions).complete(function(err) {
  if (err) {
    throw err;
  } else {
    https.createServer(options, app).listen(app.get('port'), function() {
      console.log('Express server listening on port ' + app.get('port'));
    });
  }
});

