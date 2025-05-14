process.env.NODE_ENV =
  process.env.NODE_ENV &&
  process.env.NODE_ENV.trim().toLowerCase() == "production"
    ? "production"
    : "development";
var express = require("express");
const app = express();
var path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server, {});
const cors = require("cors");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/account", require("./routes/account"));

const i18n = require("./i18n");
app.use(i18n);

const db = require("./db");
db.sequelize.sync();

db.Fees.findOne().then((fee) => {
  //   console.log(`fee : ${fee.fBig2}`);
  //   global.fBig2 = fee.fBig2;
});

global.globalUniqueNumbers = new Set();

let Instance = require("./game/IGameInstance");
let IGameManager = require("./game/IGameManager");

let kGameManager = new IGameManager();
let instanceGame = new Instance(io, "/game", kGameManager);

instanceGame.OnIO(io);

if (process.env.NODE_ENV == "production") {
  global.strLobbyAddress = "https://nodajipoker00.com";
  global.strGameAddress = "http://157.230.38.106:5556";
} else if (process.env.NODE_ENV == "development") {
  global.strLobbyAddress = "http://localhost:6999";
  global.strGameAddress = "http://localhost:5556";
}

app.get("/", (req, res) => {
  res.send("welcome");
});

app.post("/game", (req, res) => {
  console.log(`/game`);

  console.log(req.body);

  let account = {
    strID: req.body.strID,
    strNickname: req.body.strNickname,
    strPassword: req.body.strPassowrd,
    lUnique: req.body.lUnique,
    iCoin: req.body.iCoin,
    iAvatar: req.body.iAvatar,
    strOptionCode: req.body.strOptionCode,
    strGroupID: req.body.strGroupID,
    iClass: req.body.iClass,
    eUserType: req.body.eUserType,
  };
  res.render("game", {
    account: account,
    strLobbyAddress: global.strLobbyAddress,
  });
});

app.post("/create", async (req, res) => {
  console.log(`/create`);
  console.log(req.body);
  console.log(req.body.strID);

  let data = req.body;
  let result = kGameManager.CreateGame(
    data.strRoomName,
    data.eGameType,
    data.strPassword,
    data.iDefaultCoin,
    data.iBettingTime,
    data.iMaxPlayer
  );

  if (result != null) {
    await db.Users.update(
      { eLocation: "BIG2" },
      { where: { strID: req.body.strID } }
    );
    if (parseInt(result.iDefaultCoin) <= parseInt(req.body.iCoin)) {
      res.send({
        result: "OK",
        lUnique: result.lUnique,
        strGameName: result.strGameName,
        eGameType: result.eGameType,
        strPassword: result.strPassword,
        iDefaultCoin: result.iDefaultCoin,
        //iBuyIn:result.iBuyIn,
        iBettingTime: result.iBettingTime,
        iMaxPlayer: result.cMaxPlayer,
        //iNumPlayer:result.listUsers.GetLength()
        iNumPlayer: 1,
        listPlayer: [],
      });
    } else {
      res.send({ result: "Error", error: "NotEnoughCoin" });
    }
  } else {
    res.send({ result: "Error", error: "CantMakeRoom" });
  }
});

app.post("/roominfo", (req, res) => {
  console.log(`/roominfo`);
  console.log(req.body);
  console.log(req.body.strID);

  let data = req.body;

  let result = kGameManager.GetRoomInfo(data.lUnique);
  if (result != null) {
    let listPlayer = [];
    for (let i = 0; i < result.listUsers.GetLength(); ++i) {
      const player = result.listUsers.GetUser(i);
      //console.log(player);
      //const iCoin = player.iCoin+player.iCash;
      listPlayer.push({
        strID: player.strID,
        strNickname: player.strNickname,
        iCoin: player.iCoin,
        iLocation: player.iLocation,
        iAvatar: player.iAvatar,
      });
    }

    res.send({
      result: "OK",
      lUnique: result.lUnique,
      strGameName: result.strGameName,
      eGameType: result.eGameType,
      strPassword: result.strPassword,
      iDefaultCoin: result.iDefaultCoin,
      iBettingTime: result.iBettingTime,
      iMaxPlayer: result.cMaxPlayer,
      iNumPlayer: result.listUsers.GetLength(),
      listPlayer: listPlayer,
    });
  } else {
    res.send({ result: "Error", error: "NotExistRoom", lUnique: data.lUnique });
  }
});

app.post("/allroominfo", (req, res) => {
  //console.log(`/allroominfo`);

  let result = kGameManager.GetAllRoomInfo();
  if (result != null) {
    let roomsInfo = []; // Initialize an array to store information about each room

    for (let i = 0; i < result.length; ++i) {
      // Assuming result is an array of rooms
      const room = result[i]; // Get current room

      // Gather information about the room
      let roomInfo = {
        lUnique: room.lUnique,
        strGameName: room.strGameName,
        eGameType: room.eGameType,
        strPassword: room.strPassword,
        iDefaultCoin: room.iDefaultCoin,
        iBettingTime: room.iBettingTime,
        iMaxPlayer: room.cMaxPlayer,
        iNumPlayer: room.listUsers.GetLength(),
        listPlayer: [],
      };

      // Iterate over players in the room and add them to the roomInfo
      for (let j = 0; j < room.listUsers.GetLength(); ++j) {
        const player = room.listUsers.GetUser(j);
        //console.log(player.strID, player.strNickname);
        roomInfo.listPlayer.push({
          strID: player.strID,
          strNickname: player.strNickname,
          iCoin: player.iCoin,
          iLocation: player.iLocation,
          iAvatar: player.iAvatar,
        });
      }

      roomsInfo.push(roomInfo); // Add the current room's info to the array
    }
    res.send({ result: "OK", rooms: roomsInfo }); // Send the array of rooms information
  } else {
    res.send({ result: "Error", error: "NotExistRoom" });
  }
});

