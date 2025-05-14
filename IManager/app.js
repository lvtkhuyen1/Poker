process.env.NODE_ENV =
  process.env.NODE_ENV &&
  process.env.NODE_ENV.trim().toLowerCase() == "production"
    ? "production"
    : "development";
process.env.TZ = "Asia/Seoul";
const express = require("express");
const layout = require("express-ejs-layouts");
const app = express();
const http = require("http").Server(app);
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const passportconfig = require("./passport-config");

//const server = require('http').Server(app);
const io = require("socket.io")(http, {});

// app.set('layout', 'layout');
// app.set('layout extractScripts', true);

app.use(
  session({
    secret: "123123",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 4 * 60 * 60 * 1000 },
    passport: {},
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passportconfig();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(layout);
app.set("layout", "common/layout");
app.set("layout extractScripts", true);

app.use("/account", require("./routes/account"));
app.use("/agent", require("./routes/agent"));

app.use("/inout", require("./routes/inout"));
app.use("/game", require("./routes/game"));
app.use("/rank", require("./routes/rank"));
app.use("/user", require("./routes/user"));
app.use("/announcement", require("./routes/announcement"));
app.use("/etc", require("./routes/etc"));

const ITime = require("./utils/time");
const db = require("./db");
db.sequelize.sync();

if (process.env.NODE_ENV == "production") {
  global.strLobbyAddress = "https://nodajipoker00.com";
  global.strHoldemAddress = "https://nodajiholdem00.org";
  global.strSitgoAddress = "https://mcholdemgame.com";
} else if (process.env.NODE_ENV == "development") {
  global.strLobbyAddress = "http://localhost:6999";
  global.strHoldemAddress = "http://localhost:5555";
  global.strSitgoAddress = "http://localhost:5556";
}

app.get("/", (req, res) => {
  if (req.user == undefined) {
    res.redirect("/account/login");
  } else {
    res.render("index", { type: 0, user: req.user });
  }
});

const cPort = 3000;
http.listen(cPort, () => {
  console.log(`YGPoker CMS Started At ${cPort}`);
});

let socket_list = {};

global.socket_list = socket_list;

app.post("/alert", async (req, res) => {
  console.log("alert");
  console.log(req.body);

  for (let i in socket_list) {
    socket_list[i].emit("SM_Alert", req.body);
  }
});

io.on("connection", (socket) => {
  console.log(
    `# ---------------------------------- Socket Connection : ${socket.id}`
  );

  console.log(`socket.strID : ${socket.strID}`);
  socket_list[socket.id] = socket;

  if (socket.strID == undefined) {
    socket.emit("SM_RequestLogin");
  }

  socket.on("disconnect", () => {
    console.log(
      `#$ ---------------------------------- Socket Disconnection : ${socket.id}, ${socket.strID}, ${socket.eStage}, ${socket.lUnique}`
    );

    //this.RemoveUser(socket);

    delete socket_list[socket.id];
  });

  socket.on("CM_Login", (objectData) => {
    console.log("CM_Login");
    console.log(objectData);

    socket.strID = objectData.strID;
    socket.strGroupID = objectData.strGroupID;
  });
});
