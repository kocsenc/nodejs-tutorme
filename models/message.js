// Message Model
module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    contents: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    associate: function(models) {
      Message.belongsTo(models.User, { as: 'Receiver', foreignKey: 'ReceiverId' });
    }
  });

  return Message;
}

