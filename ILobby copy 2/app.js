process.env.NODE_ENV =
  process.env.NODE_ENV &&
  process.env.NODE_ENV.trim().toLowerCase() == "production"
    ? "production"
    : "development";
var createError = require("http-errors");
var express = require("express");
const layout = require("express-ejs-layouts");
const app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const server = require("http").Server(app);
const io = require("socket.io")(server, {});

const cors = require("cors");
//const layout = require('express-ejs-layouts');

const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const passportconfig = require("./passport");

const schedule = require("node-schedule");

const multer = require("multer");
const fs = require("fs");

// multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/pop/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "administrator#",
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

schedule.scheduleJob("0 0 0 * * *", async () => {
  //schedule.scheduleJob('* * * * * *', async()=> {

  let users = await db.Users.findAll();

  for (let i in users) {
    await db.Users.update(
      { iCashBase: users[i].iCash, iPointBase: users[i].iRolling },
      { where: { id: users[i].id } }
    );
  }
});

// db
const db = require("./db");
db.sequelize.sync();

app.use(layout);
app.set("layout", "common/layout");
app.set("layout extractScripts", true);

app.use("/account", require("./routes/account"));
app.use("/announcement", require("./routes/announcement"));
app.use("/subpage", require("./routes/subpage"));

if (process.env.NODE_ENV == "production") {
  //global.strGameAddress = 'https://ygpo888.net';
  global.strGameAddress = "https://nodajiholdem00.org";
  global.strBig2Address = "http://157.230.38.106:5556";
  global.strSitgoAddress = "https://mcholdemgame.com";
  global.strAddress = "http://157.230.38.106:3000";
} else if (process.env.NODE_ENV == "development") {
  global.strGameAddress = "http://192.168.1.10:5555";
  global.strBig2Address = "http://localhost:5556";
  global.strSitgoAddress = "http://localhost:5557";
  global.strAddress = "http://localhost:3000";
}

//global.strGameAddress = 'http://157.230.38.106:5555';

let InstanceLobby = require("./game/ILobby");
const { get } = require("http");
//let IGameManager = require('./game/IGameManager');

//let kGameManager = new IGameManager();
//let instanceApp = new Instance(io, '/', null, null);
let instanceApp = new InstanceLobby(io, "/");
//let instanceGame = new Instance(io, '/game', kGameManager, 'Game');

instanceApp.OnIO(io);
// instanceGame.OnIO(io);

const cPort = 7000;

app.get("/", (req, res) => {
  //res.render('login');
  console.log(req.user);
  if (req.user == undefined) {
    res.redirect("/account/login");
  } else {
    res.render("index", { type: 0, user: req.user });
  }
});

// app.get("/lobby", (req, res) => {

//   console.log("user", req.user);
//   console.log("lobby", req.query.lobbyName);

//   // console.log(/lobby);
//   // console.log(req.query.lobbyName);
//   // if (req.user == null) res.redirect("/account/login");
//   // else {
//   // console.log(req.user.strID);

//   //let account = {strID:req.user.strID, strPassword:req.user.strPassword, iCoin:req.user.iCash, iAvatar};
//   // const accountParams = req.query.account;
//   // const parsedAccountParams = JSON.parse(accountParams);

//   // let account = {
//     //   id: 1,
//     //   strID: parsedAccountParams.username,
//     //   strName: parsedAccountParams.username,
//     //   eUserType: "NORMAL",
//     //   strPassword: "12341234",
//     //   strEMail: "",
//     //   strNickname: parsedAccountParams.username,
//     //   strImage: "",
//     //   strGroupID: "1",
//     //   eStatus: "NORMAL",
//     //   eAuthenticated: "NONE",
//     //   iAvatar: 13,
//     //   iLevel: 0,
//     //   iExp: 0,
//     //   iPoint: 0,
//   //   iCash: parsedAccountParams.balance,
//   //   iPointBase: 0,
//   //   iCashBase: 0,
//   //   iRolling: 0,
//   //   strDesc: "",
//   //   strBank: "hana2001",
//   //   strAccount: "12341234",
//   //   strMobileNo: parsedAccountParams.phone,
//   //   strOptionCode: "11110000",
//   //   fHoldemR: 0,
//   //   fBig2R: 0,
//   //   fSitgoR: 0,
//   //   fOmahaR: 0,
//   //   fBaccaratR: 0,
//   //   fSettle: 0,
//   //   iParentID: null,
//   //   iClass: 5,
//   //   strIP: "::1",
//   //   strIPlogin: "::1",
//   //   strURL: "http://localhost:7000",
//   //   createdAt: "2025-05-13T06:40:34.000Z",
//   //   updatedAt: "2025-05-14T04:07:02.000Z",
//   //   loginedAt: "2025-05-14T04:07:02.000Z",
//   //   bLogin: 1,
//   // };

