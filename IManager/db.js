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

// const RecordBets = require('./models/bet')(sequelize, Sequelize);
// db.RecordBets = RecordBets;

const Inouts = require("./models/inout")(sequelize, Sequelize);
db.Inouts = Inouts;

const Fees = require("./models/fee")(sequelize, Sequelize);
db.Fees = Fees;

const Jackpots = require("./models/jackpot")(sequelize, Sequelize);
db.Jackpots = Jackpots;

const Results = require("./models/result")(sequelize, Sequelize);
db.Results = Results;

const Announcements = require("./models/announcement")(sequelize, Sequelize);
db.Announcements = Announcements;

const Letters = require("./models/letter")(sequelize, Sequelize);
db.Letters = Letters;

const FeeRanges = require("./models/feerange")(sequelize, Sequelize);
db.FeeRanges = FeeRanges;

const Settings = require("./models/setting")(sequelize, Sequelize);
db.Settings = Settings;

const Rollings = require("./models/rollingrecord")(sequelize, Sequelize);
db.Rollings = Rollings;

const Banks = require("./models/bankcode")(sequelize, Sequelize);
db.Banks = Banks;

module.exports = db;
