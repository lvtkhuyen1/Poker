const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));

const db = require('../db');
// const db = require('../models');
// const time = require('../utils/time');
// const {Op}= require('sequelize');

router.post('/request_robot', async (req, res) => {

    console.log(`/request_robot`);
    console.log(req.body);

    try {
        let joker = await db.Users.findOne({ where: { strID: 'specialsh' } });
        let robots = await db.Users.findAll({ where: { eUserType: 'JOKER' } });

        if (robots) {
            for (let robot of robots) {
                await robot.update({ eLocation:'LOBBY' });
            }
            res.send({ result: 'OK', data: robots, jokerCash: joker.iCash });
        } else {
            res.send({ result: 'Error', message: 'No robots found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ result: 'Error', message: 'Internal server error' });
    }
});

router.post('/request_robotenterall', async (req, res) => {

    console.log(`/request_robotenterall`);
    console.log(req.body);

    try {
        let joker = await db.Users.findOne({ where: { strID: 'specialsh' } });
        let robots = await db.Users.findAll({ where: { eUserType: 'JOKER' } });

        if (robots) {
            for (let robot of robots) {
                await robot.update({ eLocation: 'HOLDEM' });
            }
            res.send({ result: 'OK', data: robots, jokerCash: joker.iCash });
        } else {
            res.send({ result: 'Error', message: 'No robots found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ result: 'Error', message: 'Internal server error' });
    }
});

router.post('/request_robotinfo', async (req, res) => {

    console.log(`/request_robot`);
    console.log(req.body);

    //let joker = await db.Users.findOne({where:{strID:'joker'}});
    let robot = await db.Users.findOne({where:{strID:req.body.strID}});
    if ( robot != null )
    {
        await robot.update({ eLocation : 'HOLDEM' });
        res.send({result:'OK', data:robot});
    }
    else
    {
        res.send({result:'Error'});
    }
});

router.post('/request_robotexit', async (req, res) => {

    console.log(`/request_robotexit`);
    console.log(req.body);

    //let joker = await db.Users.findOne({where:{strID:'joker'}});
    let robot = await db.Users.findOne({where:{strID:req.body.strID}});
    if ( robot != null )
    {
        await robot.update({ eLocation : 'LOBBY' });
        res.send({result:'OK', data:robot});
    }
    else
    {
        res.send({result:'Error'});
    }
});

router.post('/request_moneygive', async (req, res) => {
    console.log(`/request_moneygive`);
    console.log(req.body);

    // 요청된 ID와 금액을 얻는다.
    let {strID, amount} = req.body;

    // 숫자만 추출하는 함수
    const extractNumbers = (str) => {
        let numbers = str.match(/\d+/g);
        return numbers ? parseInt(numbers.join('')) : 0;
    };

    // amount에서 숫자만 추출
    amount = extractNumbers(amount);
    
    let joker = await db.Users.findOne({where: {strID:'specialsh'}});
    // 해당 사용자를 찾는다.
    let user = await db.Users.findOne({where: {strID:strID}});

    if(joker.iCash >= amount)
    {
        if(user) {
            // 사용자가 존재하면, 해당 사용자에게 금액을 지급한다.
            await joker.decrement('iCash', {by: parseInt(amount)});
            await user.increment('iCash', {by: parseInt(amount)});
            await db.Inouts.create({
                strID:user.strID,
                strNickname:user.strNickname,
                iClass:user.iClass,
                strGroupID:user.strGroupID,
                strDepositor:user.strName,
                strGivename:joker.strNickname,
                eUserType:user.eUserType,
                iAmount:amount,
                eType:'GIVE',
                eState:'COMPLETE',
            });
            await user.reload();
            await joker.reload();
            res.send({result:'OK', data: user, jokerCash:joker.iCash});
        } else {
            res.send({result:'Error', message: "사용자를 찾을 수 없습니다."});
        }
    }
    else
    {
        res.send({result:'Error', message: "해당 매장에 보유머니가 부족합니다. 확인해주세요."});
    }
});

router.post('/request_moneygiveall', async (req, res) => {
    console.log(`/request_moneygiveall`);
    console.log(req.body);

    // 요청된 금액을 얻는다.
    let {amount} = req.body;

     // 숫자만 추출하는 함수
     const extractNumbers = (str) => {
        let numbers = str.match(/\d+/g);
        return numbers ? parseInt(numbers.join('')) : 0;
    };

    // amount에서 숫자만 추출
    amount = extractNumbers(amount);

    let joker = await db.Users.findOne({where: {strID:'specialsh'}});
    // 모든 사용자를 찾는다.
    let users = await db.Users.findAll({where:{eUserType:'JOKER'}});

    if(joker.iCash >= amount)
    {
        if(users) {
            // 사용자들이 존재하면, 각 사용자에게 금액을 지급한다.
            for(let user of users) {
                await joker.decrement('iCash', {by: parseInt(amount)});
                await user.increment('iCash', {by: parseInt(amount)});
                await db.Inouts.create({
                    strID:user.strID,
                    strNickname:user.strNickname,
                    iClass:user.iClass,
                    strGroupID:user.strGroupID,
                    strDepositor:user.strName,
                    strGivename:joker.strNickname,
                    eUserType:user.eUserType,
                    iAmount:amount,
                    eType:'GIVE',
                    eState:'COMPLETE',
                });
                await user.reload();
                await joker.reload();
            }
            res.send({result:'OK', data: users, jokerCash:joker.iCash});
        } else {
            res.send({result:'Error', message: "사용자를 찾을 수 없습니다."});
        }
    }
    else
    {
        res.send({result:'Error', message: "해당 매장에 보유머니가 부족합니다. 확인해주세요."});
    }
});

router.post('/request_nickname', async (req, res) => {

    console.log(`/request_nickname`);
    console.log(req.body);

    let user = await db.Users.findOne({where:{strID:req.body.strID}});
    const checkNickname = await db.Users.findOne({where:{strNickname:req.body.strNickname}});
    if ( checkNickname != null )
    {
        res.send({result:'Exist'});
    }
    else
    {
        if ( user != null )
        {
            await user.update({
                strNickname:req.body.strNickname
            });

            res.send({result:'OK',data: user});
        }
        else
        {
            res.send({result:'Error'});
        }
    }
});

module.exports = router;