app.post("/join", async (req, res) => {
  console.log(`/join`);
  console.log(req.body);
  console.log(req.body.strID);

  let data = req.body;

  let result = kGameManager.CheckJoin(data.lUnique, null);

  let listPlayer = [];

  if (result != null) {
    for (let i = 0; i < result.listUsers.GetLength(); ++i) {
      const player = result.listUsers.GetUser(i);
      //console.log(player);
      //const iCoin = player.iCoin+player.iCash;
      listPlayer.push({
        strID: player.strID,
        strNickname: player.strNickname,
        iCoin: player.iCoin,
        iLocation: player.iLocation,
        iAvatar: player.iAvatar,
      });
    }
    await db.Users.update(
      { eLocation: "BIG2" },
      { where: { strID: req.body.strID } }
    );

    if (parseInt(result.iDefaultCoin) <= parseInt(req.body.iCoin)) {
      res.send({
        result: "OK",
        lUnique: result.lUnique,
        strGameName: result.strGameName,
        eGameType: result.eGameType,
        strPassword: result.strPassword,
        iDefaultCoin: result.iDefaultCoin,
        //iBuyIn:result.iBuyIn,
        iBettingTime: result.iBettingTime,
        iMaxPlayer: result.cMaxPlayer,
        iNumPlayer: result.listUsers.GetLength(),
        listPlayer: listPlayer,
      });
    } else {
      res.send({ result: "Error", error: "NotEnoughCoin" });
    }
  } else {
    res.send({ result: "Error", error: "NotExistRoom", lUnique: data.lUnique });
  }
});

app.post("/quickjoin", async (req, res) => {
  console.log(`/quickjoin`);
  console.log(req.body);
  console.log(req.body.strID);

  let data = req.body;
  let result = kGameManager.QuickJoin(data.iDefaultCoin);

  let listPlayer = [];
  if (result != null) {
    await db.Users.update(
      { eLocation: "BIG2" },
      { where: { strID: req.body.strID } }
    );
    for (let i = 0; i < result.listUsers.GetLength(); ++i) {
      const player = result.listUsers.GetUser(i);
      //console.log(player);
      //const iCoin = player.iCoin+player.iCash;
      listPlayer.push({
        strID: player.strID,
        strNickname: player.strNickname,
        iCoin: player.iCoin,
        iLocation: player.iLocation,
        iAvatar: player.iAvatar,
      });
    }
    if (parseInt(result.iDefaultCoin) <= parseInt(req.body.iCoin)) {
      res.send({
        result: "OK",
        lUnique: result.lUnique,
        strGameName: result.strGameName,
        eGameType: result.eGameType,
        strPassword: result.strPassword,
        iDefaultCoin: result.iDefaultCoin,
        //iBuyIn:result.iBuyIn,
        iBettingTime: result.iBettingTime,
        iMaxPlayer: result.cMaxPlayer,
        iNumPlayer: result.listUsers.GetLength(),
      });
    } else {
      res.send({ result: "Error", error: "NotEnoughCoin" });
    }
  } else {
    let result2 = kGameManager.CreateGame(
      data.strRoomName,
      data.eGameType,
      data.strPassword,
      data.iDefaultCoin,
      data.iBettingTime,
      data.iMaxPlayer
    );

    if (result2 != null) {
      await db.Users.update(
        { eLocation: "BIG2" },
        { where: { strID: req.body.strID } }
      );
      if (parseInt(result2.iDefaultCoin) <= parseInt(req.body.iCoin)) {
        res.send({
          result: "OK",
          lUnique: result2.lUnique,
          strGameName: result2.strGameName,
          eGameType: result2.eGameType,
          strPassword: result2.strPassword,
          iDefaultCoin: result2.iDefaultCoin,
          //iBuyIn:result2.iBuyIn,
          iBettingTime: result2.iBettingTime,
          iMaxPlayer: result2.cMaxPlayer,
          //iNumPlayer:result2.listUsers.GetLength()
          iNumPlayer: 1,
          listPlayer: [],
        });
      } else {
        res.send({ result: "Error", error: "NotEnoughCoin" });
      }
    } else {
      res.send({ result: "Error", error: "CantMakeRoom" });
    }
  }
});

app.post("/request_roomlist", async (req, res) => {
  console.log("/request_roomlist");

  let list = [];
  for (let i in kGameManager.listGames) {
    let game = kGameManager.listGames[i];

    let strUsers = "";
    //for ( let i in game.listUsers )
    for (let i = 0; i < game.listUsers.GetLength(); ++i) {
      const player = game.listUsers.GetSocket(i);
      strUsers += `(${player.strID}:${player.iCash})`;
    }

    let objectData = {
      lUnique: game.lUnique,
      strGameName: game.strGameName,
      strPassword: game.strPassword,
      iDefaultCoin: game.iDefaultCoin,
      //iBuyIn:game.iBuyIn,
      iBettingTime: game.iBettingTime,
      iMaxPlayer: game.cMaxPlayer,
      iNumPlayer: game.listUsers.GetLength(),
      strUsers: strUsers,
    };

    list.push(objectData);
  }

  console.log(list);

  res.send(list);
});

const cPort = 5556;

server.listen(cPort, () => {
  console.log(`YGPoker Big2 Server Started At ${cPort}`);

  //console.log(`value is ${8000/10000}`);
});

setInterval(async () => {
  kGameManager.Update();

  await kGameManager.UpdateDB();
  //instanceApp.Update();

  //instanceGame.PrintLobbyUsers();
}, 1000);
