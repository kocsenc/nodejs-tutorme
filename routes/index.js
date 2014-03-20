var config = require('../config');
var log = require('npmlog');
var crypto = require('crypto');
var db = require('../models');

// API Authentication Check
exports.authenticate = function(req, res, next, all) {
  // Don't authenticate for white
  // listed routes.
  if (all.indexOf(req.path) === -1) {
    if (!req.body.email || !req.body.token) {
      res.error('invalid parameters');
    } else {
      if (req.user && req.body.token == req.user.token) {
          next();
      } else {
        res.status(401).error('token mismatch');
      }
    }
  } else {
    next();
  }
}

// Log the request
exports.requestLogging = function(req, res, next) {
  log.info('[' + req.method + ']', req.url);
  next();
}

// GET /version
exports.version = function(req, res) {
  res.success({ version: config.apiVersion });
}

