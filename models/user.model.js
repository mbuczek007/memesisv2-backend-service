module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'users',
    {
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          min: 3,
          max: 20,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          max: 40,
        },
      },
      sex: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      avatar: {
        type: Sequelize.STRING(255),
        validate: {
          max: 255,
        },
      },
      is_blocked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      account_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      last_login_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_ip_address: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      last_login_ip_address: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return User;
};
