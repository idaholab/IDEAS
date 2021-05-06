'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     Adding references to Asset and File in Trace
     **/
     return queryInterface.addColumn(
       'Traces',
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
         'Traces',
         'fileId',
         {
           type: Sequelize.INTEGER,
           references: {
             model: 'Files',
             key: 'id'
           },
           onUpdate: 'CASCADE',
           onDelete: 'SET NULL'
         }
       );
     });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     Removing references to Asset and File from Trace
     **/
     return queryInterface.removeColumn(
       'Traces',
       'assetId'
     ).then(() => {
       return queryInterface.removeColumn(
         'Traces',
         'fileId'
       );
     });
  }
};
