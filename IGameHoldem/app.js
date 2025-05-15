process.env.NODE_ENV =
  process.env.NODE_ENV &&
  process.env.NODE_ENV.trim().toLowerCase() == "production"
    ? "production"
    : "development";
var express = require("express");
const layout = require("express-ejs-layouts");
const app = express();
var path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server, {});
const cors = require("cors");

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

app.use(layout);
app.set("layout", "layout");
app.set("layout extractScripts", true);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/account", require("./routes/account"));
app.use("/robot", require("./routes/robot"));

const db = require("./db");
db.sequelize.sync();

// db.Fees.findOne().then((fee) => {

//     console.log(`fee : ${fee.fHoldem}`);

//     global.fHoldemFee = fee.fHoldem;
//     global.fJackpotFee = fee.fJackpot;
// });

// db.Jackpots.findOne({ where: { strGame: "HOLDEM" } }).then((jackpot) => {
//   console.log(`jackpot : ${jackpot.iJackpot}`);

//   global.iJackpot = jackpot.iJackpot;
// });

global.globalUniqueNumbers = new Set();

let InstanceHoldem = require("./game/IGameInstance");
let IGameManager = require("./game/IGameManager");
let InstanceLobby = require("./game/ILobby");

let kGameManager = new IGameManager();
let instanceGame = new InstanceHoldem(io, "/game", kGameManager);

instanceGame.OnIO(io);

const { get } = require("http");
//let IGameManager = require('./game/IGameManager');

//let kGameManager = new IGameManager();
//let instanceApp = new Instance(io, '/', null, null);
let instanceApp = new InstanceLobby(io, "/");
//let instanceGame = new Instance(io, '/game', kGameManager, 'Game');

instanceApp.OnIO(io);
// instanceGame.OnIO(io);

if (process.env.NODE_ENV == "production") {
  global.strLobbyAddress = "https://nodajipoker00.com";
  global.strGameAddress = "https://nodajiholdem00.org";
} else if (process.env.NODE_ENV == "development") {
  global.strLobbyAddress = "http://localhost:6999";
  global.strGameAddress = "http://192.168.1.10:5555";
}

app.get("/", (req, res) => {
  res.send("welcome");
});

app.get("/robot", (req, res) => {
  res.render("robot");
});

app.get("/lobby", (req, res) => {
  // console.log(`/lobby`);
  // console.log(req.query.lobbyName);
  // if (req.user == null) res.redirect("/account/login");
  // else {
  // console.log(req.user.strID);

  //let account = {strID:req.user.strID, strPassword:req.user.strPassword, iCoin:req.user.iCash, iAvatar};
  // let account = req.user;
  const accountParams = req.query.account;

  const parsedAccountParams = JSON.parse(accountParams);

  let account = {
    id: 1,
    strID: parsedAccountParams.username,
    strName: parsedAccountParams.username,
    eUserType: "NORMAL",
    strPassword: "12341234",
    strEMail: "",
    strNickname: parsedAccountParams.username,
    strImage: "",
    strGroupID: "1",
    eStatus: "NORMAL",
    eAuthenticated: "NONE",
    iAvatar: 13,
    iLevel: 0,
    iExp: 0,
    iPoint: 0,
    iCash: parsedAccountParams.balance,
    iPointBase: 0,
    iCashBase: 0,
    iRolling: 0,
    strDesc: "",
    strBank: "hana2001",
    strAccount: "12341234",
    strMobileNo: parsedAccountParams.phone,
    strOptionCode: "11110000",
    fHoldemR: 0,
    fBig2R: 0,
    fSitgoR: 0,
    fOmahaR: 0,
    fBaccaratR: 0,
    fSettle: 0,
    iParentID: null,
    iClass: 5,
    strIP: "::1",
    strIPlogin: "::1",
    strURL: "http://localhost:7000",
    createdAt: "2025-05-13T06:40:34.000Z",
    updatedAt: "2025-05-14T04:07:02.000Z",
    loginedAt: "2025-05-14T04:07:02.000Z",
    bLogin: 1,
  };

  res.render("lobby", {
    type: 2,
    account: account,
    user: req.user,
    rooms: instanceApp.listRooms,
    lobbyName: req.query.lobbyName,
  });
  // }
});

