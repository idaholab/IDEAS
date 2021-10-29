'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ElementTrace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };

  ElementTrace.init({
    assetId: DataTypes.INTEGER,
    fileElementId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ElementTrace',
  });

  ElementTrace.associate = models => {
    ElementTrace.hasOne(models.Asset);
    ElementTrace.hasOne(models.FileElement);
  };

  return ElementTrace;
};
