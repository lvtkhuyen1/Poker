const express = require("express");
const passport = require("passport");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const path = require("path");
router.use(express.static(path.join(__dirname, "../", "public")));

let axios = require("axios");

const db = require("../db");
// const db = require('../models');
// const time = require('../utils/time');
// const {Op}= require('sequelize');

const { isLoggedIn, isNotLoggedIn } = require("./middleware");
const { type } = require("os");

var requestIp = require("request-ip");
//
router.get("/", async (req, res) => {
  if (req.user == undefined) res.redirect("/account/login");
  else res.render("account/index", { type: 0, user: req.user });
});

router.get("/login", async (req, res) => {
  res.render("account/login", { type: 1, messages: req.flash("error")[0] });
});

router.get("/register", async (req, res) => {
  res.render("account/register", { type: 1, messages: req.flash("error")[0] });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true,
  }),
  (req, res) => {
    console.log(`post : /account/login : req.session.messages}`);
  }
);

// router.post('/register', async (req, res) => {
//     console.log('/register');

//     let user = await db.Users.findOne({where:{strID:req.body.strID}});
//     if ( user != null )
//     {
//         res.redirect('/account/register');
//     }
//     else
//     {
//         await db.Users.create({
//             strID:req.body.strID,
//             strPassword:req.body.strPassword,
//             strName:'',
//             eUserType:'NORMAL',
//             strEMail:'',
//             strNickname:'',
//             strGroupID:'0',
//             eStatus:'NORMAL',
//             eAuthenticated:'NONE',
//             iAvatar:0,
//             iLevel:1,
//             iExp:0,
//             iPoint:0,
//             iRolling:0,
//             iCash:1000000,
//             strBank:'',
//             strAccount:'',
//             strMobileNo:'',
//             strOptionCode:'00000000',
//         });

//         res.redirect('/account/login');
//     }
// });

router.post("/request_register", async (req, res) => {
  console.log("/request_register");
  console.log(req.body);

  const ip = requestIp.getClientIp(req);
  console.log(ip);
  var object = {};
  object.result = "OK";

  let parent = await db.Users.findOne({
    where: { strID: req.body.strRecommend },
  });

  //   if (parent == null) {
  //     res.send({ result: "NOTPARENT", reason: "추천인 아이디를 확인해주세요." });
  //   } else
  if (req.body.strID == "") {
    res.send({ result: "NOTID", reason: "아이디를 확인해주세요." });
  } else if (req.body.strNickname == "") {
    res.send({ result: "NOTNICKNAME", reason: "닉네임을 확인해주세요." });
  } else if (req.body.strPassword == "") {
    res.send({ result: "NOTPASSWORD", reason: "비밀번호를 확인해주세요." });
  } else if (req.body.strBank == "") {
    res.send({ result: "NOTBANK", reason: "은행명을 확인해주세요." });
  } else if (req.body.strAccount == "") {
    res.send({ result: "NOTACCOUNT", reason: "계좌번호를 확인해주세요." });
  } else if (req.body.strName == "") {
    res.send({ result: "NOTNAME", reason: "예금주명을 확인해주세요." });
  } else if (req.body.strMobileNo == "") {
    res.send({ result: "NOTMobile", reason: "연락처를 확인해주세요." });
  } else {
    // if (parent.iClass < 4 || parent.eUserType == "NORMAL") {
    //   res.send({
    //     result: "NOTPARENT",
    //     reason: "추천아이디는 매장에서 확인해주세요.",
    //   });
    //   return;
    // }
    var user = await db.Users.findOne({ where: { strID: req.body.strID } });
    if (null == user) {
      let nick = await db.Users.findOne({
        where: { strNickname: req.body.strNickname },
      });
      if (null != nick) {
        res.send({ result: "NOTNICKNAME", reason: "닉네임을 확인해주세요." });
        return;
      }

      //   let strGroupID = parent.strGroupID;
      const randomAvatar = Math.floor(Math.random() * 14); // This will generate a random integer between 0 and 41

      await db.Users.create({
        strID: req.body.strID,
        strPassword: req.body.strPassword,
        strNickname: req.body.strNickname,
        iClass: 5,
        strGroupID: 1,
        iParentID: null,
        iRolling: 0,
        fSettle: 0,
        fHoldemR: 0,
        fBig2R: 0,
        fSitgoR: 0,
        fOmahaR: 0,
        fBaccaratR: 0,
        iPoint: 0,
        iCash: 0,
        iPointBase: 0,
        iCashBase: 0,
        strName: req.body.strName,
        eUserType: "NORMAL",
        strEMail: "",
        strImage: "",
        eStatus: "NORMAL",
        eAuthenticated: "NONE",
        iAvatar: randomAvatar,
        iLevel: 0,
        iExp: 0,
        iWin: 0, // Add this field
        iLose: 0, // Add this field for tracking losses
        iTie: 0, // Add this field for tracking ties
        strBank: req.body.strBank,
        strAccount: req.body.strAccount,
        strMobileNo: req.body.strMobileNo,
        strOptionCode: "11110000",
        strIP: ip,
        strDesc: "",
      });

      res.send(object);
    } else {
      res.send({ result: "NOTREGISTER", reason: "아이디가 중복되었습니다." });
    }
  }
});

