const express = require("express");
const passport = require("passport");
const router = express.Router();

const axios = require("axios");
var moment = require("moment");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const path = require("path");
router.use(express.static(path.join(__dirname, "..", "public")));

const db = require("../db");
const ITime = require("../utils/time");
const { Op, and, Sequelize } = require("sequelize");
const e = require("connect-flash");

router.get("/gamelog", async (req, res) => {
  console.log("game");
  console.log(req.body);
  if (req.user == undefined) res.redirect("/account/login");
  else res.render("game/gamelog", { type: 0, user: req.user });
});
let getRelocationGamelog = async (data, list) => {
  for (let i = 0; i < data.length; i++) {
    let row = data[i];
    let winnerData = row.strWinner.split(":");
    let descData = row.strDesc.split(",");
    let descObj = {};
    for (let j = 0; j < descData.length; j++) {
      let keyValue = descData[j].split(":");
      descObj[keyValue[0]] = keyValue[1];
    }
    let strHand = row.strHand;
    let handList = strHand.split(",");
    let handObj = {};
    for (let k = 0; k < handList.length; k++) {
      let [id, cards] = handList[k].split(":");
      let cardList = cards.split("/");
      handObj[id] = cardList;
    }
    let tablecardObject = row.strTablecard.split(",");
    let newData = {
      lUnique: row.lUnique,
      strWinner: {
        name: winnerData[0],
        amount: winnerData[1],
      },
      strDesc: descObj,
      iStartCoin: row.iStartCoin,
      strHand: handObj,
      strTablecard: tablecardObject,
      createdAt: row.createdAt,
    };
    list.push(newData);
  }
};
let getGamelog = async (data, strID, list) => {
  for (let i = 0; i < data.length; i++) {
    let row = data[i];
    let winnerData = row.strWinner.split(":");
    let strResult = winnerData[0] === strID ? "승" : "패";
    let strNickname = "";
    let iStartCoin = 0;
    let iBettingCoin = 0;
    let iResultCoin = 0;

    let user = await db.Users.findOne({ where: { strID: strID } });
    strNickname = user ? user.strNickname : "";

    let startCoins = row.strStartCoin.split(",");
    let resultCoins = row.strResultCoin.split(",");
    let bettingCoins = row.strDesc.split(",");

    for (let part of startCoins) {
      let [id, startCoin] = part.split(":");
      if (id == strID) {
        iStartCoin = parseInt(startCoin);
        break;
      }
    }

    for (let part of resultCoins) {
      let [id, resultCoin] = part.split(":");
      if (id == strID) {
        iResultCoin = parseInt(resultCoin);
        break;
      }
    }

    for (let part of bettingCoins) {
      let [id, bettingCoin] = part.split(":");
      if (id == strID) {
        iBettingCoin = parseInt(bettingCoin);
        break;
      }
    }

    let bJackpot = row.iJackpot > 0;

    let newData = {
      roomId: row.id,
      createdAt: row.createdAt,
      lUnique: row.lUnique,
      iBlind: row.iBlind,
      strID: strID,
      strNickname: strNickname,
      strResult: strResult,
      iStartCoin: iStartCoin,
      iBettingCoin: iBettingCoin,
      iResultCoin: iResultCoin,
      iFeeAmount: row.iFeeAmount,
      iJackpotfee: row.iJackpotFeeAmount,
      bJackpot: bJackpot,
    };

    list.push(newData);
  }
};
router.post("/gameloglist", async (req, res) => {
  console.log("/gameloglist");
  console.log(req.body);

  var data = [];
  //var list_count = 0;
  var full_count = 0;

  var strTimeStart = req.body.startDate;
  var strTimeEnd = req.body.endDate;
  var accountId = req.body.accountId;

  if (accountId == "") {
    res.send({ result: "NOID", reason: "ID를 적고 검색해주세요." });
    return data;
  }
  //console.log("start : " + req.body.start);
  //console.log("startDate : "+ moment(strTimeStart).format('YYYY-MM-DD hh:mm:ss') + " endDate : "+ moment(strTimeEnd).format('YYYY-MM-DD hh:mm:ss'));
  var querydatas = await db.Results.findAll({
    order: [["createdAt", "DESC"]],
    where: {
      [Op.and]: [
        {
          createdAt: {
            [Op.between]: [
              moment(strTimeStart).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
              moment(strTimeEnd).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
            ],
          },
          strDesc: { [Op.like]: `%${accountId}%` },
        },
      ],
    },
  });
  let listGamelog = [];
  //console.log(querydatas);
  //full_count = querydatas.length;
  await getRelocationGamelog(querydatas, listGamelog);
  console.log(listGamelog);
  full_count = listGamelog.length;

  for (var i in listGamelog) {
    data.push({
      createdAt: listGamelog[i].createdAt,
      lUnique: listGamelog[i].lUnique,
      iClass: listGamelog[i].iClass,
      strGroupID: listGamelog[i].strGroupID,
      iAmount: listGamelog[i].iAmount,
      strDepositor: listGamelog[i].strDepositor,
      strMobileNo: listGamelog[i].strGroupID,
      eState: listGamelog[i].eState,
    });
  }
  //console.log(querydatas);
  var object = {};
  object.draw = req.body.draw;
  object.recordsTotal = full_count;
  //object.recordsFiltered = list_count;
  object.recordsFiltered = full_count;
  object.data = data;

  //console.log(object);

  //res.send({data:list});
  //res.send(object);
  res.send(object);
});

