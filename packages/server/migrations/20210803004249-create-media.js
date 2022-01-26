'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        tableName: 'media',
        schema: 'app'
      },
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4
        },
        account_id: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false
        },
        name: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: false
        },
        type: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: false
        },
        path: {
          type: Sequelize.TEXT
        },
        created_by_id: {
          type: Sequelize.DataTypes.UUID
        },
        updated_by_id: {
          type: Sequelize.DataTypes.UUID
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }
    );
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable({
      tableName: 'media',
      schema: 'app'
    });
  }
};
