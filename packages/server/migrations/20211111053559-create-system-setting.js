module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        tableName: 'system_settings',
        schema: 'app'
      },
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        },
        name: {
          type: Sequelize.TEXT
        },
        value: {
          type: Sequelize.TEXT
        },
        type: {
          type: Sequelize.TEXT
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
      tableName: 'system_settings',
      schema: 'app'
    });
  }
};