router.post("/gamelogresult", async (req, res) => {
  console.log("/gamelogresult");
  console.log(req.body);

  const { accountId, eGameType, startDate, endDate } = req.body;
  const start = parseInt(req.body.start);
  const length = parseInt(req.body.length);
  let listGamelog = [];

  if (accountId == "" || accountId == null || accountId == undefined) {
    return res.send({ result: "NOID", reason: "ID를 검색해주세요." });
  }
  let user = await db.Users.findOne({ where: { strID: accountId } });
  if (!user || !user.strGroupID.includes(req.user.strGroupID)) {
    return res.send({
      result: "NOGROUP",
      reason: "해당 ID 검색 권한이 없습니다.",
    });
  }

  let whereCondition = {
    createdAt: {
      [Op.between]: [
        moment(startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
        moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      ],
    },
    strDesc: {
      [Op.like]: `%${accountId}%`,
    },
  };

  // eGameType 조건 추가
  if (eGameType && eGameType !== "") {
    whereCondition.eGameType = eGameType;
  }

  const filteredRecords = await db.Results.count({
    where: whereCondition,
  });

  const querydatas = await db.Results.findAll({
    order: [["createdAt", "DESC"]],
    where: whereCondition,
    offset: start,
    limit: length,
  });

  await getGamelog(querydatas, accountId, listGamelog);

  const object = {
    draw: req.body.draw,
    recordsTotal: filteredRecords,
    recordsFiltered: filteredRecords,
    data: listGamelog,
  };

  res.send(JSON.stringify(object));
});

router.get("/fee", async (req, res) => {
  console.log("/game/fee");
  console.log(req.body);
  if (req.user == undefined) res.redirect("/account/login");
  else res.render("game/fee", { type: 0, user: req.user });
});

router.post("/request_fee", async (req, res) => {
  let data = await db.Fees.findAll();

  console.log(`/request_fee : ${data.fHoldem}`);

  var object = {};
  object.draw = req.body.draw;
  object.recordsTotal = 1;
  object.recordsFiltered = 1;
  object.data = data;
  res.send(JSON.stringify(object));
});

router.post("/request_feedetail", async (req, res) => {
  let data = await db.Fees.findOne();

  console.log(`/request_feedetail : ${data.fHoldem}`);

  res.send({ result: "OK", data: data });
});

router.post("/request_modifyfee", async (req, res) => {
  await db.Fees.update(
    {
      fHoldem: req.body.fHoldem,
      fSitgo: req.body.fSitgo,
      fBig2: req.body.fBig2,
      fOmaha: req.body.fOmaha,
      fBaccarat: req.body.fBaccarat,
    },
    { where: { id: 1 } }
  );

  res.send({ result: "OK" });
});

router.get("/jackpot", async (req, res) => {
  console.log("/game/jackpot");
  console.log(req.body);
  if (req.user == undefined) res.redirect("/account/login");
  else res.render("game/jackpot", { type: 0, user: req.user });
});

router.post("/request_jackpot", async (req, res) => {
  let data = await db.Jackpots.findAll();

  console.log(`/request_jackpot : ${data.strGame}`);

  var object = {};
  object.draw = req.body.draw;
  object.recordsTotal = data.length;
  object.recordsFiltered = data.length;
  object.data = data;

  res.send(JSON.stringify(object));
});

router.post("/request_jackpotdetail", async (req, res) => {
  console.log(`/request_feedetail`);
  let data = await db.Jackpots.findOne({ where: { id: req.body.id } });
  res.send({ result: "OK", data: data });
});

router.post("/request_modifyjackpot", async (req, res) => {
  console.log(`/request_modifyjackpot`);
  //console.log(req.body);
  await db.Jackpots.update(
    {
      iLevel1Amount: req.body.iLevel1Amount,
      iLevel2Amount: req.body.iLevel2Amount,
      iLevel3Amount: req.body.iLevel3Amount,
      iLevel1Round: req.body.iLevel1Round,
      iLevel2Round: req.body.iLevel2Round,
      iLevel3Round: req.body.iLevel3Round,
    },
    { where: { id: req.body.id } }
  );
  res.send({ result: "OK" });
});

router.get("/roomlist", async (req, res) => {
  console.log("/game/fee");
  console.log(req.body);
  if (req.user == undefined) res.redirect("/account/login");
  else res.render("game/roomlist", { type: 0, user: req.user });
});

router.post("/request_roomlist", async (req, res) => {
  let data = {};
  let strGameAddress = null;
  if (req.body.eGameType == "HOLDEM") {
    strGameAddress = global.strHoldemAddress;
  } else if (req.body.eGameType == "SITGO") {
    strGameAddress = global.strSitgoAddress;
  } else {
    strGameAddress = global.strHoldemAddress;
  }

  //axios.post(`http://localhost:6999/request_roomlist`, data)
  axios
    .post(`${global.strHoldemAddress}/request_roomlist`, data)
    .then((response) => {
      //console.log(response);

      const data = response.data;

      console.log(data);

      var object = {};
      object.draw = req.body.draw;
      object.recordsTotal = 1;
      object.recordsFiltered = 1;
      object.data = data;
      res.send(JSON.stringify(object));

      //res.send({data:response.data});
    })
    .catch((error) => {});
});

router.post("/gamedetail", async (req, res) => {
  let data = await db.Results.findOne({ where: { id: req.body.gameID } });

  console.log(`/gamedetail`);

  res.send({ result: "OK", data: data });
});

router.get("/inspection", async (req, res) => {
  console.log("/game/inspection");
  console.log(req.body);
  if (req.user == undefined) res.redirect("/account/login");
  else res.render("game/inspection", { type: 0, user: req.user });
});

router.post("/request_inspectiondetail", async (req, res) => {
  console.log(`/game/request_inspectiondetail`);
  console.log(req.body);

  let data = await db.Settings.findOne({ where: { id: req.body.id } });

  res.send({ result: "OK", data: data });
});

router.post("/request_inspectionlist", async (req, res) => {
  let list = await db.Settings.findAll();

  var object = {};
  object.draw = req.body.draw;
  object.recordsTotal = list.length;
  object.recordsFiltered = list.length;
  object.data = list;

  console.log(object.data);
  res.send(JSON.stringify(object));
});

router.post("/inspectionregister", async (req, res) => {
  console.log(`/game/inspectionregister`);
  console.log(req.body);

  let data = await db.Settings.findOne({ where: { id: req.body.id } });

  if (data == null) {
    res.send({ result: "Error", reason: "No Data. Check it please." });
    return;
  } else {
    await data.update({
      strContents: req.body.strContents,
      iOnOff: req.body.iOnOff,
    });
  }

  res.send({ result: "OK" });
});

module.exports = router;
