'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return queryInterface.changeColumn(
       'Assets',
       'TraceId',
       {
         type: Sequelize.INTEGER,
         allowNull: true,
         constraints: false,
         references: {
           model: 'Traces',
           key: 'id'
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL'
       }
     ).then(() => {
       return queryInterface.changeColumn(
         'Files',
         'TraceId',
         {
           type: Sequelize.INTEGER,
           allowNull: true,
           constraints: false,
           references: {
             model: 'Traces',
             key: 'id'
           },
           onUpdate: 'CASCADE',
           onDelete: 'SET NULL'
         }
       )
     });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return queryInterface.changeColumn(
       'Assets',
       'TraceId',
       {
         type: Sequelize.INTEGER,
         allowNull: true,
         constraints: true,
         references: {
           model: 'Traces',
           key: 'id'
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL'
       }
     ).then(() => {
       return queryInterface.changeColumn(
         'Files',
         'TraceId',
         {
           type: Sequelize.INTEGER,
           allowNull: true,
           constraints: true,
           references: {
             model: 'Traces',
             key: 'id'
           },
           onUpdate: 'CASCADE',
           onDelete: 'SET NULL'
         }
       )
     });
  }
};
