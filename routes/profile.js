var crypto = require('crypto');
var db = require('../models');

exports.get = function(req, res) {
  if (req.param('id')) {
    db.User.find({ where: { id: req.param('id') } }).success(function(tutor) {
      if (tutor.type == 1) {
        tutor.getProfile().success(function(profile) {
          res.send({
            status: 'success',
            profile: profile
          });
        });
      } else {
        res.send({
          status: 'error',
          message: 'user is not a tutor'
        });
      }
    });
  } else {
    res.send({
      status: 'error',
      message: 'invalid parameters'
    });
  }
}

exports.update = function(req, res) {
  res.send({ status: 'not_implemented' });
}

exports.search = function(req, res) {
  res.send({ status: 'not_implemented' });
}

exports.vote = function(req, res) {
  db.User.find({ where: { id: req.param('id') } }).success(function(tutor) {
    if (tutor) {
      if (tutor.type == 1) {
        tutor.getProfile().success(function(profile) {
          profile.updateAttributes({ votes: profile.votes + 1 }).success(function() {
            res.send({
              status: 'success'
            });
          });
        });
      }
    } else {
      req.error('no such user');
    }
  });
}

