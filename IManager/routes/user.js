const express = require('express');
const passport = require('passport');
const router = express.Router();

const axios = require('axios');

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '..', 'public')));

const db = require('../db');
const ITime = require('../utils/time');
const {Op}= require('sequelize');

var requestIp = require('request-ip');

////////////////////////////////////////////////////////////////////////////////////////////////////
//  #user
router.get('/userlist', async(req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('user/userlist', {type:0, user:req.user});
});

router.post('/request_userlist', async(req, res) => {

    console.log('/list');
    console.log(req.body);

    var data = [];
    // 이 부분에서 start와 length를 사용해야 합니다.
    let start = req.body.start; // Ajax 요청에서 시작 인덱스를 가져옵니다.
    let length = req.body.length; // Ajax 요청에서 가져올 데이터의 수를 가져옵니다.

    // var userTypeFilter = 'NORMAL';
    // var querydatas = null;

    let tagState = `('NORMAL', 'BLOCK', 'QUIT')`;
    if ( req.body.userTypeFilter != '' )
    {
        tagState = `('${req.body.userTypeFilter}')`;
    }

    let tagSearch = ``;
    if ( req.body.search != '' )
    {
        tagSearch = `AND t6.strID = '${req.body.search}'`;
    }
    const [list] = await db.sequelize.query(`
        SELECT 
        t1.strNickname AS lev1, 
        t2.strNickname as lev2, 
        t3.strNickname as lev3, 
        t4.strNickname as lev4, 
        t5.strNickname as lev5, 
        t6.strNickname as lev6, 
        t6.*
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
        WHERE t6.iClass='5' AND t6.strGroupID LIKE CONCAT('${req.user.strGroupID}', '%') AND t6.eStatus IN ${tagState} ${tagSearch};`
    );

     // 잘라낸 배열을 사용해 data를 채웁니다.
    for (let i = start; i < parseInt(start) + parseInt(length) && i < list.length; i++) {
        data.push(list[i]);
    }
            
    let filteredRecords = list.length;

    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = filteredRecords;
    object.recordsFiltered = filteredRecords;
    object.data = data;

    res.send(JSON.stringify(object));
});

router.post('/request_userdetail', async (req, res)=> {

    console.log('/userdetail');
    console.log(req.body);

    var object = {};
    object.result = "OK";
    var user = await db.Users.findOne({where:{strID:req.body.strID}});
    if ( user == null )
    {
        object.result = "사용자 조회 실패";
    }
    else
    {
        //object.data = user; 
        let shop = await db.Users.findOne({where:{id:user.iParentID}});
        //지사 디비 가져오기.
        let agentID = user.strGroupID.substring(0, 3);
        let agent = await db.Users.findOne({where:{strGroupID:agentID}});

        let data = {
            id:user.id,
            strID:user.strID,
            strNickname:user.strNickname,
            strPassword:user.strPassword,
            iPoint:user.iPoint,
            iCash:user.iCash,
            eStatus:user.eStatus,
            strShopID:shop.strNickname,
            strBank:user.strBank,
            strName:user.strName,
            strAccount:user.strAccount,
            strDesc:user.strDesc,
            strAgentID:agent.strNickname,
            iRolling:user.iRolling,
            strIP:user.strIP,
            strIPlogin:user.strIPlogin,
            createdAt:user.createdAt,
            loginedAt:user.loginedAt,
            fBaccaratR:user.fBaccaratR,
            fBig2R:user.fBig2R,
            fSitgoR:user.fSitgoR,
            fHoldemR:user.fHoldemR,
            fOmahaR:user.fOmahaR,
            //fSettle:user.fSettle
        };
        object.data = data;
    }
    res.send(object);
});

router.post('/request_userleave', async (req, res) => {

    var user = await db.Users.findOne({where:{strID:req.body.strID}});
    var object = {};
    object.result = "OK";

    if ( user != null )
    {
        await user.update({eStatus:"QUIT"});
    }

    res.send(object);
});

