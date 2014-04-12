var log = require('npmlog');
var db = require('../models');
var exceptions = require('./exceptions');

// Middleware function to validate the presence
// of certain parameters.
exports.validParams = function(req, res, next) {
}

// Middleware function to load the user object for
// the currently authenticated user.
exports.loadUser = function(req, res, next) {
  db.User.find({ where: { email: req.body.email } }).success(function(user) {
    if (user) {
      req.user = user;
    }

    next();
  });
}

// Middleware function to load the user object for 
// every request with an email parameter present.
exports.loadTargetUser = function(req, res, next) {
  db.User.find({ where: { email: req.param('id') }, include: [ { model: db.Profile, include: [ { model: db.ProfileItem } ] } ] }).success(function(user) {
    if (user) {
      req.targetUser = user
      next();
    } else {
      res.status(404).error('no such user');
    }
  });
}

// Middleware function to add success and
// error functions to the response object.
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

