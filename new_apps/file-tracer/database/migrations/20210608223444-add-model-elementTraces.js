'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Adding elementTraceId to Assets and FileElements
     */
     return queryInterface.addColumn(
       'Assets',
       'ElementTraceId',
       {
         type: Sequelize.INTEGER,
         allowNull: true,
         references: {
           model: 'ElementTraces',
           key: 'id'
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL'
       }
     ).then(() => {
       return queryInterface.addColumn(
         'FileElements',
         'ElementTraceId',
         {
           type: Sequelize.INTEGER,
           allowNull: true,
           references: {
             model: 'ElementTraces',
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
     * Remove elementTraceId from Assets and FileElements
     */
     return queryInterface.removeColumn(
       'Assets',
       'ElementTraceId'
     ).then(() => {
       return queryInterface.removeColumn(
         'FileElements',
         'ElementTraceId'
       );
     });
  }
};
