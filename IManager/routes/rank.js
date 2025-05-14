const express = require('express');
const passport = require('passport');
const router = express.Router();

const axios = require('axios');
var moment = require('moment');

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '..', 'public')));

const db = require('../db');
const ITime = require('../utils/time');
const {Op, and, Sequelize}= require('sequelize');
const { Console } = require('console');


router.get('/ranklist', async (req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('rank/ranklist', {type:0, user:req.user});
});

router.post('/request_ranklist', async (req, res) => {

    console.log(`/request_ranklist`);
    console.log(req.body);

    var object = {};

    let tagState = `('HOLDEM', 'BIG2', 'BACCARAT')`;
    let strGame = '';
    if(req.body.gameTypeFilter != '')
    {
        tagState = `('${req.body.gameTypeFilter}')`;
        strGame = req.body.gameTypeFilter;
    }
    else
    {
        strGame = 'ALL';
    }
    // get today's date
    let date = new Date();
    let dateStart = date.toISOString().split('T')[0];
    // 나중에 strGame별로 나눠야함, RecordBet에 추가해야할듯.
    const [data] = await db.sequelize.query(`
        SELECT 
            MAX(U.iRolling) as iPoint,
            MAX(U.iCash) as iCash,  
            MAX(U.iCashBase - U.iCash) as iRankCash,
            MAX((U.iCashBase - U.iCash) + (U.iPointBase - U.iRolling)) as iRankMoney,
            MAX(U.strGroupID) as strGroupID, 
            U.strID, 
            MAX(U.strNickname) as strNickname, 
            MAX(U.eUserType) as eUserType,
            SUM(R.iAmount) as iBetMoney
        FROM 
            Users U
        LEFT JOIN 
            RecordBets R 
            ON U.strID = R.strID
        WHERE 
            DATE(R.updatedAt) >= :dateStart
        GROUP BY 
            U.strID
        ORDER BY 
            iRankCash DESC
    `, { replacements: { dateStart: dateStart }});

    for(let i = 0; i < data.length; i++) {
        let strGroupID = data[i].strGroupID;
        let ids = [];
        for(let j = 1; j <= 5; j++) {
            let sliceIndex = j + (j - 1); // 잘라내기 시작할 인덱스를 계산
            let groupId = strGroupID.slice(0, sliceIndex);
    
            // strGroupID를 이용해 Users 테이블에서 strID를 조회
            const results = await db.sequelize.query(`
                SELECT strID
                FROM Users
                WHERE strGroupID = :groupId 
                AND eUserType = 'AGENT'
            `, { replacements: { groupId: groupId }, type: db.sequelize.QueryTypes.SELECT });
             // 쿼리 결과가 있을 경우만 처리
            if(results && results[0] && results.length > 0) {
                ids.push(results[0].strID);
            }
        }
        // ids 배열을 '<'로 연결하여 하나의 문자열로 만듦
        let groupHierarchy = ids.join('<');
        // strGroupID를 새로운 문자열로 업데이트
        data[i].strGroupID = groupHierarchy;
        data[i].iRank = i + 1; // 순위 부여 (1-based index)
        data[i].strGame = tagState;
    }

    // const [data] = await db.sequelize.query(`
    //     SELECT 
    //         U.iPoint as iPoint,
    // U.iCash as iCash,  
    // U.iCashBase - U.iCash as iRankCash,
    // U.iPointBase - U.iPoint as iRankMoney,
    // U.strGroupID, 
    // U.strID, 
    // U.strNickname, 
    // U.eUserType,
    // SUM(R.iAmount) as iBetMoney
    //     FROM 
    //         Users U
    //     LEFT JOIN 
    //         RecordBets R 
    //         ON U.strID = R.strID
    //     WHERE 
    //         DATE(R.date) >= :dateStart
    //     AND
    //         R.GameType IN ${tagState}
    //     GROUP BY 
    //         U.strID
    //     ORDER BY 
    //         iRankCash DESC
    // `, { replacements: { dateStart: dateStart }, type: db.sequelize.QueryTypes.SELECT });
    
    object.draw = req.body.draw;
    object.recordsTotal = data.length;
    object.recordsFiltered = data.length;
    object.data = data;
    console.log(object.data);
    res.send(JSON.stringify(object));
});

router.post('/request_lettersend', async (req, res) => {

    console.log(`/request_lettersendall`);
    console.log(req.body);
    let userTo = await db.Users.findOne({where:{strID:req.body.strTo}});

    if ( req.user == null )
        res.send({result:'Error'});

    await db.Letters.create(
        {
            strTo:req.body.strTo,
            strToNickname:userTo.strNickname,
            strFrom:req.user.strID,
            strFromNickname:req.user.strNickname,
            strContents:req.body.strContents,
            eState:'UNREAD',
            eType:'LETTER',
        }
    );

    res.send({result:'OK'});
});

module.exports = router;