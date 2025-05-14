const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));

let axios = require('axios');

const db = require('../db');
//const ITime = require('../utils/time');
const {Op}= require('sequelize');

router.get('/', async(req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
    {
        res.render('announcement', {type:0, user:req.user});
    }
});

router.post('/request_announcementlist', async (req, res) => {

    console.log("request_announcementlist");

    if(req.user == undefined)
    {
        return;
    }

    let user = await db.Users.findOne({where:{strID:req.user.strID}});
    console.log(user.iClass);
    let list = await db.Announcements.findAll({
        order: [['id', 'DESC']],
        where: {
            iClass: {[Op.gte]: user.iClass},
            eType:{[Op.like]: 'ANN'}
        }
    });
    console.log(list);
    res.send({result:'OK', data:list});

    // var object = {};
    // object.draw = req.body.draw;
    // object.recordsTotal = 5;
    // object.recordsFiltered = list.length;
    // object.data = list;
    // console.log(object);
    // res.send(JSON.stringify(object));
});

router.post('/request_popuplist', async (req, res) => {
    console.log("request_popuplist");

    if(req.user == undefined) {
        return;
    }

    let user = await db.Users.findOne({where:{strID:req.user.strID}});
    console.log(user.iClass);
    let list = await db.Announcements.findAll({
        order: [['id', 'DESC']],
        where: {
            iClass: {[Op.gte]: user.iClass},
            eType:{[Op.like]: 'POPUP'}
        },
        attributes: ['id', 'strSubject', 'eState', 'newImageName', 'oldImageName']
    });
    console.log(list);
    res.send({result:'OK', data:list});
});

router.post('/request_eventlist', async (req, res) => {

    console.log("request_eventlist");

    if(req.user == undefined)
    {
        return;
    }

    let user = await db.Users.findOne({where:{strID:req.user.strID}});
    console.log(user.iClass);
    let list = await db.Announcements.findAll({
        order: [['id', 'DESC']],
        where: {
            iClass: {[Op.gte]: user.iClass},
            eType:{[Op.like]: 'EVENT'}
        }
    });
    console.log(list);
    res.send({result:'OK', data:list});
});

router.post('/request_announcementdetail', async (req, res) => {

    console.log(`/announcement/request_announcementdetail`);
    console.log(req.body);

    let data = await db.Announcements.findOne({where:{id:req.body.id}});

    res.send({result:'OK', data:data});
});
router.get('/customer', async(req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
    {
        res.render('customer', {type:0, user:req.user});
    }
});

router.post('/request_letterlist', async (req, res) => {

    console.log("/request_letterlist");

    let list = await db.Letters.findAll({
        order: [['id', 'DESC']],
        where: {
            eType: {[Op.like]: 'LETTER'},
            strTo:{[Op.like]: req.user.strID}
        }
    });

    res.send({result:'OK', data:list});
});

router.post('/request_newletterlist', async (req, res) => {

    console.log("/request_newletterlist");

    let list = await db.Letters.findAll({
        order: [['id', 'DESC']],
        where: {
            eType: {[Op.like]: 'LETTER'},
            strTo:{[Op.like]: req.user.strID},
            eState:{[Op.like]: 'UNREAD'}
        }
    });

    res.send({result:'OK', data:list});
});

router.post('/request_letterread', async (req, res) => {

    console.log("/request_letterread");

    let letter = await db.Letters.findOne({where:{id:req.body.id}});

    if(letter != null)
        letter.update({eState:'READED'});

    //res.send({result:'OK', data:list});
});

router.post('/request_customerlist', async (req, res) => {

    console.log("/request_customerlist");

    let list = await db.Letters.findAll({
        order: [['id', 'DESC']],
        where: {
            eType: {[Op.like]: 'CONSULTING'},
            strFrom:{[Op.like]: req.user.strID}
        }
    });
    console.log(list);
    res.send({result:'OK', data:list});
});

router.post('/request_customerdetail', async (req, res) => {

    console.log(`/announcement/request_customerdetail`);
    console.log(req.body);

    let data = await db.Letters.findOne({where:{id:req.body.id}});

    res.send({result:'OK', data:data});
});

router.post('/request_consultingsend', async (req, res) => {

    console.log(`/request_consultingsend`);
    console.log(req.body);

    // let admin = await db.Users.findOne({where:{strID:'admin'}});
    let user = await db.Users.findOne({where:{strID:req.body.strID}});
    let strGroupID = await GetParentStrGroupID(user.strGroupID,1);
    console.log(strGroupID);
    let parent = await db.Users.findOne({where:{strGroupID:strGroupID}});
    console.log(parent.strID);
    if ( req.user == null )
        res.send({result:'Error'});

    await db.Letters.create(
        {
            strTo:parent.strID,
            strToNickname:parent.strNickname,
            strFrom:req.user.strID,
            strFromNickname:req.user.strNickname,
            strSubject:req.body.strSubject,
            strContents:req.body.strContents,
            strAnswer:'',
            eState:'UNREAD',
            eType:'CONSULTING',
        }
    );
    res.send({result:'OK'});
    try {

        let objectData = {eType:2, strID:req.user.strID};

        const customAxios = axios.create({});
        //const response = await axios.post(strAddress, objectData);
        const response = await customAxios.post(`${global.strAddress}/alert`, objectData, {headers:{ 'Accept-Encoding': 'application/json'}});
        console.log(response);
        console.log(response.data);
        if ( response.data.result == 'OK' )
            return {result:'OK', data:response.data};
        else
            return {result:'error', error:response.data.error};    
    }
    catch (error) {

        return {result:'error', error:'axios'};

    }
});

let GetParentStrGroupID = async (strGroupID, iTargetClass) =>
    {  
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