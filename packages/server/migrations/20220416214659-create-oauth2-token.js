'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        tableName: 'oauth2_tokens',
        schema: 'app'
      },
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4
        },
        user_id: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false
        },
        token: {
          allowNull: false,
          type: Sequelize.DataTypes.TEXT
        },
        token_type: {
          allowNull: false,
          type: Sequelize.DataTypes.TEXT
        },
        scope: {
          allowNull: false,
          type: Sequelize.DataTypes.TEXT
        },
        expires_at: {
          allowNull: false,
          type: Sequelize.DataTypes.DATE
        },
        client_id: {
          allowNull: false,
          type: Sequelize.DataTypes.TEXT
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
      tableName: 'oauth2_tokens',
      schema: 'app'
    });
  }
};