router.get("/logout", isLoggedIn, async (req, res) => {
  if (req.user != null) {
    await db.Users.update({ bLogin: 0 }, { where: { strID: req.user.strID } });
  }

  req.logout(function (err) {
    if (err) {
      res.redirect("/");
      return next(err);
    }
    // if you're using express-flash
    iLogin = 0;
    req.flash("success_msg", "session terminated");
    res.redirect("/");
  });
});

// router.get('/setting', isLoggedIn, (req, res) => {

//     res.render('account/setting', {iLayout:0, user:req.user});
// });

// router.get('/setting_game', isLoggedIn, (req, res) => {

//     res.render('account/setting_game', {iLayout:0, user:req.user});
// });

// router.get('/setting_profile', isLoggedIn, (req, res) => {

//     res.render('account/setting_profile', {iLayout:0, user:req.user});
// });

// router.get('/setting_system', isLoggedIn, (req, res) => {

//     res.render('account/setting_system', {iLayout:0, user:req.user});
// });

router.post("/request_avatarindex", (req, res) => {
  console.log(`/request_avatarindex`);

  res.send({ result: "OK" });
});

router.post("/request_modifymypage", async (req, res) => {
  console.log(`/request_modifymypage`);

  let user = await db.Users.findOne({ where: { strID: req.body.strID } });
  if (user != null) {
    await user.update({
      strNickname: req.body.strCheckNickname,
      iAvatar: parseInt(req.body.iAvatarIndex),
    });

    res.send({ result: "OK" });
  } else {
    res.send({ result: "Error" });
  }
});

router.post("/request_passwordchange", async (req, res) => {
  console.log("/request_passwordchange");
  console.log(req.body);

  var object = {};

  var user = await db.Users.findOne({ where: { strID: req.body.strID } });
  if (user.strPassword == req.body.newPassword) {
    res.send({ result: "SAMEPASSWORD", reason: "비밀번호가 같습니다." });
    return;
  }
  await user.update({
    strPassword: req.body.newPassword,
  });
  object.result = "OK";
  res.send(object);
});

router.post("/request_changepoint", async (req, res) => {
  console.log(`/request_changepoint`);

  let user = await db.Users.findOne({ where: { strID: req.user.strID } });
  if (user != null) {
    await user.increment({ iCash: req.user.iRolling });
    await user.decrement({ iRolling: req.user.iRolling });
    res.send({ result: "OK" });
  } else {
    res.send({ result: "Error" });
  }
});

router.post("/request_modifysetting", async (req, res) => {
  console.log(`/request_modifysetting`);

  let user = await db.Users.findOne({ where: { strID: req.body.strID } });
  if (user != null) {
    await user.update({
      strOptionCode: req.body.strOptionCode,
    });

    res.send({ result: "OK" });
  } else {
    res.send({ result: "Error" });
  }
});

router.post("/request_input", async (req, res) => {
  console.log(`/request_input`);

  if (req.user == undefined) {
    res.send({ result: "NOTLOGIN", reason: "로그인을 먼저 해주세요." });
    return;
  }

  await db.Inouts.create({
    strID: req.user.strID,
    strNickname: req.user.strNickname,
    iClass: req.user.iClass,
    strGroupID: req.user.strGroupID,
    strDepositor: req.user.strName,
    iAmount: req.body.iAmount,
    eType: "INPUT",
    eState: "STANDBY",
  });
  //let user = await db.Users.findOne({where:{strID:req.body.strID}});
  //const user = await db.Users.increment({iCash:parseInt(req.body.iAmount)}, {where:{strID:req.user.strID}, returning:true, plain:true});

  //console.log(user);

  res.send({ result: "OK" });
  try {
    let objectData = {
      eType: 0,
      strID: req.user.strID,
      iAmount: req.body.iAmount,
    };

    //const customAxios = axios.create({});
    const strAddress = `${global.strAddress}/alert`;
    const response = await axios.post(strAddress, objectData);
    //const response = await customAxios.post('http://localhost:3000/alert', objectData, {headers:{ 'Accept-Encoding': 'application/json'}});
    console.log(response);
    console.log(response.data);
    if (response.data.result == "OK")
      return { result: "OK", data: response.data };
    else return { result: "error", error: response.data.error };
  } catch (error) {
    return { result: "error", error: "axios" };
  }
});

