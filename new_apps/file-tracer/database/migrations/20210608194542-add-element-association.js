'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     return queryInterface.addColumn(
       'ElementTraces',
       'assetId',
       {
         type: Sequelize.INTEGER,
         references: {
           model: 'Assets',
           key: 'id'
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL'
       }
     ).then(() => {
       return queryInterface.addColumn(
         'ElementTraces',
         'fileElementId',
         {
           type: Sequelize.INTEGER,
           references: {
             model: 'FileElements',
             key: 'id'
           },
           onUpdate: 'CASCADE',
           onDelete: 'SET NULL'
         }
       );
     });
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.removeColumn(
       'ElementTraces',
       'assetId'
     ).then(() => {
       return queryInterface.removeColumn(
         'ElementTraces',
         'fileElementId'
       );
     });
  }
};
