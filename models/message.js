// Message Model
module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    read: {
      type: DataTypes.BOOLEAN
    },
    contents: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    associate: function(models) {
    }
  });

  return Message;
}

