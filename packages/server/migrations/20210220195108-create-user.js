'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        tableName: 'users',
        schema: 'app'
      },
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        },
        account_id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true
        },
        hubspot_contact_id: {
          type: Sequelize.DataTypes.STRING,
          unique: true
        },
        first_name: {
          type: Sequelize.STRING
        },
        last_name: {
          type: Sequelize.STRING
        },
        roles: {
          type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
          default: ['basic']
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
          required: true
        },
        password: {
          type: Sequelize.DataTypes.STRING
        },
        is_activated: {
          type: Sequelize.DataTypes.BOOLEAN,
          default: false
        },
        activation_code: {
          type: Sequelize.DataTypes.STRING
        },
        activation_code_expiration_date: {
          type: Sequelize.DataTypes.DATE
        },
        profile_picture: {
          type: Sequelize.TEXT
        },
        invite_pending: {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false
        },
        last_active_at: {
          type: Sequelize.DATE
        },
        is_deactivated: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
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
      tableName: 'users',
      schema: 'app'
    });
  }
};
