var crypto = require('crypto');
var db = require('../models');

exports.create = function(req, res) {
  db.Profile.create({
    tagLine: req.param('tagLine'),
    description: req.param('description')
  }).success(function(profile) {
    req.user.setProfile(profile);
    res.send({
      status: 'success'
    });
  });
}

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
}