router.post('/request_checkrolling', async (req, res) => {

    console.log(`/request_checkrolling`);
    console.log(req.body);
    var object = {};
    
    const parent = await db.Users.findOne({where:{strID:req.body.strParentID, iClass:req.body.iClass, strGroupID:{[Op.like]:req.user.strGroupID + '%'}}});
    var games = ['HOLDEM', 'BIG2', 'SITGO', 'OMAHA', 'BACCARAT'];
    var classRange = ['fClass1', 'fClass2', 'fClass3', 'fClass4', 'fClass5'];
    
    var rolling = {};
    for (var i = 0; i < games.length; i++) {
            var game = await db.FeeRanges.findOne({ where: { strGame: games[i] } });
            rolling[games[i]] = game;
        }
    
        var fMax = {};
        var fMin = {};
        for (var j = 0; j < classRange.length; j++) {
            for (var k = 0; k < games.length; k++) {
                var key = games[k];
                fMax[key] = fMax[key] || {};
                fMin[key] = fMin[key] || {};
                fMax[key][classRange[j]] = rolling[key][classRange[j] + 'Max'];
                fMin[key][classRange[j]] = rolling[key][classRange[j] + 'Min'];
            }
        }
    
        if ( parent == null )
        {
            object.result = 'Error';
            object.error = 'NotExistParent';
            res.send(object);
        }
        else
        { 
            var fHoldemRMax = parent.fHoldemR;
            var fHoldemRMin = fMin['HOLDEM'][classRange[req.body.iClass]];
            var fBig2RMax = parent.fBig2R;
            var fBig2RMin = fMin['BIG2'][classRange[req.body.iClass]];
            var fSitgoRMax = parent.fSitgoR;
            var fSitgoRMin = fMin['SITGO'][classRange[req.body.iClass]];
            var fOmahaRMax = parent.fOmahaR;
            var fOmahaRMin = fMin['OMAHA'][classRange[req.body.iClass]];
            var fBaccaratRMax = parent.fBaccaratR;
            var fBaccaratRMin = fMin['BACCARAT'][classRange[req.body.iClass]];
            
            console.log(`fHoldemRMax : ${fHoldemRMax}, fHoldemRMax : ${fHoldemRMin}, fHoldemRMax : ${fBig2RMax}, fHoldemRMax : ${fBig2RMin}`);
            let objectData = {
                fHoldemRMax:fHoldemRMax,
                fHoldemRMin:fHoldemRMin,
                fBig2RMax:fBig2RMax,
                fBig2RMin:fBig2RMin,
                fSitgoRMax:fSitgoRMax,
                fSitgoRMin:fSitgoRMin,
                fOmahaRMax:fOmahaRMax,
                fOmahaRMin:fOmahaRMin,
                fBaccaratRMax:fBaccaratRMax,
                fBaccaratRMin:fBaccaratRMin
            };
            object.result = "OK";
            object.data = objectData;
            res.send(object);
        }
});

router.post('/request_checkid', async (req, res) => {

    console.log(`/request_checkid`);
    console.log(req.body);

    const user = await db.Users.findOne({where:{strID:req.body.strID}});
    if ( user != null )
    {
        res.send({result:'Exist'});
    }
    else
        res.send({result:'OK'});
});

router.post('/request_checknickname', async (req, res) => {

    console.log(`/request_checknickname`);
    console.log(req.body);

    const user = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( user != null )
    {
        res.send({result:'Exist'});
    }
    else
        res.send({result:'OK'});
});

