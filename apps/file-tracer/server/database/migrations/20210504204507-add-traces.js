'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Adding traceId to Assets and Files
     */
     return queryInterface.addColumn(
       'Assets',
       'TraceId',
       {
         type: Sequelize.INTEGER,
         allowNull: true,
         references: {
           model: 'Traces',
           key: 'id'
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL'
       }
     ).then(() => {
       return queryInterface.addColumn(
         'Files',
         'TraceId',
         {
           type: Sequelize.INTEGER,
           allowNull: true,
           references: {
             model: 'Traces',
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
     * Remove traceId from Assets and Files
     */
     return queryInterface.removeColumn(
       'Assets',
       'TraceId'
     ).then(() => {
       return queryInterface.removeColumn(
         'Files',
         'TraceId'
       );
     });
  }
};