router.post("/request_output", async (req, res) => {
  console.log(`/request_output`);

  await db.Inouts.create({
    strID: req.user.strID,
    strNickname: req.user.strNickname,
    iClass: req.user.iClass,
    strGroupID: req.user.strGroupID,
    strDepositor: req.user.strName,
    iAmount: req.body.iAmount,
    eType: "OUTPUT",
    eState: "STANDBY",
  });

  //let user = await db.Users.findOne({where:{strID:req.body.strID}});
  //const user =

  //console.log(user);
  await db.Users.decrement(
    { iCash: parseInt(req.body.iAmount) },
    { where: { strID: req.user.strID }, returning: true, plain: true }
  );
  res.send({ result: "OK" });
  try {
    let objectData = {
      eType: 1,
      strID: req.user.strID,
      iAmount: req.body.iAmount,
    };

    //const customAxios = axios.create({});
    const strAddress = `${global.strAddress}/alert`;
    const response = await axios.post(strAddress, objectData);
    //const response = await customAxios.post('http://localhost:3000/alert', objectData, {headers:{ 'Accept-Encoding': 'application/json'}});
    console.log(response);
    console.log(response.data);
    if (response.data.result == "OK") {
      return { result: "OK", data: response.data };
    } else return { result: "error", error: response.data.error };
  } catch (error) {
    return { result: "error", error: "axios" };
  }
});

router.post("/request_autoAccount", async (req, res) => {
  console.log(`/request_autoAccount`);
  console.log(req.body);

  // let admin = await db.Users.findOne({where:{iClass:0}});
  var user = await db.Users.findOne({ where: { strID: req.user.strID } });
  let strGroupID = await GetParentStrGroupID(user.strGroupID, 1);
  console.log(strGroupID);
  let parent = await db.Users.findOne({ where: { strGroupID: strGroupID } });
  console.log(parent.strID);
  if (req.user == null) res.send({ result: "Error" });

  await db.Letters.create({
    strTo: parent.strID,
    strToNickname: parent.strNickname,
    strFrom: req.user.strID,
    strFromNickname: req.user.strNickname,
    strSubject: "계좌 문의",
    strContents: "계좌 문의",
    strAnswer: "",
    eState: "UNREAD",
    eType: "CONSULTING",
  });
  res.send({ result: "OK" });
  try {
    let objectData = { eType: 2, strID: req.user.strID };

    const strAddress = `${global.strAddress}/alert`;
    const response = await axios.post(strAddress, objectData);
    console.log(response);
    console.log(response.data);
    if (response.data.result == "OK")
      return { result: "OK", data: response.data };
    else return { result: "error", error: response.data.error };
  } catch (error) {
    return { result: "error", error: "axios" };
  }
});

router.post("/request_checkid", async (req, res) => {
  console.log(`/request_checkid`);
  console.log(req.body);

  const user = await db.Users.findOne({ where: { strID: req.body.strID } });
  console.log(user);

  if (user != null) {
    res.send({ result: "Exist" });
  } else res.send({ result: "OK" });
});

router.post("/request_checknickname", async (req, res) => {
  console.log(`/request_checknickname`);
  console.log(req.body);

  const user = await db.Users.findOne({
    where: { strNickname: req.body.strCheckNickname },
  });
  if (user != null) {
    res.send({ result: "Exist" });
  } else res.send({ result: "OK" });
});

router.post("/request_pointchange", async (req, res) => {
  console.log(`/request_pointchange`);
  console.log(req.user);

  const user = await db.Users.findOne({ where: { strID: req.user.strID } });
  let changePoint = user.iCash + user.iPoint;
  console.log(changePoint);
  if (user != null) {
    await user.update({
      iPoint: changePoint,
      iCash: 0,
    });
    res.send({ result: "OK" });
  } else {
    res.send({ result: "ERROR" });
  }
});

router.post("/request_inspection", async (req, res) => {
  console.log(`/request_inspection`);
  //console.log(req.user);

  const setting = await db.Settings.findOne({ where: { id: 1 } });
  console.log({ setting });

  if (setting != null) {
    res.send({ result: "OK", data: setting });
  } else {
    res.send({ result: "ERROR", reason: "No Data" });
  }
});

let GetParentStrGroupID = async (strGroupID, iTargetClass) => {
  // iTargetClass가 3이면 strGroupID의 길이는 9, 10 이상이면 strGroupID 그대로 return
  // 2이면 7, 1이면 5가 되어야 합니다.
  let requiredLength = 2 * iTargetClass + 3;
  if (typeof strGroupID === "string" && strGroupID.length === requiredLength) {
    // Class 당 2자리를 제거하고 남은 문자열을 반환합니다.
    return strGroupID.substring(0, requiredLength - 2);
  } else {
    return strGroupID;
  }
};

module.exports = router;
