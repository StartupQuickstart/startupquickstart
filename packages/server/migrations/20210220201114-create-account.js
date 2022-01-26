'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        tableName: 'accounts',
        schema: 'app'
      },
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        },
        hubspot_company_id: {
          type: Sequelize.DataTypes.STRING,
          unique: true
        },
        name: {
          type: Sequelize.STRING
        },
        image: {
          type: Sequelize.TEXT
        },
        website: {
          type: Sequelize.TEXT
        },
        is_setup: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        stripe_customer_id: {
          type: Sequelize.STRING,
          unique: true
        },
        created_by_id: {
          type: Sequelize.UUID
        },
        updated_by_id: {
          type: Sequelize.UUID
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
      tableName: 'accounts',
      schema: 'app'
    });
  }
};
