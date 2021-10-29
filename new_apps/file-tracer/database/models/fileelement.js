'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FileElement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FileElement.belongsToMany(models.Asset, {
        through: 'ElementTraces',
        foreignKey: 'fileElementId',
        constraints: false
      })
    }
  };
  FileElement.init({
    fileDeepLynxID: DataTypes.STRING,
    elementIndex: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FileElement',
  });
  return FileElement;
};