// app.get("/lobby", (req, res) => {
//     // Lấy account từ query hoặc session
//     let account;
//     if (req.query.account) {
//         try {
//             account = JSON.parse(req.query.account);
//         } catch (e) {
//             account = null;
//         }
//     }
//     // Nếu vẫn chưa có account, có thể lấy từ session hoặc trả về lỗi
//     if (!account) {
//         return res.status(400).send("Thiếu hoặc sai tham số account!");
//     }
//     // Bổ sung các trường cần thiết cho account nếu thiếu
//     account.strNickname = account.strNickname || account.username || "Guest";
//     account.iCash = account.iCash || account.balance || 0;
//     account.strOptionCode = account.strOptionCode || "11110000";
//     account.iAvatar = account.iAvatar || 0;
//     account.iClass = account.iClass || 5;
//     account.strGroupID = account.strGroupID || "1";
//     account.eUserType = account.eUserType || "NORMAL";

//     res.render("lobby", {
//         account: account,
//         lobbyName: req.query.lobbyName || "IHoldemLobby",
//         rooms: [], // hoặc instanceApp.listRooms nếu có
//     });
// });

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
    iDefaultCoin: req.body.iDefaultCoin,
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
  let iRebuyIn =
    parseInt(result.iDefaultCoin) * parseInt(data.strOptionCode[1]) * 100;
  //console.log(result);

  await db.Users.update(
    { eLocation: "HOLDEM" },
    { where: { strID: req.body.strID } }
  );
  // let listPlayer = [];
  // for ( let i = 0; i < result.listUsers.GetLength(); ++ i )
  // {
  //     const player = result.listUsers.GetUser(i);
  //     //console.log(player);
  //     //const iCoin = player.iCoin+player.iCash;
  //     listPlayer.push({strID:player.strID, strNickname:player.strNickname, iCoin:player.iCoin, iLocation:player.iLocation, iAvatar:player.iAvatar});
  // }

  if (result != null) {
    if (parseInt(result.iDefaultCoin) == 500) {
      if (parseInt(req.body.iCoin) >= 10000) {
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
    } else if (parseInt(iRebuyIn) <= parseInt(req.body.iCoin)) {
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
  }
});

