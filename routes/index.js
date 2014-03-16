var crypto = require('crypto');
var db = require('../models');

// API Authentication Check
exports.checkAuthentication = function(req, res, next) {
  // TODO: Make set of whitelisted API calls in config.fs and check here
  if (req.path === '/users/login' || req.path === '/users/register') {
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

