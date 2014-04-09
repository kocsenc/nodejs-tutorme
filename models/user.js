// User Model
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    type:     { type: DataTypes.INTEGER, allowNull: false },
    name:     { type: DataTypes.STRING, allowNull: false },
    email:    { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    salt:     { type: DataTypes.STRING, allowNull: false },
    postal:   { type: DataTypes.STRING, allowNull: false },
    token:    { type: DataTypes.STRING, allowNull: true }
  }, {
    associate: function(models) {
      User.hasOne(models.Profile);
      User.hasMany(models.Message, { as: 'SentMessages', foreignKey: 'SenderId' });
      User.hasMany(models.Message, { as: 'ReceivedMessages', foreignKey: 'ReceiverId' });
    },
    getterMethods: {
      isTutor: function() {
        return this.type === 1;
      }
    },
    instanceMethods: {
      getSimple: function() {
        var obj = {};
        obj.type = this.type;
        obj.name = this.name;
        obj.email = this.email;
        obj.postal = this.postal;
        obj.profile = this.profile.getSimple();

        return obj;
      }
    }
  });

  return User;
}

