var log = require('npmlog');
var db = require('../models');
var exceptions = require('./exceptions');

// Middleware Function to load User
// object for every request.
exports.loadUser = function(req, res, next) {
  db.User.find({ where: { email: req.body.email } }).success(function(user) {
    if (user) {
      req.user = user;
    }

    next();
  });
}

exports.responseUtils = function (req, res, next) {
  res.error = function(message) {
    if (message) {
      res.send({
        status: 'error',
        message: message
      });
    } else {
      throw new exceptions.IllegalArgumentException('invalid message');
    }
  }

  res.success = function(resObj) {
    if (!resObj) {
      resObj = {};
    }
    
    resObj.status = 'success';
    res.send(resObj);
  }

  next();
}

