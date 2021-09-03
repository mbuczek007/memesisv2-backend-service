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
        type: Sequelize.STRING(255),
      },
      source_info: {
        type: Sequelize.STRING(1000),
      },
      source_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
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
      is_private: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_archived: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      timestamps: true,
    }
  );

  return Entry;
};