router.post( '/request_fee_change', async (req, res) => {
    console.log('/request_fee_change');
    console.log(req.body);

    var object = {};
    object.result = "OK";

    var user = await db.Users.findOne({ where: { strID: req.body.strID } });
    let parent = await db.Users.findOne({ where: { id: user.iParentID } });

    //console.log(parent);
    if (parent == null) {
        object.result = 'Error';
        object.error = 'NotExistParent';
        res.send(object);
    }
    var fHoldemRMax = parent.fHoldemR;
        var fBig2RMax = parent.fBig2R;
        var fSitgoRMax = parent.fSitgoR;
        var fOmahaRMax = parent.fOmahaR;
        var fBaccaratRMax = parent.fBaccaratR;
        if(parseFloat(req.body.fHoldemR) > parseFloat(fHoldemRMax))
        {
            object.result = 'Error';
            object.error = 'ExistHoldemR';
            object.fHoldemRMax = fHoldemRMax;
            object.fHoldemRMin = 0;
            res.send(object);
            return;
        }
        if(parseFloat(req.body.fBig2R) > parseFloat(fBig2RMax))
        {
            object.result = 'Error';
            object.error = 'ExistBig2R';
            object.fBig2RMax = fBig2RMax;
            object.fBig2RMin = 0;
            res.send(object);
            return;
        }
        if(parseFloat(req.body.fSitgoR) > parseFloat(fSitgoRMax))
        {
            object.result = 'Error';
            object.error = 'ExistSitgoR';
            object.fSitgoRMax = fSitgoRMax;
            object.fSitgoRMin = 0;
            res.send(object);
            return;
        }
        if(parseFloat(req.body.fOmahaR) > parseFloat(fOmahaRMax) )
        {
            object.result = 'Error';
            object.error = 'ExistOmahaR';
            object.fOmahaRMax = fOmahaRMax;
            object.fOmahaRMin = 0;
            res.send(object);
            return;
        }
        if(parseFloat(req.body.fBaccaratR) > parseFloat(fBaccaratRMax))
        {
            object.result = 'Error';
            object.error = 'ExistBaccaratR';
            object.fBaccaratRMax = fBaccaratRMax;
            object.fBaccaratRMin = 0;
            res.send(object);
            return;
        }
    if (null != user) {
        await user.update({
            fHoldemR:req.body.fHoldemR,
            fBig2R:req.body.fBig2R,
            fSitgoR:req.body.fSitgoR,
            fOmahaR:req.body.fOmahaR,
            fBaccaratR:req.body.fBaccaratR,
        });
        res.send(object);
    }
    else {
        object.result = 'Error';
        object.error = 'NotExistUser';
        res.send(object);
    }
});

router.post( '/request_password_change', async (req, res) => {
    console.log('/request_password_change');
    console.log(req.body);

    var object = {};
    object.result = "OK";

    var user = await db.Users.findOne({where:{strID:req.body.strID}});
        if ( null != user )
        {
            await user.update({
                strPassword:req.body.strPassword,
            });
            res.send(object);
        }
        else
        {
            object.result = 'Error';
            object.error = 'NotExistUser';
            res.send(object);
        }
});

router.post( '/request_cashtake', async (req, res) => {
    console.log('/request_cashtake');
    console.log(req.body);

    var object = {};
    object.result = "OK";

    var user = await db.Users.findOne({where:{strID:req.body.strID}});
    let strGroupID = await GetParentStrGroupID(user.strGroupID,1);
    console.log(strGroupID);
    let parent = await db.Users.findOne({where:{strGroupID:strGroupID}});
    console.log(parent.strID);
    //var admin = await db.Users.findOne({where:{strID:req.user.strID}});
    if (null != user) {
        if(user.iCash < req.body.iCash)
        {
            object.result = 'Error';
            object.error = 'OverCash';
            res.send(object);
            return;
        }
        await parent.increment({ iCash: req.body.iCash });
        await user.decrement({ iCash: req.body.iCash });
        await db.Inouts.create({
            strID: user.strID,
            strNickname: user.strNickname,
            iClass: user.iClass,
            strGroupID: user.strGroupID,
            strDepositor: parent.strID,
            iAmount: req.body.iCash,
            strGivename: parent.strNickname,
            eType: 'TAKE',
            eState: 'COMPLETE',
            eUserType:user.eUserType
        });
        res.send(object);
    }
    else {
        object.result = 'Error';
        object.error = 'NotExistUser';
        res.send(object);
    }
});

router.post( '/request_pointsend', async (req, res) => {
    console.log('/request_pointsend');
    console.log(req.body);

    var object = {};
    object.result = "OK";

    var user = await db.Users.findOne({where:{strID:req.body.strID}});
    let strGroupID = await GetParentStrGroupID(user.strGroupID,1);
    console.log(strGroupID);
    let parent = await db.Users.findOne({where:{strGroupID:strGroupID}});
    console.log(parent.strID);
    //var admin = await db.Users.findOne({where:{strID:req.user.strID}});
        if ( null != user )
        {
            if(parent.iRolling < req.body.iRolling)
            {
                object.result = 'Error';
                object.error = 'OverPoint';
                res.send(object);
                return;
            }
            await parent.decrement({iRolling:req.body.iRolling});
            await user.increment({iRolling:req.body.iRolling});
            await db.Inouts.create({
                strID:user.strID,
                strNickname:user.strNickname,
                iClass:user.iClass,
                strGroupID:user.strGroupID,
                strDepositor:parent.strID,
                iAmount:req.body.iRolling,
                strGivename:parent.strNickname,
                eType:'PGIVE',
                eState:'COMPLETE',
                eUserType:user.eUserType
            });
            res.send(object);
        }
        else
        {
            object.result = 'Error';
            object.error = 'NotExistUser';
            res.send(object);
        }
});