app.post("/join", async (req, res) => {
  console.log(`/join`);
  console.log(req.body);
  console.log(req.body.strID);

  let data = req.body;

  // let player = instanceGame.FindUserFromID(req.body.strID);
  // if ( null != player )
  // {
  //     res.send({result:'Error', error:'AlreadyPlaying'});
  // }
  // else
  // {
  //let result = this.GameManager.QuickJoin()
  //let result = kGameManager.Join(data.lUnique, null);
  let result = kGameManager.CheckJoin(data.lUnique, null);
  await db.Users.update(
    { eLocation: "HOLDEM" },
    { where: { strID: req.body.strID } }
  );
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
    let iRebuyIn =
      parseInt(result.iDefaultCoin) * parseInt(req.body.strOptionCode[1]) * 100;
    if (parseInt(result.iDefaultCoin) == 500) {
      if (parseInt(req.body.iCoin) >= 10000) {
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
    } else if (parseInt(iRebuyIn) <= parseInt(req.body.iCoin)) {
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
      { eLocation: "HOLDEM" },
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
    let iRebuyIn =
      parseInt(result.iDefaultCoin) * parseInt(req.body.strOptionCode[1]) * 100;
    if (parseInt(result.iDefaultCoin) == 500) {
      if (parseInt(req.body.iCoin) >= 10000) {
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
    } else if (parseInt(iRebuyIn) <= parseInt(req.body.iCoin)) {
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
    let result2 = kGameManager.CreateGame(
      data.strRoomName,
      data.eGameType,
      data.strPassword,
      data.iDefaultCoin,
      data.iBettingTime,
      data.iMaxPlayer
    );
    let iRebuyIn =
      parseInt(result2.iDefaultCoin) * parseInt(data.strOptionCode[1]) * 100;

    if (result2 != null) {
      await db.Users.update(
        { eLocation: "HOLDEM" },
        { where: { strID: req.body.strID } }
      );
      if (parseInt(result2.iDefaultCoin) == 500) {
        if (parseInt(req.body.iCoin) >= 10000) {
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
      } else if (parseInt(iRebuyIn) <= parseInt(req.body.iCoin)) {
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
      const player = game.listUsers.GetUser(i);
      strUsers += `(${player.strID}:${player.iCoin})`;
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

app.post("/request_userinfo", (req, res) => {
  console.log("/request_userinfo");
  for (let i in kGameManager.listGames) {
    let game = kGameManager.listGames[i];

    //for ( let i in game.listUsers )
    for (let i = 0; i < game.listUsers.GetLength(); ++i) {
      const player = game.listUsers.GetUser(i);
      if (req.body.strID == player.strID) {
        res.send({ result: "OK" });
        return;
      }
    }
  }
  res.send({ result: "Error", error: "CantUser" });
});

app.post("/request_alluserinfo", (req, res) => {
  console.log("/request_alluserinfo");
  const { robotDatas } = req.body; // Get the robot IDs from the request
  console.log(req.body);
  let missingRobots = [];

  robotDatas.forEach((robotID) => {
    let found = false;
    for (let i in kGameManager.listGames) {
      let game = kGameManager.listGames[i];
      for (let j = 0; j < game.listUsers.GetLength(); ++j) {
        const player = game.listUsers.GetUser(j);
        if (robotID == player.strID) {
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (!found) {
      missingRobots.push(robotID); // This robot ID is not found in any game's user list
    }
  });

  if (missingRobots.length > 0) {
    res.send({ result: "OK", missingRobots }); // Send back IDs of robots that should trigger the event
  } else {
    res.send({ result: "Error", error: "No missing robots" });
  }
});

app.post("/request_allrobotinfo", (req, res) => {
  console.log("/request_allrobotinfo");
  const { robotDatas } = req.body; // Get the robot IDs from the request
  console.log(req.body);
  let enterRobots = [];

  robotDatas.forEach((robotID) => {
    let found = false;
    for (let i in kGameManager.listGames) {
      let game = kGameManager.listGames[i];
      for (let j = 0; j < game.listUsers.GetLength(); ++j) {
        const player = game.listUsers.GetUser(j);
        if (robotID == player.strID) {
          found = true;
          enterRobots.push(robotID);
          break;
        }
      }
      if (found) break;
    }
  });

  if (enterRobots.length > 0) {
    res.send({ result: "OK", enterRobots }); // Send back IDs of robots that should trigger the event
  } else {
    res.send({ result: "Error", error: "No missing robots" });
  }
});

const cPort = 5555;

server.listen(cPort, () => {
  console.log(`IOCGames Server Started At ${cPort}`);

  //console.log(`value is ${8000/10000}`);
});

setInterval(async () => {
  kGameManager.Update();

  await kGameManager.UpdateDB();
  instanceApp.Update();

  //instanceGame.PrintLobbyUsers();
}, 1000);

// setInterval(async () => {

//     await kGameManager.UpdateJackpot();

// }, 5000);

let socket_list = {};

global.socket_list = socket_list;

// io.on("connection", (socket) => {
//   console.log(
//     `# ---------------------------------- Socket Connection : ${socket.id}`
//   );

//   socket.on("CM_Login", (id, nickname, password, cash) => {

//     socket.emit("SM_RequestLogin", { id, nickname, cash });
//   });

//   const user = socket.request.user;
//   console.log(user);

//   // user 객체에서 strID와 strNickname을 가져와 소켓 객체에 저장
//   if (user && user.dataValues) {
//     socket.strID = user.dataValues.strID;
//     socket.strNickname = user.dataValues.strNickname;
//   }
//   console.log(`socket.strID : ${socket.strID}`);
//   console.log(`socket.strNickname : ${socket.strNickname}`);

//   socket_list[socket.id] = socket;

//   if (socket.strID == undefined) {
//     socket.emit("SM_RequestLogin");
//   }

//   socket.on("disconnect", () => {
//     console.log(
//       `#$ ---------------------------------- Socket Disconnection : ${socket.id}, ${socket.strID}, ${socket.eStage}, ${socket.lUnique}`
//     );

//     //this.RemoveUser(socket);

//     delete socket_list[socket.id];
//   });
// });
