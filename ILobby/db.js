const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  host: "127.0.0.1",
  database: "ocgames",
  username: "root",
  password: "root",
  dialect: "mysql",
  port: 3306,
  // timezone:'Asia/Seoul'
});

sequelize
  .sync({ force: false }) // Synchronize models with the database
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

var db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

const Users = require("./models/user")(sequelize, Sequelize);
db.Users = Users;

const Inouts = require("./models/inout")(sequelize, Sequelize);
db.Inouts = Inouts;

const RecordBets = require("./models/bet")(sequelize, Sequelize);
db.RecordBets = RecordBets;

const Announcements = require("./models/announcement")(sequelize, Sequelize);
db.Announcements = Announcements;

const Letters = require("./models/letter")(sequelize, Sequelize);
db.Letters = Letters;

const Settings = require("./models/setting")(sequelize, Sequelize);
db.Settings = Settings;

module.exports = db;
