var crypto = require('crypto');
var db = require('../models');

exports.create = function(req, res) {
  db.TutorProfile.create({
    tagLine: req.param('tagLine'),
    description: req.param('description')
  }).success(function(tutorProfile) {
    req.user.setTutorProfile(tutorProfile);
    res.send({
      status: 'success'
    });
  });
}

exports.get = function(req, res) {
  if (req.param('id')) {
    db.User.find({ where: { id: req.param('id') } }).success(function(tutor) {
      if (tutor.type == 1) {
        tutor.getTutorProfile().success(function(tutorProfile) {
          res.send({
            status: 'success',
            profile: tutorProfile
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

