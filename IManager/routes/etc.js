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


router.get('/letter', async (req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('etc/letter', {type:0, user:req.user});
});

router.post('/request_letterlist', async (req, res) => {

    console.log(`/request_letterlist`);
    console.log(req.body);
    let listStateFilter = ['READED', 'UNREAD'];
    if ( req.body.LetterStateFilter != '' )
    {
        listStateFilter = [];
        listStateFilter.push(req.body.LetterStateFilter);
    }

    var object = {};

    if ( req.body.LetterReadWriteFilter == 'RECEIVED')
    {
        let data = await db.Letters.findAll(
            {
                where:{
                    eType:'LETTER',
                    eState:{[Op.or]:listStateFilter},
                    strTo:req.user.strID
                },
                
            }
        );
        object.draw = req.body.draw;
        object.recordsTotal = data.length;
        object.recordsFiltered = data.length;
        object.data = data;
    }
    else
    {
        let data = await db.Letters.findAll(
            {
                where:{
                    eType:'LETTER',
                    eState:{[Op.or]:listStateFilter},
                    strFrom:req.user.strID
                },
            }
        );
        object.draw = req.body.draw;
        object.recordsTotal = data.length;
        object.recordsFiltered = data.length;
        object.data = data;
    }

    res.send(JSON.stringify(object));
});

router.post('/request_lettersend', async (req, res) => {

    console.log(`/request_lettersend`);
    console.log(req.body);
    
    if( req.body.strTo == 'ALL')
    {
        let listClasses = [];
        for ( let i = 1; i < 6; ++ i )
        {
            if ( i > parseInt(req.user.iClass) )
                listClasses.push(i);
        }
    
        let listReceiver = await db.Users.findAll({
            where: {
                iClass: {
                    [Op.or]: listClasses
                },
                eUserType: {
                    [Op.not]: 'JOKER'
                }
            }
        });
    
        for ( let i in listReceiver )
        {
            await db.Letters.create(
                {
                    strTo:listReceiver[i].strID,
                    strToNickname:listReceiver[i].strNickname,
                    strFrom:req.user.strID,
                    strFromNickname:req.user.strNickname,
                    strContents:req.body.strContents,
                    eState:'UNREAD',
                    eType:'LETTER',
                }
            );
        }
    }
    else
    {
        let userTo = await db.Users.findOne({where:{strID:req.body.strTo}});
        if ( req.user == null || userTo == null)
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
    }

    res.send({result:'OK'});
});

router.post('/request_letterdetail', async (req,res) => {

    console.log('request_letterdetail');
    console.log(req.body);

    let data = await db.Letters.findOne({where:{id:req.body.id}});

    if(data != null && data.strFrom != req.user.strID)
    {
        data.update({eState:"READED"});
    }

    res.send({result:'OK', data:data});
});

router.post('/request_letterremove', async (req, res) => {

    console.log('');
    console.log(req.body);

    await db.Letters.destroy({where:{id:req.body.id}});

    res.send({result:'OK'});
});

router.get('/consulting', async (req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('etc/consulting', {type:0, user:req.user});
});

router.post('/request_consultinglist', async (req, res) => {

    console.log(`/request_consultinglist`);
    console.log(req.body);
    let listStateFilter = ['READED', 'UNREAD'];
    if ( req.body.LetterStateFilter != '' )
    {
        listStateFilter = [];
        listStateFilter.push(req.body.LetterStateFilter);
    }
    var object = {};
    let data = null;
    if(req.user.iClass == 0)
    {
        data = await db.Letters.findAll(
            {
                order: [['id', 'DESC']],
                where:{
                    eType:'CONSULTING',
                    eState:{[Op.or]:listStateFilter},
                    strTo:req.user.strID,
                },
            }
        );
    }
    else
    {
        data = await db.Letters.findAll(
            {
                order: [['id', 'DESC']],
                where:{
                    eType:'CONSULTING',
                    eState:{[Op.or]:listStateFilter},
                    strFrom:req.user.strID,
                },
            }
        );  
    }
    
    object.draw = req.body.draw;
    object.recordsTotal = data.length;
    object.recordsFiltered = data.length;
    object.data = data;

    console.log(data);
    res.send(JSON.stringify(object));
});

router.post('/request_consultingsend', async (req, res) => {

    console.log(`/request_consultingsend`);
    console.log(req.body);
    let consult = await db.Letters.findOne({where:{id:req.body.id}});

    await consult.update(
        {
            strAnswer:req.body.strAnswer,
            eState:'READED',
        }
    );
    res.send({result:'OK'});
    try {
        const customAxios = axios.create({});
        //const response = await axios.post(strAddress, objectData);
        const response = await customAxios.post(`${global.strLobbyAddress}/consultAlert`, {strID:consult.strFrom}, {headers:{ 'Accept-Encoding': 'application/json'}});
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

router.post('/request_consultingdetail', async (req,res) => {

    console.log('request_consultingdetail');
    console.log(req.body);

    let data = await db.Letters.findOne({where:{id:req.body.id}});
    let admin = await db.Users.findOne({where:{strID:req.user.strID}});

    if(data != null && admin != null)
    {
        res.send({result:'OK', data:data, admin:admin});
    }
    else
    {
        res.send({result:'Error'});
    }
});

router.get('/bank', async (req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('etc/bank', {type:0, user:req.user});
});

router.post('/bankregister_setting', async (req, res) => {

    console.log(`/etc/bankregister_setting`);
    console.log(req.body);

    let data = await db.Announcements.findOne({where:{id:req.body.id}});

    if ( data == null )
    {
        res.send({result:'Error', reason:'해당 팝업은 존재 하지 않습니다. 다시확인 바랍니다.'});
    }
    else
    {
        await data.update({eState:req.body.eState});
    }

    res.send({result:'OK'});
});

router.post('/request_banklist', async (req, res) => {

    console.log(`/request_banklist`);
    console.log(req.body);

    var object = {};
    let data = await db.Banks.findAll();
    object.draw = req.body.draw;
    object.recordsTotal = data.length;
    object.recordsFiltered = data.length;
    object.data = data;

    console.log(data);
    res.send(JSON.stringify(object));
});

router.post('/request_bankenablelist', async (req, res) => {

    console.log(`/request_bankenablelist`);
    console.log(req.body);

    var object = {};
    let data = await db.Banks.findAll({where:{eState:'ENABLE'}});
    object.draw = req.body.draw;
    object.recordsTotal = data.length;
    object.recordsFiltered = data.length;
    object.data = data;

    if(data != null)
    {
        res.send({result:'OK', data:data});
    }
    else
    {
        res.send({result:'Error'});
    }
});


module.exports = router;