router.post('/request_register', async(req, res) => {

    console.log('/request_register');
    console.log(req.body);

    const ip = requestIp.getClientIp(req);

    var object = {};
    object.result = "OK";

    let parent = await db.Users.findOne({where:{strID:req.body.strShopID, iClass:4, strGroupID:{[Op.like]:req.user.strGroupID + '%'}}});

    console.log(parent);
    if ( parent == null )
    {
        object.result = 'Error';
        object.error = 'NotExistParent';
        res.send(object);
    }
    else
    {
        var user = await db.Users.findOne({where:{strID:req.body.strID}});
        var fHoldemRMax = parent.fHoldemR;
        var fBig2RMax = parent.fBig2R;
        var fSitgoRMax = parent.fSitgoR;
        var fOmahaRMax = parent.fOmahaR;
        var fBaccaratRMax = parent.fBaccaratR;
        if(parseFloat(req.body.fHoldemR) > parseFloat(fHoldemRMax))
        {
            object.result = 'Error';
            object.error = 'ExistHoldemR';
            object.fHoldemRMax = fHoldemRMax;
            object.fHoldemRMin = 0;
            res.send(object);
            return;
        }
        if(parseFloat(req.body.fBig2R) > parseFloat(fBig2RMax))
        {
            object.result = 'Error';
            object.error = 'ExistBig2R';
            object.fBig2RMax = fBig2RMax;
            object.fBig2RMin = 0;
            res.send(object);
            return;
        }
        if(parseFloat(req.body.fSitgoR) > parseFloat(fSitgoRMax))
        {
            object.result = 'Error';
            object.error = 'ExistSitgoR';
            object.fSitgoRMax = fSitgoRMax;
            object.fSitgoRMin = 0;
            res.send(object);
            return;
        }
        if(parseFloat(req.body.fOmahaR) > parseFloat(fOmahaRMax) )
        {
            object.result = 'Error';
            object.error = 'ExistOmahaR';
            object.fOmahaRMax = fOmahaRMax;
            object.fOmahaRMin = 0;
            res.send(object);
            return;
        }
        if(parseFloat(req.body.fBaccaratR) > parseFloat(fBaccaratRMax))
        {
            object.result = 'Error';
            object.error = 'ExistBaccaratR';
            object.fBaccaratRMax = fBaccaratRMax;
            object.fBaccaratRMin = 0;
            res.send(object);
            return;
        }
        if ( null == user )
        {
            let nick = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
            if ( null != nick )
            {
                object.result = 'Error';
                object.error = 'ExistNickname';
                res.send(object);
                return;
            }

           
            let strGroupID = parent.strGroupID;
            const randomAvatar = Math.floor(Math.random() * 14); // This will generate a random integer between 0 and 41

            await db.Users.create({
                strID:req.body.strID,
                strPassword:req.body.strPassword,
                strNickname:req.body.strNickname,
                iClass:5,
                strGroupID:strGroupID,
                iParentID:parent.id,
                fSettle:0,
                fHoldemR:req.body.fHoldemR,
                fBig2R:req.body.fBig2R,
                fSitgoR:req.body.fSitgoR,
                fOmahaR:req.body.fOmahaR,
                fBaccaratR:req.body.fBaccaratR,
                iPoint:0,
                iCash:0,
                strName:req.body.strName,
                eUserType:'NORMAL',
                strEMail:'',
                strImage:'',
                eStatus:'NORMAL',
                eAuthenticated:'NONE',
                iAvatar:randomAvatar,
                iLevel:0,
                iExp:0,
                iWin:0,
                iLose:0,
                strDesc:'',
                strBank:req.body.strBank,
                strMobileNo:req.body.strMobileNo,
                strAccount:req.body.strAccount,
                strOptionCode:'11110000',
                iRolling:0,
                iCashBase:0,
                iPointBase:0,
                strIP:ip,
            });
            
            res.send(object);
        }
        else
        {
            object.result = 'Error';
            object.error = 'ExistUser';
            res.send(object);
        }
    }
});

