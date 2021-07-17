module.exports = {
  HOST: "memesisv2-mysql-02.co64urmxquba.eu-central-1.rds.amazonaws.com",
  USER: "mbuczek",
  PASSWORD: "2eZEKuma",
  DB: "memesisv2_mysql_02",
  PORT: 3306,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};