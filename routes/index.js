var config = require('../config');
var ziptastic = require('ziptastic');
var log = require('npmlog');
var crypto = require('crypto');
var db = require('../models');

config.whitelist = [];

config.environment[config.mode].permissions.all.forEach(function(pathRegex) {
  config.whitelist.push(new RegExp(pathRegex));
});

// API Authentication Check
exports.authenticate = function(req, res, next, all) {
  // Don't authenticate for white
  // listed routes.

  var matches = false;
  config.whitelist.forEach(function(regex) {
    if (regex.test(req.path)) {
      matches = true;
    }
  });

  if (matches) {
    next();
  } else {
    if (!req.body.email || !req.body.token) {
      res.error('invalid parameters');
    } else {
      if (req.user && req.body.token == req.user.token) {
        next();
      } else {
        res.status(401).error('token mismatch');
      }
    }
  }
}

// Log the request
exports.requestLogging = function(req, res, next) {
  log.info('[' + req.method + ']', req.url);
  next();
}

// GET /convert/zip
exports.convert = function(req, res) { 
  if (req.param('zipcode')) {
    ziptastic(req.param('zipcode')).then(function(location) {
      res.success({
        location: location
      });
    });
  } else {
    res.error('invalid parameters');
  }
}

// GET /version
exports.version = function(req, res) {
  res.success({ version: config.apiVersion });
}