router.get('/recordcash', (req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('user/recordcash', {type:0, user:req.user});

});

let GetRecordCashUser = async (strGroupID, iTargetClass, dateStart, dateEnd) => {

    console.log(`##### GetRecordCashUser strGroupID (${strGroupID}), iClass (${iTargetClass})`);

    const [list] = await db.sequelize.query(`
        SELECT
        t2.id as id,
        t2.strID as strID,
        t2.strNickname as strNickname,
        t2.strGroupID as strGroupID,
        t2.iClass as iClass,
        t2.iCash as iCash,
        t2.iRolling as iPoint,
        t2.createdAt as createdAt,
        t2.updatedAt as updatedAt,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strID = t2.strID AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strID = t2.strID AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass = '${iTargetClass}' AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%');`
    );

    return list;
}

router.post('/request_recordcash', async(req, res) => {

    console.log('/list');
    console.log(req.body);


    let list = await GetRecordCashUser(req.user.strGroupID, 5, req.body.dateStart, req.body.dateEnd);
            
    var iNumDisplay = req.body.length;
    var iNumTotal = list.length;
    
    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = iNumTotal;
    object.recordsFiltered = iNumDisplay;
    object.data = list;

    res.send(JSON.stringify(object));
});

router.post('/request_recordcashuser', async (req, res) => {

    let list = await db.Inouts.findAll({
        where: {  
            createdAt:{
                [Op.between]:[ req.body.dateStart, require('moment')(req.body.dateEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            strID:req.body.strID,
        },
        order:[['createdAt','DESC']]
    });
    res.send({result:'OK', data:list});
});

router.get('/onlineuserlist', async (req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('user/onlineuserlist', {type:0, user:req.user});
});

router.post('/request_onlineuserlist', async(req, res) => {

    let listOnline = [];
    try {
        const response = await axios.post(`${global.strLobbyAddress}/request_onlineuser`);
        console.log(response.data);
        if ( response.data.result == 'OK' )
            listOnline = response.data.list;
    }
    catch (error) {

    }
    console.log('/onlineuserlist');
    console.log(listOnline);

    console.log(req.body);

    var data = [];
    var list_count = req.body.length;
    var full_count = 0;

    // var userTypeFilter = 'NORMAL';
    // var querydatas = null;

    let list2 = [];
    for ( let i in listOnline )
    {
        const [list] = await db.sequelize.query(`
        SELECT 
        t1.strID AS lev1, 
        t2.strID as lev2, 
        t3.strID as lev3, 
        t4.strID as lev4, 
        t5.strID as lev5, 
        t6.strID as lev6, 
        t6.*
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
        WHERE t6.iClass='5' AND t6.strID='${listOnline[i]}' ;`
        );

        if ( list.length > 0 )
            list2.push(list[0]);
    }
            
    full_count = list2.length;


    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = full_count;
    object.recordsFiltered = list_count;
    object.data = list2;

    res.send(JSON.stringify(object));
});

router.post('/register_memo', async (req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
    {
        console.log('/register_memo');
        console.log(req.body);
    
        var object = {};
        object.result = "OK";
    
        var user = await db.Users.findOne({ where: { id: req.body.id } });
        if (null != user) {
            await user.update({strDesc:req.body.strDesc});
            res.send(object);
        }
        else {
            object.result = 'Error';
            object.error = 'NotExistUser';
            res.send(object);
        }
    }
});

router.get('/recorddailycash', (req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('user/recorddailycash', {type:0, user:req.user});
});

router.get('/dailyonlinechart', (req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('user/dailyonlinechart', {type:0, user:req.user});
});

router.get('/recordlogin', (req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('user/recordlogin', {type:0, user:req.user});
});

let GetParentStrGroupID = async (strGroupID, iTargetClass) => {
    // iTargetClass가 3이면 strGroupID의 길이는 9, 10 이상이면 strGroupID 그대로 return
    // 2이면 7, 1이면 5가 되어야 합니다.
    let requiredLength = 2 * iTargetClass + 3;
    if (typeof strGroupID === 'string' && strGroupID.length === requiredLength) {
        // Class 당 2자리를 제거하고 남은 문자열을 반환합니다.
        return strGroupID.substring(0, requiredLength - 2);
    } else {
        return strGroupID;
    }
}

module.exports = router;
