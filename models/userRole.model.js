module.exports = (sequelize, Sequelize) => {
  const UserRole = sequelize.define(
    'roles',
    {
      role_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          max: 50,
        },
      },
    },
    {
      timestamps: false,
    }
  );

  return UserRole;
};
