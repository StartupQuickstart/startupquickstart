import { Sequelize, Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class SystemSetting extends Model {}

  SystemSetting.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      value: {
        type: Sequelize.TEXT,
        get() {
          const value = this.getDataValue('value');
          try {
            return JSON.parse(value);
          } catch (err) {
            return value;
          }
        },
        set(value) {
          this.setDataValue('value', JSON.stringify(value));
        }
      },
      type: {
        type: Sequelize.TEXT
      },
      created_by_id: {
        type: DataTypes.UUID
      },
      updated_by_id: {
        type: DataTypes.UUID
      }
    },
    {
      sequelize,
      modelName: 'SystemSetting',
      schema: 'app',
      tableName: 'system_settings',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return SystemSetting;
};
