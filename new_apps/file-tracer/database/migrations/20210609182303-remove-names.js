'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

     return queryInterface.removeColumn(
       'Files',
       'name'
     ).then(() => {
       return queryInterface.removeColumn(
         'Assets',
         'name'
       ).then(() => {
         return queryInterface.removeColumn(
           'Traces',
           'name'
         ).then(() => {
           return queryInterface.removeColumn(
             'ElementTraces',
             'name'
           )
         })
       });
     });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return queryInterface.addColumn(
       'Files',
       'name',
       {
         type: Sequelize.STRING,
         allowNull: true,
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL'
       }
     ).then(() => {
       return queryInterface.addColumn(
         'Assets',
         'name',
         {
           type: Sequelize.STRING,
           allowNull: true,
           onUpdate: 'CASCADE',
           onDelete: 'SET NULL'
         }
       ).then(() => {
         return queryInterface.addColumn(
           'Traces',
           'name',
           {
             type: Sequelize.STRING,
             allowNull: true,
             onUpdate: 'CASCADE',
             onDelete: 'SET NULL'
           }
         ).then(() => {
           return queryInterface.addColumn(
             'ElementTraces',
             'name',
             {
               type: Sequelize.STRING,
               allowNull: true,
               onUpdate: 'CASCADE',
               onDelete: 'SET NULL'
             }
           );
         });
       });
     });
  }
};
