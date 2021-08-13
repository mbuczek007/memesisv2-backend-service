module.exports = (sequelize, Sequelize) => {
  const EntryVote = sequelize.define(
    'entry_votes',
    {
      entry_vote_id: {
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

  return EntryVote;
};
