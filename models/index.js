const dbConfig = require('../config/db.config.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.entry = require('./entry.model.js')(sequelize, Sequelize);
db.entryVote = require('./entryVote.model.js')(sequelize, Sequelize);
db.entryComment = require('./entryComment.model.js')(sequelize, Sequelize);
db.commentVote = require('./commentVote.model.js')(sequelize, Sequelize);

db.entry.hasOne(
  db.entryVote,
  {
    foreignKey: {
      name: 'entry_id',
      allowNull: false,
    },
  },
  { onDelete: 'CASCADE' }
);

db.entry.hasOne(
  db.entryComment,
  {
    foreignKey: {
      name: 'entry_id',
      allowNull: false,
    },
  },
  { onDelete: 'CASCADE' }
);

db.entryComment.hasOne(
  db.commentVote,
  {
    foreignKey: {
      name: 'entry_comment_id',
      allowNull: false,
    },
  },
  { onDelete: 'CASCADE' }
);

module.exports = db;
