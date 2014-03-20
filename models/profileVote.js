// ProfileVote Model
module.exports = function(sequelize, DataTypes) {
  var ProfileVote = sequelize.define('ProfileVote', {
  }, {
    timestamps: false,
    associate: function(models) {
      ProfileVote.belongsTo(models.User);
    }
  });

  return ProfileVote;
}

