var db = require('../models');

exports.send = function(req, res) {
  var userId = req.body.userId;
  var contents = req.body.contents;
  if (!userId || !contents) {
    res.send({
      status: 'error',
      message: 'invalid parameters'
    });
  } else {
    db.User.find({ where: { id: req.body.userId } }).success(function(toUser) {
      if (!toUser) {
        res.send({
          status: 'error',
          message: 'no such user'
        });
      } else {
        db.Message.create({
          contents: contents
        }).success(function(message) {
          req.user.addSentMessage(message);
          toUser.addReceivedMessage(message);
          res.send({
            status: 'success'
          });
        });
      }
    });
  }
}

exports.get = function(req, res) {
  // this kind of code is when you know you did it correctly ;)
  req.user.getReceivedMessages().success(function(messages) {
    res.send({
      status: 'success',
      messages: messages
    });
  });
}

