module.exports = (sequelize, Sequelize) => {
  const UserRole = sequelize.define(
    'user_roles',
    {
      role_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return UserRole;
};