//   let account = req.user;

//   res.render("lobby", {
//     type: 2,
//     account: account,
//     user: req.user,
//     rooms: instanceApp.listRooms,
//     lobbyName: req.query.lobbyName,
//   });
//   // }
// });

// let GetAddress = (eGameType) => {

//     switch ( eGameType )
//     {
//         case '0':
//             return '157.230.38.106:5555/game';
//             //return '192.168.1.10:5555/game';
//     }
//     return '';
// }

app.post("/login", (req, res) => {
  console.log(req.body);

  let account = { strID: req.body.strID, strPassword: req.body.strPassword };

  res.render("game", { account: account });
});

app.post("/UpdateCoin", async (req, res) => {
  console.log(
    "##############################################################updatecoin"
  );
  console.log(req.body);

  for (let i in socket_list) {
    //console.log(socket_list[i].strID);
    if (socket_list[i].strNickname == req.body.strNickname) {
      socket_list[i].emit("UpdateCash", parseInt(req.body.iAmount));
    }
  }

  res.send("OK");
});

app.post("/UpdateOption", async (req, res) => {
  console.log(
    "##############################################################UpdateOption"
  );
  console.log(req.body);

  for (let i in socket_list) {
    //console.log(socket_list[i].strID);
    if (socket_list[i].strID == req.body.strID) {
      socket_list[i].emit("UpdateOption", req.body.strOptionCode);
    }
  }

  res.send("OK");
});

app.post("/removeroom", (req, res) => {
  console.log(`/removeroom`);
  console.log(req.body);

  instanceApp.RemoveRoom(req.body.lUnique);
});

app.post("/leaveroom", (req, res) => {
  console.log(`/leaveroom`);
  console.log(req.body);

  instanceApp.LeaveRoom(req.body.lUnique);
});

app.post("/quitroom", (req, res) => {
  console.log(`/removeroom`);
  console.log(req.body);

  instanceApp.LeaveGame(req.body.strID);
});

app.post("/request_roomlist", async (req, res) => {
  console.log("/request_roomlist");

  let list = [];
  for (let i in instanceApp.listRooms) {
    let objectData = instanceApp.listRooms[i];

    list.push(objectData);
  }
  res.send(list);
});

app.post("/request_onlineuser", async (req, res) => {
  console.log("/request_onlineuser");
  console.log(`${instanceApp.listUsers.GetLength()}`);
  let listUsers = [];

  for (let i = 0; i < instanceApp.listUsers.GetLength(); ++i) {
    if (instanceApp.listUsers.GetSocket(i).strID != undefined) {
      listUsers.push(instanceApp.listUsers.GetSocket(i).strID);
    }
  }

  console.log(listUsers);

  res.send({ result: "OK", list: listUsers });
});

app.post("/popup", upload.single("image"), async (req, res) => {
  console.log("파일이 성공적으로 업로드됨:", req.file);
  console.log("popupName : ", req.body.popupName);

  const oldImage = await db.Announcements.findOne({
    where: { strSubject: req.body.popupName },
  });

  let oldImagePath = `public/images/pop/${oldImage.oldImageName}`;

  console.log(`삭제 경로 : ${oldImagePath}`);

  // 기존 파일 삭제
  if (oldImagePath && fs.existsSync(oldImagePath)) {
    fs.unlink(oldImagePath, (err) => {
      if (err) {
        console.error("기존 이미지 파일 삭제 실패:", err);
      } else {
        console.log("기존 이미지 파일 삭제 성공");
      }
    });
  }
  res.send("파일 업로드 성공");
});

app.post("/createroom", async (req, res) => {
  console.log("/createroom");
  console.log(req.body.objectData);

  instanceApp.UpdateRoom(req.body.objectData);
});

app.post("/consultAlert", async (req, res) => {
  console.log("/createroom");
  console.log(req.body.objectData);

  for (let i in socket_list) {
    if (socket_list[i].strID == req.body.strID)
      socket_list[i].emit("SM_ConsultAlert");
  }
});

server.listen(cPort, () => {
  console.log(`YGGames Server Started At ${cPort}`);

  //console.log(`value is ${8000/10000}`);
});

setInterval(async () => {
  //    kGameManager.Update();

  instanceApp.Update();
}, 1000);

let socket_list = {};

global.socket_list = socket_list;

io.on("connection", (socket) => {
  console.log(
    `# ---------------------------------- Socket Connection : ${socket.id}`
  );

  const user = socket.request.user;
  console.log(user);

  // user 객체에서 strID와 strNickname을 가져와 소켓 객체에 저장
  if (user && user.dataValues) {
    socket.strID = user.dataValues.strID;
    socket.strNickname = user.dataValues.strNickname;
  }
  console.log(`socket.strID : ${socket.strID}`);
  console.log(`socket.strNickname : ${socket.strNickname}`);

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
});
