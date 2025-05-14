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

var db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize
  .sync({ force: false }) // Synchronize models with the database
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

const Users = require("./models/user")(sequelize, Sequelize);
db.Users = Users;
const RecordBets = require("./models/bet")(sequelize, Sequelize);
db.RecordBets = RecordBets;
const Fees = require("./models/fee")(sequelize, Sequelize);
db.Fees = Fees;
const ResultSitgos = require("./models/result")(sequelize, Sequelize);
db.ResultSitgos = ResultSitgos;
const Inouts = require("./models/inout")(sequelize, Sequelize);
db.Inouts = Inouts;
const Jackpots = require("./models/jackpot")(sequelize, Sequelize);
db.Jackpots = Jackpots;
const Rollings = require("./models/rolling")(sequelize, Sequelize);
db.Rollings = Rollings;

module.exports = db;
