'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        tableName: 'oauth2_clients',
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
        client_secret: {
          allowNull: false,
          type: Sequelize.DataTypes.TEXT
        },
        grants: {
          allowNull: false,
          type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.TEXT)
        },
        scope: {
          allowNull: false,
          type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.TEXT)
        },
        redirect_uris: {
          allowNull: false,
          type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.TEXT)
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
      tableName: 'oauth2_clients',
      schema: 'app'
    });
  }
};
