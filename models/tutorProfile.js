// TutorProfile Model
module.exports = function(sequelize, DataTypes) {
  var TutorProfile = sequelize.define('TutorProfile', {
    tagLine: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    associate: function(models) {
      TutorProfile.hasMany(models.ProfileItem);
    }
  });

  return TutorProfile;
}

