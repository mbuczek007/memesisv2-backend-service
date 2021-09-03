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

db.user = require('./user.model.js')(sequelize, Sequelize);
db.userRole = require('./userRole.model.js')(sequelize, Sequelize);

db.userRole.belongsToMany(db.user, {
  through: 'user_roles',
  foreignKey: 'role_id',
  otherKey: 'user_id',
});

db.user.belongsToMany(db.userRole, {
  through: 'user_roles',
  foreignKey: 'user_id',
  otherKey: 'role_id',
});

db.user.hasMany(db.entry, {
  foreignKey: {
    name: 'user_id',
  },
});

db.user.hasMany(
  db.entryVote,
  {
    foreignKey: {
      name: 'user_id',
    },
  },
  { onDelete: 'CASCADE' }
);

db.entry.hasMany(
  db.entryVote,
  {
    foreignKey: {
      name: 'entry_id',
      allowNull: false,
    },
  },
  { onDelete: 'CASCADE' }
);

db.entry.hasMany(
  db.entryComment,
  {
    foreignKey: {
      name: 'entry_id',
      allowNull: false,
    },
  },
  { onDelete: 'CASCADE' }
);

db.user.hasMany(
  db.entryComment,
  {
    foreignKey: {
      name: 'user_id',
      allowNull: false,
    },
  },
  { onDelete: 'CASCADE' }
);

db.user.hasMany(db.commentVote, {
  foreignKey: {
    name: 'user_id',
  },
});

db.entryComment.hasMany(
  db.commentVote,
  {
    foreignKey: {
      name: 'entry_comment_id',
      allowNull: false,
    },
  },
  { onDelete: 'CASCADE' }
);

db.ROLES = ['user', 'admin', 'moderator'];

module.exports = db;
