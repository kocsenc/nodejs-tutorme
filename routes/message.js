var db = require('../models');

exports.send = function(req, res) {
  var userId = req.param('userId');
  var contents = req.param('contents');
  if (!userId || !contents) {
    res.send({
      status: 'error',
      message: 'invalid parameters'
    });
  } else {
    db.User.find({ where: { id: req.param('userId') } }).success(function(toUser) {
      if (!toUser) {
        res.send({
          status: 'error',
          message: 'no such user'
        });
      } else {
        db.Message.create({
          contents: contents
        }).success(function(message) {
          req.user.addMessage(message);
          message.setReceiver(toUser);
          res.send({
            status: 'success'
          });
        });
      }
    });
  }
}

