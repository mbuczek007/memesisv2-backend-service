module.exports = (sequelize, Sequelize) => {
  const CommentVote = sequelize.define(
    'comment_votes',
    {
      comment_vote_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      vote_up: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_ip_address: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return CommentVote;
};
