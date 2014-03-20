var config = require('../config');
var log = require('npmlog');
var crypto = require('crypto');
var db = require('../models');

// API Authentication Check
exports.checkAuthentication = function(req, res, next, all) {
  log.info('[' + req.method + ']', req.url); 
  if (all.indexOf(req.path) != -1) {
    return next();
  } else {
    if (!req.param('email') || !req.param('token')) {
      res.send({
        status: 'error',
        message: 'invalid parameters'
      });
      
      return;
    } else {
      db.User.find({ where: { email: req.param('email') } }).success(function(user) {
        if (!user) {
          res.send({
            status: 'error',
            message: 'invalid parameters'
          });
        } else {
          if (req.param('token') == user.token) {
            // Add user instance to request to reduce
            // amount of lookups that are performed.
            req.user = user;
            return next();
          } else {
            res.send({
              status: 'error',
              message: 'token mismatch'
            });
          }
        }
      });
    }
  }
}

// GET /version
exports.version = function(req, res) {
  res.success({ version: config.apiVersion });
}

