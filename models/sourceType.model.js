module.exports = (sequelize, Sequelize) => {
  const SourceType = sequelize.define(
    'source_types',
    {
      source_type_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      key: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return SourceType;
};
