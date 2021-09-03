module.exports = (sequelize, Sequelize) => {
  const EntryComment = sequelize.define(
    'entry_comments',
    {
      entry_comment_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      parent_comment_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      comment: {
        type: Sequelize.STRING(6000),
        allowNull: false,
      },
      is_blocked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      has_warning: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_ip_address: {
        type: Sequelize.STRING(45),
      },
    },
    {
      timestamps: true,
    }
  );

  return EntryComment;
};
