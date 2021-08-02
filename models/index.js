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
db.sourceType = require('./sourceType.model.js')(sequelize, Sequelize);

db.sourceType.hasOne(db.entry, {
  foreignKey: {
    name: 'source_type_id',
    allowNull: false,
  },
});

module.exports = db;
