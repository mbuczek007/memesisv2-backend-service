module.exports = (sequelize, Sequelize) => {
  const Entry = sequelize.define(
    'entries',
    {
      entry_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      source: {
        type: Sequelize.STRING(1000),
      },
      source_info: {
        type: Sequelize.STRING(1000),
      },
      nick_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      disable_comments: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_accepted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_blocked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      accepted_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_ip_address: {
        type: Sequelize.STRING(45),
      },
      updated_ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  return Entry;
};
