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


router.get('/input', async (req, res) => {
    console.log("input");
    console.log(req.body);
    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('sale/input', {type:0, user:req.user});
});

router.post('/inputlist', async (req, res) => {

    console.log('/inputlist');
    console.log(req.body);

    var data = [];
    //var list_count = 0;
    var full_count = 0;
    
    var strTimeStart = req.body.startDate;
    var strTimeEnd = req.body.endDate;
    //console.log("start : " + req.body.start);
    //console.log("startDate : "+ moment(strTimeStart).format('YYYY-MM-DD hh:mm:ss') + " endDate : "+ moment(strTimeEnd).format('YYYY-MM-DD hh:mm:ss'));

    //console.log(moment(strTimeStart).startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment(strTimeEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss'));
    let filter = [];

    if ( req.body.userTypeFilter == '')
    {
        filter.push('STANDBY');
        filter.push('COMPLETE');
        filter.push('CANCEL');
    }
    else
        filter.push(req.body.userTypeFilter);

    var querydatas = await db.Inouts.findAll({
        order: [['id', 'DESC']],
         where:{
            [Op.and]:[{
                 createdAt:{[Op.between]:[ moment(strTimeStart).startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment(strTimeEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss')]},
                 eState:{[Op.or]:filter},
                 eType:{[Op.or]:['INPUT']}
            }]
        }
    });
    full_count = querydatas.length;

    for (var i in querydatas )
    {
        data.push({
            number:querydatas.length-i,
            id:querydatas[i].id,
            strID:querydatas[i].strID,
            strNickname:querydatas[i].strID,
            iClass:querydatas[i].iClass,
            strGroupID:querydatas[i].strGroupID,
            iAmount:querydatas[i].iAmount,
            strDepositor:querydatas[i].strDepositor,
            strMobileNo:querydatas[i].strGroupID,
            createdAt:querydatas[i].createdAt,
            eState:querydatas[i].eState
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
    res.send(JSON.stringify(object));

});

router.post('/inoutlistgrouptoday', async (req, res) => {

    console.log('/inoutlistgrouptoday');
    console.log(req.body);

    var strTimeStart = ITime.getTimeStamp(0);
    var strTimeEnd = ITime.getTimeStamp(0);

    var charges = await db.Inouts.findAll({
        attributes: [
            [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), '%Y-%m-%d'), 'dates'],
            [db.sequelize.fn('SUM', db.sequelize.literal("CASE WHEN eType = 'INPUT' THEN iAmount ELSE 0 END")), 'input_amount'],
            [db.sequelize.fn('SUM', db.sequelize.literal("CASE WHEN eType = 'OUTPUT' THEN iAmount ELSE 0 END")), 'output_amount'],
            [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN eType = 'INPUT' THEN 1 ELSE NULL END")), 'input_count'],
            [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN eType = 'OUTPUT' THEN 1 ELSE NULL END")), 'output_count'],
        ],
        group: ['dates'],
        where: {
            createdAt: {
                [Op.between]: [strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            eState: 'COMPLETE',
            eType: {
                [Op.or]: ['INPUT', 'OUTPUT']
            },
            strGroupID: {
                [Op.like]: req.user.strGroupID + '%'
            }
        },
        raw: true
    });

    console.log(`*********************** charges length :${charges.length}`);

    for ( var i in charges)
    {
        console.log(charges[i]);
        console.log(`createdAt : ${charges[i].dates}, input_amount : ${charges[i].input_amount}, output_amount : ${charges[i].output_amount}`);
    }

    var object = {};
    object.draw = req.body.draw || 1; // Fallback to 1 if draw is not provided

    // Check if there are any records
    if (charges.length > 0) {
        // If there are records, use them
        object.recordsTotal = charges.length;
        object.recordsFiltered = charges.length;
        object.data = charges;
    } else {
        // If there are no records, send zero values
        object.recordsTotal = 0;
        object.recordsFiltered = 0;
        object.data = [{
            dates: '', // or a placeholder date
            input_amount: 0,
            output_amount: 0,
            input_count: 0,
            output_count: 0
        }];
    }

    res.send(JSON.stringify(object));
});

router.post('/cashpointlistgrouptoday', async (req, res) => {

    console.log('/cashpointlistgrouptoday');
    console.log(req.body);

    var strTimeStart = ITime.getTimeStamp(0);
    var strTimeEnd = ITime.getTimeStamp(0);

    var charges = await db.Inouts.findAll({
        attributes: [
            [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), '%Y-%m-%d'), 'dates'],
            [db.sequelize.fn('SUM', db.sequelize.literal("CASE WHEN eType = 'PGIVE' THEN iAmount ELSE 0 END")), 'pgive_amount'],
            [db.sequelize.fn('SUM', db.sequelize.literal("CASE WHEN eType = 'TAKE' THEN iAmount ELSE 0 END")), 'take_amount'],
            [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN eType = 'PGIVE' THEN 1 ELSE NULL END")), 'pgive_count'],
            [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN eType = 'TAKE' THEN 1 ELSE NULL END")), 'take_count'],
        ],
        group: ['dates'],
        where: {
            createdAt: {
                [Op.between]: [strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            eState: 'COMPLETE',
            eType: {
                [Op.or]: ['PGIVE', 'TAKE']
            },
            strGroupID: {
                [Op.like]: req.user.strGroupID + '%'
            }
        },
        raw: true
    });

    console.log(`*********************** charges length :${charges.length}`);

    for ( var i in charges)
    {
        console.log(charges[i]);
        console.log(`createdAt : ${charges[i].dates}, pgive_amount : ${charges[i].input_amount}, take_amount : ${charges[i].output_amount}`);
    }

    var object = {};
    object.draw = req.body.draw || 1; // Fallback to 1 if draw is not provided

    // Check if there are any records
    if (charges.length > 0) {
        // If there are records, use them
        object.recordsTotal = charges.length;
        object.recordsFiltered = charges.length;
        object.data = charges;
    } else {
        // If there are no records, send zero values
        object.recordsTotal = 0;
        object.recordsFiltered = 0;
        object.data = [{
            dates: '', // or a placeholder date
            pgive_amount: 0,
            take_amount: 0,
            pgive_count: 0,
            take_count: 0
        }];
    }

    res.send(JSON.stringify(object));
});

router.post('/saleslistgrouptoday', async (req, res) => {
    console.log('/saleslistgrouptoday');
    console.log(req.body);

    let iClass = req.user.iClass;
    //let groupCondition = iClass == 1 ? '' : (iClass == 4 ? 'AND strID != t2.strID' : 'AND strGroupID != t2.strGroupID');
    let conditionalSumQueries = [];

    // Generate conditional sum queries based on iClass
    for (let classIndex = 1; classIndex <= 5; classIndex++) {
        conditionalSumQueries.push(`
                IFNULL((SELECT SUM(CASE WHEN Users.iClass = ${classIndex} THEN Users.iCash ELSE 0 END) FROM Users WHERE Users.strGroupID LIKE CONCAT(t2.strGroupID, '%')), 0) as iTotal${['PAdmin', 'VAdmin', 'Agent', 'Shop', 'User'][classIndex - 1]}Money,
                IFNULL((SELECT SUM(CASE WHEN Users.iClass = ${classIndex} THEN Users.iRolling ELSE 0 END) FROM Users WHERE Users.strGroupID LIKE CONCAT(t2.strGroupID, '%')), 0) as iTotal${['PAdmin', 'VAdmin', 'Agent', 'Shop', 'User'][classIndex - 1]}Point`);
    }

    let conditionalSums = conditionalSumQueries.join(',');

    let query = `
        SELECT
        t2.id as id,
        t2.strID as strID,
        t2.strNickname as strNickname,
        t2.iClass as iClass,
        t2.iCash as iMyMoney,
        t2.iRolling as iMyRolling,
        t2.fBreakage as fBreakage,
        IFNULL((SELECT SUM(Jackpots.iJackpot) FROM Jackpots), 0) as TotalJackpot,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%')), 0) as total_amount,
        IFNULL((SELECT SUM(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID, '%')), 0) as total_point,
        ${conditionalSums}
        FROM
            Users AS t1
            LEFT JOIN Users AS t2 ON t2.id = t1.id
        WHERE
            t2.iClass = '${iClass}' AND t1.strGroupID LIKE CONCAT('${req.user.strGroupID}', '%');
    `;

    let [list] = await db.sequelize.query(query);
    
    full_count = list.length;

    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = full_count;
    object.recordsFiltered = full_count;
    object.data = list;

    res.send(JSON.stringify(object));
});

router.post('/inputlistgroup', async (req, res) => {

    console.log('/inputlistgroup');
    console.log(req.body);


    let filter = [];
    if ( req.body.userTypeFilter == '')
    {
        filter.push('STANDBY');
        filter.push('COMPLETE');
        filter.push('CANCEL');
    }
    else
        filter.push(req.body.userTypeFilter);

    var strTimeStart = req.body.startDate;
    var strTimeEnd = req.body.endDate;

    var charges = await db.Inouts.findAll({
        attributes: [
            [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), '%Y-%m-%d'), 'dates'],
            [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'total_amount'],
            [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'total_count'],
        ],
        //group: [db.sequelize.fn('DAY', db.sequelize.col('createdAt'))]
        group:'dates',
        raw:true,
        where:{
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            eState:{
                [Op.or]:filter,
            }
        }
    });

    console.log(`*********************** charges length :${charges.length}`);

    for ( var i in charges)
    {
        console.log(charges[i]);
        console.log(`createdAt : ${charges[i].createdAt}, total_amount : ${charges[i].total_amount}`);
    }

    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = charges.length;
    //object.recordsFiltered = list_count;
    object.recordsFiltered =  charges.length;
    object.data = charges;

//    console.log(object);

    //res.send({data:list});
    //res.send(object);
    res.send(JSON.stringify(object));

});


router.post('/inputdetail', async (req, res) => {

    //console.log("? " + req.body);

    const input = await db.Inouts.findOne({where:{id:req.body.id}});
    if ( input != null )
    {
        let result = {result:'OK', id:req.body.id, state:input.eState};

        console.log(result);

        res.send(result);
    }
    else
        res.send({result:'FAIL', reason:'조회 실패'});
});

router.post('/inputcomplete', async (req, res) => {

    //console.log(req.body);

    const input = await db.Inouts.findOne({where:{id:req.body.id}});
    let result ={};
    console.log(input.strID);
    if ( input != null )
    {
        if( req.user.iCash >= input.iAmount)
        {
            let user = await db.Users.findOne({where:{strID:input.strID}});
            let strGroupID = await GetParentStrGroupID(user.strGroupID,1);
            console.log(strGroupID);
            let parent = await db.Users.findOne({where:{strGroupID:strGroupID}});
            console.log(parent.strID);
            // let parent = await db.Users.findOne({where:{strID:req.user.strID}});
            if ( user != null )
            {
                if (req.body.state == 'COMPLETE') {
                    console.log(input.strID);

                    console.log("COMPLETE");
                    //let total = user.iCash + parseInt(input.iAmount);

                    await user.increment({ iCash: parseInt(input.iAmount) });
                    await parent.decrement({ iCash: parseInt(input.iAmount) });
                    //await user.update({iCash:total})
                    await input.update({ eState: req.body.state, strGivename: parent.strNickname, eUserType: user.eUserType });
                    result = { result: 'OK' }
                    let objectAxios = { strNickname: user.strNickname, iAmount: user.iCash };

                    axios.post(`${global.strLobbyAddress}/UpdateCoin`, objectAxios)
                        .then((response) => {
                            //console.log('axios success /UpdateCoin');
                            console.log(`Axios Success /UpdateCoin : ${user.iCash}`);
                            //console.log(response);
                        })
                        .catch((error) => {
                            console.log('axios Error /UpdateCoin');
                            //console.log(error);
                        });
                }
                else if(req.body.state == 'CANCEL')
                {
                    console.log("CANCEL");
                    await input.update({eState:req.body.state, strGivename:parent.strNickname, eUserType:user.eUserType});
                    result = {result:'OK'}
                }
                else
                {
                    console.log("STANDBY");
                    result = {result:'OK'}
                }
            }
            else
            {
                result = {result:'NOID'}
            }
        }
        else
        {
            result = {result:'NOMONEY', reason:'보유머니가 부족합니다.'}
        }

        res.send(result);
    }
    else
        res.send({result:'FAIL', reason:'조회 실패'});
});

//  Output


router.get('/output', async (req, res) => {
    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('sale/output', {type:0, user:req.user});
});

router.post('/outputlist', async (req, res) => {

    console.log('/outputlist');
    //console.log(req.body);

    var data = [];
    var list_count = req.body.length;
    var full_count = 0;
    
    var strTimeStart = req.body.startDate;
    var strTimeEnd = req.body.endDate;
    //console.log("start : " + req.body.start);
    //console.log("startDate : "+ moment(strTimeStart).format('YYYY-MM-DD hh:mm:ss') + " endDate : "+ moment(strTimeEnd).format('YYYY-MM-DD hh:mm:ss'));

    let filter = [];
    if ( req.body.userTypeFilter == '')
    {
        filter.push('STANDBY');
        filter.push('COMPLETE');
        filter.push('CANCEL');
    }
    else
        filter.push(req.body.userTypeFilter);

    var querydatas = await db.Inouts.findAll({
        order: [['id', 'DESC']],
        where:{
            [Op.and]:[{
                createdAt:{[Op.between]:[ moment(strTimeStart).startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment(strTimeEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss')]},
                eState:{[Op.or]:filter},
                eType:{[Op.or]:['OUTPUT']}
           }]
        }
    });

    full_count = querydatas.length;

    for (var i in querydatas )
    {
        data.push({
            number:querydatas.length-i,
            id:querydatas[i].id,
            strID:querydatas[i].strID,
            strNickname:querydatas[i].strID,
            iClass:querydatas[i].iClass,
            strGroupID:querydatas[i].strGroupID,
            iAmount:querydatas[i].iAmount,
            strDepositor:querydatas[i].strDepositor,
            strMobileNo:querydatas[i].strGroupID,
            createdAt:querydatas[i].createdAt,
            eState:querydatas[i].eState
        });
    }
    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = full_count;
    object.recordsFiltered = list_count;
    //object.recordsFiltered = full_count;
    object.data = data;

    console.log(object);

    res.send(JSON.stringify(object));
});


router.post('/outputlistgrouptoday', async (req, res) => {

    console.log('/outputlistgrouptoday');
    console.log(req.body);

    var strTimeStart = ITime.getTimeStamp(0);
    var strTimeEnd = ITime.getTimeStamp(0);

    var charges = await db.Inouts.findAll({
        attributes: [
            [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), '%Y-%m-%d'), 'dates'],
            [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'total_amount'],
            [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'total_count'],
        ],
        //group: [db.sequelize.fn('DAY', db.sequelize.col('createdAt'))]
        group:'dates',
        raw:true,
        where:{
            createdAt:{
                [Op.between]:[ strTimeStart, require('moment')(strTimeEnd).add(1, 'days').format('YYYY-MM-DD')],
            },
            // eState:{
            //     [Op.or]:filter,
            // }
        }
    });

    console.log(`*********************** charges length :${charges.length}`);

    for ( var i in charges)
    {
        console.log(charges[i]);
        console.log(`createdAt : ${charges[i].createdAt}, total_amount : ${charges[i].total_amount}`);
    }

    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = charges.length;
    //object.recordsFiltered = list_count;
    object.recordsFiltered =  charges.length;
    object.data = charges;

//    console.log(object);

    //res.send({data:list});
    //res.send(object);
    res.send(JSON.stringify(object));

});

router.post('/outputlistgroup', async (req, res) => {

    console.log('/outputlistgroup');
    console.log(req.body);


    let filter = [];
    if ( req.body.userTypeFilter == '')
    {
        filter.push('STANDBY');
        filter.push('COMPLETE');
        filter.push('CANCEL');
    }
    else
        filter.push(req.body.userTypeFilter);

    var strTimeStart = req.body.startDate;
    var strTimeEnd = req.body.endDate;

    var charges = await db.Inouts.findAll({
        attributes: [
            [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), '%Y-%m-%d'), 'dates'],
            [db.sequelize.fn('SUM', db.sequelize.col('iAmount')), 'total_amount'],
            [db.sequelize.fn('COUNT', db.sequelize.col('iAmount')), 'total_count'],
        ],
        //group: [db.sequelize.fn('DAY', db.sequelize.col('createdAt'))]
        group:'dates',
        raw:true,
        where:{
            createdAt:{
                [Op.between]:[ moment(strTimeStart).startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment(strTimeEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss')],
            },
            eState:{
                [Op.or]:filter,
            }
        }
    });

    console.log(`*********************** charges length :${charges.length}`);

    for ( var i in charges)
    {
        console.log(charges[i]);
        console.log(`createdAt : ${charges[i].createdAt}, total_amount : ${charges[i].total_amount}`);
    }

    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = charges.length;
    //object.recordsFiltered = list_count;
    object.recordsFiltered =  charges.length;
    object.data = charges;

//    console.log(object);

    //res.send({data:list});
    //res.send(object);
    res.send(JSON.stringify(object));
});


router.post('/outputdetail', async (req, res) => {

    console.log(req.body);

    const output = await db.Inouts.findOne({where:{id:req.body.id}});
    if ( output != null )
    {
        let result = {result:'OK', id:req.body.id, state:output.eState};

        console.log(result);

        res.send(result);
    }
    else
        res.send({result:'FAIL', reason:'조회 실패'});
});

router.post('/outputcomplete', async (req, res) => {

    console.log(req.body);

    const output = await db.Inouts.findOne({where:{id:req.body.id}});
    if ( output != null )
    {
        let user = await db.Users.findOne({where:{strID:output.strID}});
        let strGroupID = await GetParentStrGroupID(user.strGroupID,1);
        console.log(strGroupID);
        let parent = await db.Users.findOne({where:{strGroupID:strGroupID}});
        console.log(parent.strID);
        // let admin = await db.Users.findOne({where:{strID:req.user.strID}});
        let result = {result:'OK'};
        if(user.iCash >= 0)
        {
            if ( req.body.state == 'COMPLETE' )
            {
                //await user.decrement({iCash:parseInt(output.iAmount)});
                await parent.increment({iCash:parseInt(output.iAmount)});
            }
            else if ( req.body.state == 'CANCEL' )
            {
                await user.increment({iCash:parseInt(output.iAmount)}, {where:{strID:output.strID}});
            }

            await output.update({eState:req.body.state, strGivename:parent.strNickname, eUserType:user.eUserType});
        }
        else
        {
            result = {result:'NOMONEY', reason:'유저의 보유머니를 확인해주세요.'};
        }
        console.log(result);

        res.send(result);
    }
    else
        res.send({result:'FAIL', reason:'조회 실패'});
});
router.get('/agentordercash', async (req, res) => {
    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('sale/agentordercash', {type:0, user:req.user});
});
router.get('/userordercash', async (req, res) => {
    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('sale/userordercash', {type:0, user:req.user});
});
router.get('/agentorderpoint', async (req, res) => {
    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('sale/agentorderpoint', {type:0, user:req.user});
});
router.get('/userorderpoint', async (req, res) => {
    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('sale/userorderpoint', {type:0, user:req.user});
});

router.get('/monthlist', async (req, res) => {
    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('sale/monthlist', {type:0, user:req.user});
});

router.post('/findmonthlist', async (req, res) => {
    console.log('/findmonthlist');
    var list_count = req.body.length;
    var strMonth = req.body.strMonth;
    var strGroupID = req.user.strGroupID;
    console.log(strGroupID);
    var object = {};
    if ( req.user.iClass == 0 )
    {
        //  Admin
        const [list] = await db.sequelize.query(`
        SELECT 
            date,
            COALESCE(total_input, 0) as total_input,
            COALESCE(total_output, 0) as total_output,
            COALESCE(total_take, 0) as total_take,
            COALESCE(total_give, 0) as total_give,
            COALESCE(total_rolling, 0) as total_rolling,
            COALESCE(jackpot_difference, 0) as jackpot_difference,
            (COALESCE(total_input, 0) + COALESCE(total_give, 0) - COALESCE(total_output, 0) - COALESCE(total_take, 0)) as total_amount,
            (COALESCE(total_input, 0) + COALESCE(total_give, 0) - COALESCE(total_output, 0) - COALESCE(total_take, 0) + COALESCE(total_rolling, 0) + COALESCE(jackpot_difference, 0)) as total_money
        FROM 
            (SELECT 
                date_format(t1.startAt, '%Y-%m-%d') as date,
                SUM(CASE WHEN t2.eType = 'INPUT' AND t2.eState = 'COMPLETE' THEN t2.iAmount ELSE 0 END) as total_input,
                SUM(CASE WHEN t2.eType = 'OUTPUT' AND t2.eState = 'COMPLETE' THEN t2.iAmount ELSE 0 END) as total_output,
                SUM(CASE WHEN t2.eType = 'TAKE' AND t2.eState = 'COMPLETE' THEN t2.iAmount ELSE 0 END) as total_take,
                SUM(CASE WHEN t2.eType = 'PGIVE' AND t2.eState = 'COMPLETE' THEN t2.iAmount ELSE 0 END) as total_give,
                (SELECT SUM(rr.iRollingAdmin)
                FROM RecordRollings rr
                WHERE date_format(rr.updatedAt, '%Y-%m-%d') = date) as total_rolling,
                (SELECT SUM(iJackpotFeeAmount) - SUM(iJackpot)
                FROM RecordResults rr
                WHERE date_format(rr.updatedAt, '%Y-%m-%d') = date) as jackpot_difference
            FROM 
                Calendar t1 
            LEFT JOIN 
                Inouts t2 ON date_format(t1.startAt, '%Y-%m-%d') = date_format(t2.updatedAt, '%Y-%m-%d')
            WHERE 
                t1.startAt LIKE CONCAT('${strMonth}', '%')
            GROUP BY 
                date
            ) as sub;`
        );
        object.data = list;
        full_count = list.length;
    }
    console.log(object.data);
    object.draw = req.body.draw;
    object.recordsTotal = full_count;
    object.recordsFiltered = list_count;

    //console.log(object);
    res.send(JSON.stringify(object));
});

router.get('/bettinglist', async (req, res) => {
    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('sale/bettinglist', {type:0, user:req.user});
});

let GetRolling = async (strGroupID, strTimeStart, strTimeEnd) => {
    var querydatas = await db.RecordBets.findAll({
        order: [['id', 'DESC']],
        attributes: [
            [db.sequelize.literal('IFNULL(SUM(iRollingPAdmin),0)'),'total_iRollingPAdmin'],
            [db.sequelize.literal('IFNULL(SUM(iAmount),0)'),'total_iAmount']
        ],
        where:{
                createdAt:{[Op.between]:[ moment(strTimeStart).startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment(strTimeEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss')]},
                strGroupID:{[Op.like]:strGroupID+'%'},
            }
    });
    console.log(querydatas);
    return querydatas;
}
let GetRollingChildren = async (strGroupID, iMyClass, dateStart, dateEnd) => {

    var iTargetClass = iMyClass + 1;
    console.log(`##### GetChildren strGroupID (${strGroupID}), iTargetClass (${iTargetClass})`);
    if(iMyClass == 0)
    {
        var [list] = await db.sequelize.query(`
        SELECT  t2.*,
        IFNULL((SELECT sum(iRollingPAdmin) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as total_RollingMoney,
        IFNULL((SELECT sum(iAmount) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as total_iAmount
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass='${iTargetClass}' AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%');`
        );
    }
    else if(iMyClass == 1)
    {
        var [list] = await db.sequelize.query(`
        SELECT  t2.*,
        IFNULL((SELECT sum(iRollingVAdmin) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as total_RollingMoney,
        IFNULL((SELECT sum(iAmount) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as total_iAmount
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass='${iTargetClass}' AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%');`
        );
    }
    else if(iMyClass == 2)
    {
        var [list] = await db.sequelize.query(`
        SELECT  t2.*,
        IFNULL((SELECT sum(iRollingAgent) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as total_RollingMoney,
        IFNULL((SELECT sum(iAmount) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as total_iAmount
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass='${iTargetClass}' AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%');`
        );
    }
    else if(iMyClass == 3)
    {
        var [list] = await db.sequelize.query(`
        SELECT  t2.*,
        IFNULL((SELECT sum(iRollingShop) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as total_RollingMoney,
        IFNULL((SELECT sum(iAmount) FROM RecordBets WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as total_iAmount
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass='${iTargetClass}' AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%');`
        );
    }
    else if(iMyClass == 4)
    {
        var [list] = await db.sequelize.query(`
        SELECT  t2.*,
        0 as total_RollingMoney,
        IFNULL((SELECT sum(iAmount) FROM RecordBets WHERE strID LIKE t2.strID AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as total_iAmount
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        WHERE t2.iClass='${iTargetClass}' AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%');`
        );
    }
    return list;
}

let RecursiveGetRollingChildren = async (strGroupID, iMyClass, dateStart, dateEnd, list) =>
{
    let children = await GetRollingChildren(strGroupID, iMyClass, dateStart, dateEnd);
    for ( let i in children )
    {
        list.push(children[i]);
        console.log(`==========> Pushed ${children[i].strID}`);
        //await RecursiveGetChildren(children[i].strGroupID, parseInt(children[i].iClass), dateStart, dateEnd, list);
    }
}

router.post('/findbettinglist', async (req, res) => {

    //var data = [];
    //var list_count = 0;
    var full_count = 0;
    var strTimeStart = req.body.startDate;
    var strTimeEnd = req.body.endDate;
    //console.log("start : " + req.body.start);
    //console.log("startDate : "+ moment(strTimeStart).format('YYYY-MM-DD hh:mm:ss') + " endDate : "+ moment(strTimeEnd).format('YYYY-MM-DD hh:mm:ss'));

    let listPAdmin = await db.Users.findAll({where:{iClass:1}});

    let listObject = [];

    for ( let i in listPAdmin )
    {
        let datas = await GetRolling(listPAdmin[i].strGroupID, strTimeStart, strTimeEnd);

        listObject.push({strID:listPAdmin[i].strID, strName:listPAdmin[i].strName, fHoldemR:listPAdmin[i].fHoldemR, datas});
    }

    full_count = listObject.length;
    //console.log(listObject.total_iRollingPAdmin);
    //console.log(listObject.datas.RecordBets.total_iRollingPAdmin);

    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = full_count;
    //object.recordsFiltered = list_count;
    object.recordsFiltered = full_count;
    object.data = listObject;

    //console.log(object);

    //res.send({data:list});
    //res.send(object);
    res.send(listObject);
});

router.post('/bettinglog', async (req, res) => {
    console.log(req.body);

    var data = [];
    var strID = req.body.strID;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;

    var querydatas = await db.RecordBets.findAll({
        order: [['id', 'DESC']],
        where: {
            strID: {
                [Op.like]:[strID]
            },
            createdAt: {
                [Op.between]: [moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss')]
            }
        }
    });

    let count = 0;

for (var i in querydatas)
    {
        // iAmount가 0인 경우 skip
        if (querydatas[i].iAmount == 0) {
            continue;
        }
        data.push({
            iGame:0,
            iBetting:querydatas[i].iAmount,
            strBet:querydatas[i].strBet,
        });

        count++;
        if (count >= 200) {  // Maximum 200 items
            break;
        }
    }
    console.log(querydatas);

    //res.send({data:list});
    //res.send(object);
    res.send(data);
});

router.post('/bettingdetail', async (req, res) => {

    // let children = await db.Users.findAll({where:{iParentID:req.body.id}});
    // for ( let i in children )
    // {
    //     console.log(`child [${i}] : strID : ${children[i].strID}`);
    // }


    console.log("? " + req.body.id);

    const parentID = await db.Users.findOne({where:{strID:req.body.id}});
    var data = [];
    let listChildren = [];
    console.log("? ??" + parentID.iClass);

    var startDate = moment(req.body.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss'); 
    var endDate = moment(req.body.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');

    await RecursiveGetRollingChildren(parentID.strGroupID, parentID.iClass, startDate, endDate, listChildren);

    full_count = listChildren.length;

    for (var i in listChildren )
    {
        data.push({
            strID:listChildren[i].strID,
            strName:listChildren[i].strName,
            iAmount:listChildren[i].total_iAmount,
            iRolling:listChildren[i].total_RollingMoney,
            fHoldemR:listChildren[i].fHoldemR
        });
    }
    if ( parentID != null && parentID.iClass !=5)
    {
        let result = {result:'OK', data};

        console.log(result);

        res.send(result);
    }
    else
        res.send({result:'FAIL', reason:'더이상에 하부는 없습니다.'});
});

router.get('/inputcharge', async (req, res) => {
    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('sale/inputcharge', {type:0, user:req.user});
});
router.post('/inputchargelist', async (req, res) => {
    var data = [];
    //var list_count = 0;
    var full_count = 0;
    var strID = req.user.strID;
    var querydatas = await db.Inouts.findAll({
        order: [['id', 'DESC']],
        where:{
            [Op.and]:[{
                 strID:{[Op.like]:[strID]},
                 eType:{[Op.like]:['INPUT']}
            }]
        }
    });
    full_count = querydatas.length;

    for (var i in querydatas )
    {
        data.push({
            iChargeMoney:querydatas[i].iAmount,
            strDepositor:querydatas[i].strDepositor,
            strChargeDate:querydatas[i].createdAt,
            eState:querydatas[i].eState
        });
    }
    console.log(querydatas);
    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = full_count;
    //object.recordsFiltered = list_count;
    object.recordsFiltered = full_count;
    object.data = data;

    console.log(object);

    //res.send({data:list});
    //res.send(object);
    res.send(JSON.stringify(object));
});

let IsSameGroup = (strGroupID1, strGroupID2) => {

    if ( strGroupID1 != undefined && strGroupID2 != undefined )
    {
        let strBaseGroupID = '';
        let strTargetGroupID = '';

        if ( strGroupID1.length > strGroupID2.length )
        {
            strBaseGroupID = strGroupID2;
            strTargetGroupID = strGroupID1;
        }
        else
        {
            strBaseGroupID = strGroupID1;
            strTargetGroupID = strGroupID2;
        }

        strTargetGroupID = strTargetGroupID.substring(0, strBaseGroupID.length);

        console.log(`IsSameGroup ${strBaseGroupID}, ${strTargetGroupID}`);

        if ( strTargetGroupID == strBaseGroupID )
            return true;
        
        // for ( let i in strBaseGroupID )
        // {
        //     if ( strBaseGroupID[i] != strTargetGroupID[i])
        //     {
        //         return false;
        //     }
        //     return true;
        // }
    }
    return false;
}

router.post('/inputsendcharge', async (req, res) => {

    console.log(`/inputsendcharge`);
    console.log(req.body);
    if(req.body.iAmount <= 0)
    {
        res.send({result:'NOMONEY', reason:'충전금액이 0원입니다.'});
        return;
    }

    for ( let i in global.socket_list )
    {
        if ( IsSameGroup(global.socket_list[i].strGroupID, req.body.strGroupID ) )
            global.socket_list[i].emit('SM_Alert', {eType:0});
    }

    await db.Inouts.create({
        strID:req.user.strID,
        strNickname:req.user.strNickname,
        iClass:req.user.iClass,
        strGroupID:req.user.strGroupID,
        strDepositor:req.user.strID,
        iAmount:req.body.iAmount,
        strGivename:req.user.strNickname,
        eType:'INPUT',
        eState:'STANDBY',
        eUserType:req.user.eUserType
    });

    //let user = await db.Users.findOne({where:{strID:req.body.strID}});
    //const user = await db.Users.increment({iCash:parseInt(req.body.iAmount)}, {where:{strID:req.user.strID}, returning:true, plain:true});

    //console.log(user);

    res.send({result:'OK'});
});

router.get('/outputcharge', async (req, res) => {
    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('sale/outputcharge', {type:0, user:req.user});
});

router.post('/outputchargelist', async (req, res) => {
    var data = [];
    //var list_count = 0;
    var full_count = 0;
    var strID = req.user.strID;
    var querydatas = await db.Inouts.findAll({
        order: [['id', 'DESC']],
        where:{
            [Op.and]:[{
                 strID:{[Op.like]:[strID]},
                 eType:{[Op.like]:['OUTPUT']}
            }]
        }
    });
    full_count = querydatas.length;

    for (var i in querydatas )
    {
        data.push({
            iChargeMoney:querydatas[i].iAmount,
            strChargeDate:querydatas[i].createdAt,
            eState:querydatas[i].eState
        });
    }
    console.log(querydatas);
    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = full_count;
    //object.recordsFiltered = list_count;
    object.recordsFiltered = full_count;
    object.data = data;

    console.log(object);

    //res.send({data:list});
    //res.send(object);
    res.send(JSON.stringify(object));
});

router.post('/outputsendcharge', async (req, res) => {

    console.log(`/outputsendcharge`);
    console.log(req.body);
    if(req.body.iAmount <= 0)
    {
        res.send({result:'NOMONEY', reason:'충전금액이 0원입니다.'});
        return;
    }
    else if(req.body.strName == '')
    {
        res.send({result:'NONAME',reason:'입금자명을 써주세요.'});
        return;
    }

    for ( let i in global.socket_list )
    {
        if ( IsSameGroup(global.socket_list[i].strGroupID, req.body.strGroupID ) )
            global.socket_list[i].emit('SM_Alert', {eType:1});
    }

    await db.Inouts.create({
        strID:req.user.strID,
        strNickname:req.user.strNickname,
        iClass:req.user.iClass,
        strGroupID:req.user.strGroupID,
        strDepositor:req.user.strID,
        strGivename:req.user.strNickname,
        iAmount:req.body.iAmount,
        eType:'OUTPUT',
        eState:'STANDBY',
        eUserType:req.user.eUserType
    });

    //let user = await db.Users.findOne({where:{strID:req.body.strID}});
    const user = await db.Users.decrement({iCash:parseInt(req.body.iAmount)}, {where:{strID:req.user.strID}, returning:true, plain:true});

    console.log(user);

    res.send({result:'OK'});
});

router.post('/request_recordgt', async (req, res) => {

    console.log('/request_recordgt');
    console.log(req.body);

    let eType = req.body.eType;
    let eUserType = req.body.eUserType;

    var startDate = req.body.startDate;
    var endDate = req.body.endDate;

    var gives = await db.Inouts.findAll({
        where:{
            createdAt:{
                [Op.between]:[ moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss')],
            },
            strGroupID:{[Op.like]:req.user.strGroupID+'%'},
            eType:{ [Op.like]: eType },
            eUserType:{ [Op.like]: eUserType }
        }
    });

    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = gives.length;
    //object.recordsFiltered = list_count;
    object.recordsFiltered = gives.length;
    object.data = gives;

    res.send(JSON.stringify(object));
});

router.post('/request_autoAccount', async (req, res) => {

    console.log(`/request_autoAccount`);
    console.log(req.body);

    // let admin = await db.Users.findOne({where:{strID:'admin'}});
    var user = await db.Users.findOne({where:{strID:req.user.strID}});
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
            strSubject:'계좌 문의',
            strContents:'계좌 문의',
            strAnswer:'',
            eState:'UNREAD',
            eType:'CONSULTING',
        }
    );
    for ( let i in global.socket_list )
    {
        if ( global.socket_list[i].strID == parent.strID )
            global.socket_list[i].emit('SM_Alert', {eType:2});
    }
    res.send({result:'OK'});
});

router.get('/saleslist', async (req, res) => {
    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('sale/saleslist', {type:0, user:req.user});
});

router.post('/request_saleslist', async (req, res) => {
    console.log('/list');
    console.log(req.body);

    let iClass = req.user.iClass;

    let strSales = '';
    let strSalesChild = '';
    if (iClass == 0) {
        strSales = 'iRollingAdmin';
        strSalesChild = 'iRollingPAdmin+iRollingVAdmin+iRollingAgent+iRollingShop+iRollingUser';
    } else if (iClass == 1) {
        strSales = 'iRollingPAdmin';
        strSalesChild = 'iRollingVAdmin+iRollingAgent+iRollingShop+iRollingUser';
    } else if (iClass == 2) {
        strSales = 'iRollingVAdmin';
        strSalesChild = 'iRollingAgent+iRollingShop+iRollingUser';
    } else if (iClass == 3) {
        strSales = 'iRollingAgent';
        strSalesChild = 'iRollingShop+iRollingUser';
    } else if (iClass == 4) {
        strSales = 'iRollingShop';
        strSalesChild = 'iRollingUser';
    } else {
        strSales = 'iRollingUser';
        strSalesChild = 'iRollingUser';
    }
    // 검색 조건: strID 또는 strNickname
    //let searchCondition = search ? `(t2.strID = '${search}' OR t2.strNickname = '${search}')` : '';
    let groupCondition = iClass == 4 ? 'AND strID != t2.strID' : 'AND strGroupID != t2.strGroupID';

    const [list] = await db.sequelize.query(`
        SELECT
        t2.id as id,
        t2.strID as strID,
        t2.strNickname as strNickname,
        t2.iClass as iClass,
        t2.iCash as iMyMoney,
        t2.iRolling as iMyRolling,
        t2.fHoldemR as fHoldemR,
        t2.fSitgoR as fSitgoR,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND iClass != 0),0) as iTotalMoney,
        IFNULL((SELECT SUM(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND iClass != 0),0) as iTotalPoint,
        IFNULL((SELECT SUM(iAmount) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'HOLDEM' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'), 0) as iTotalBetsHoldem,
        IFNULL((SELECT SUM(iAmount) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'), 0) as iTotalBetsSitgo,
        IFNULL((SELECT SUM(iWinCoin) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'HOLDEM'AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'), 0) as iTotalWinsHoldem,
        IFNULL((SELECT SUM(iWinCoin) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'), 0) as iTotalWinsSitgo,
        IFNULL((SELECT SUM(${strSales}) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'HOLDEM' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'), 0) as iTotalRollingHoldem,
        IFNULL((SELECT SUM(${strSales}) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'), 0) as iTotalRollingSitgo,
        IFNULL((SELECT SUM(${strSalesChild}) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'HOLDEM' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'), 0) as iTotalRollingChildHoldem,
        IFNULL((SELECT SUM(${strSalesChild}) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${req.body.dateStart}' AND '${req.body.dateEnd}'), 0) as iTotalRollingChildSitgo,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND iClass = ${parseInt(iClass+1)}), 0) as iAgentCount
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.id = t1.id
        WHERE t2.iClass = '${iClass}' AND t1.strGroupID LIKE CONCAT('${req.user.strGroupID}', '%');`
    );
            
    full_count = list.length;

    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = full_count;
    object.recordsFiltered = full_count;
    object.data = list;

    console.log(object.data);
    res.send(JSON.stringify(object));
});

let GetChildren = async (strGroupID, iTargetClass, dateStart, dateEnd, search) => {

    let strSales = '';
    let strSalesChild = '';
    if (iTargetClass == 0) {
        strSales = 'iRollingAdmin';
        strSalesChild = 'iRollingPAdmin+iRollingVAdmin+iRollingAgent+iRollingShop+iRollingUser';
    } else if (iTargetClass == 1) {
        strSales = 'iRollingPAdmin';
        strSalesChild = 'iRollingVAdmin+iRollingAgent+iRollingShop+iRollingUser';
    } else if (iTargetClass == 2) {
        strSales = 'iRollingVAdmin';
        strSalesChild = 'iRollingAgent+iRollingShop+iRollingUser';
    } else if (iTargetClass == 3) {
        strSales = 'iRollingAgent';
        strSalesChild = 'iRollingShop+iRollingUser';
    } else if (iTargetClass == 4) {
        strSales = 'iRollingShop';
        strSalesChild = 'iRollingUser';
    } else {
        strSales = 'iRollingUser';
        strSalesChild = 'iRollingUser';
    }
    // 검색 조건: strID 또는 strNickname
    let searchCondition = search ? `(t2.strID = '${search}' OR t2.strNickname = '${search}')` : '';
    let groupCondition = iTargetClass == 4 ? 'AND strID != t2.strID' : 'AND strGroupID != t2.strGroupID';
    let [list] = [[]];
    if(iTargetClass <= 4)
        [list] = await db.sequelize.query(`
            SELECT
            t2.id as id,
            t2.strID as strID,
            t2.strNickname as strNickname,
            t2.iClass as iClass,
            t2.iCash as iMyMoney,
            t2.iRolling as iMyRolling,
            t2.fHoldemR as fHoldemR,
            t2.fHoldemR as fSitgoR,
            IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
            IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
            IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND iClass != 0),0) as iTotalMoney,
            IFNULL((SELECT SUM(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND iClass != 0),0) as iTotalPoint,
            IFNULL((SELECT SUM(iAmount) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'HOLDEM' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalBetsHoldem,
            IFNULL((SELECT SUM(iAmount) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalBetsSitgo,
            IFNULL((SELECT SUM(iWinCoin) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'HOLDEM' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalWinsHoldem,
            IFNULL((SELECT SUM(iWinCoin) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalWinsSitgo,
            IFNULL((SELECT SUM(${strSales}) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'HOLDEM' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalRollingHoldem,
            IFNULL((SELECT SUM(${strSales}) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalRollingSitgo,
            IFNULL((SELECT SUM(${strSalesChild}) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'HOLDEM' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalRollingChildHoldem,
            IFNULL((SELECT SUM(${strSalesChild}) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalRollingChildSitgo,
            IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND iClass = ${parseInt(iTargetClass+1)}), 0) as iAgentCount
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            WHERE t2.iClass = '${iTargetClass}' AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%') ${searchCondition ? `AND ${searchCondition}` : ''};`
        );
    else
        [list] = await db.sequelize.query(`
            SELECT
            t2.id as id,
            t2.strID as strID,
            t2.strNickname as strNickname,
            t2.iClass as iClass,
            t2.iCash as iMyMoney,
            t2.iRolling as iMyRolling,
            t2.fHoldemR as fHoldemR,
            t2.fHoldemR as fSitgoR,
            IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strID=t2.strID AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
            IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strID=t2.strID AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
            0 as iTotalMoney,
            0 as iTotalPoint,
            IFNULL((SELECT SUM(iAmount) FROM RecordRollings WHERE strID=t2.strID AND eGameType = 'HOLDEM' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalBetsHoldem,
            IFNULL((SELECT SUM(iAmount) FROM RecordRollings WHERE strID=t2.strID AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalBetsSitgo,
            IFNULL((SELECT SUM(iWinCoin) FROM RecordRollings WHERE strID=t2.strID AND eGameType = 'HOLDEM' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalWinsHoldem,
            IFNULL((SELECT SUM(iWinCoin) FROM RecordRollings WHERE strID=t2.strID AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalWinsSitgo,
            IFNULL((SELECT SUM(${strSales}) FROM RecordRollings WHERE strID=t2.strID AND eGameType = 'HOLDEM' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalRollingHoldem,
            IFNULL((SELECT SUM(${strSales}) FROM RecordRollings WHERE strID=t2.strID AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalRollingSitgo,
            0 as iTotalRollingChildHoldem,
            0 as iTotalRollingChildSitgo,
            0 as iAgentCount
            FROM Users AS t1
            LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
            WHERE t2.iClass = '${iTargetClass}' AND t1.strGroupID LIKE CONCAT('${strGroupID}', '%') ${searchCondition ? `AND ${searchCondition}` : ''};`
        );
    return list;
}

let RecursiveGetChildren = async (strGroupID, iTargetClass, dateStart, dateEnd, search, list, bChild) =>
{
    if ( parseInt(iTargetClass) >= 5  && bChild == false) return;
    
    let children = await GetChildren(strGroupID, parseInt(iTargetClass+1), dateStart, dateEnd, search);
    for ( let i in children )
    {
        list.push(children[i]);
    }
}

router.post('/request_saleslistchild', async(req, res) => {

    console.log('/request_saleslistchild');
    console.log(req.body);

    //console.log(`strID : ${req.user.strID}, iClass : ${req.user.iClass}, strGroupID : ${req.user.strGroupID}`);
    var user = await db.Users.findOne({where:{id:req.body.id}});
    let iTargetClass = 0;
    let message = '';
    let result = '';

    if (user.iClass >= 5) {
        // Send a message if user.iClass is 4.
        //res.send({result:'NotChild', reason:'더 이상의 하부는 없습니다.'});
        iTargetClass = parseInt(user.iClass);
        message = '더 이상의 하부는 없습니다.';
        result = 'NotChild';
    }
    else
    {
        iTargetClass = parseInt(user.iClass);
        result = 'OK';
    }

    var data = [];
    let listAgents = [];
    
    await RecursiveGetChildren(user.strGroupID, iTargetClass, req.body.dateStart, req.body.dateEnd, req.body.search, listAgents, true);

    // 이 부분에서 start와 length를 사용해야 합니다.
    let start = req.body.start; // Ajax 요청에서 시작 인덱스를 가져옵니다.
    let length = req.body.length; // Ajax 요청에서 가져올 데이터의 수를 가져옵니다.

    // 잘라낸 배열을 사용해 data를 채웁니다.
    for (let i = start; i < start + length && i < listAgents.length; i++) {
        data.push(listAgents[i]);
    }

    let totalRecords = await db.Users.count();  // 전체 레코드 수를 얻는 쿼리

    let filteredRecords = listAgents.length;

    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = totalRecords;
    object.recordsFiltered = filteredRecords;
    object.data = data;
    object.message = message;
    object.result = result;

    res.send(JSON.stringify(object));
});

let GetParent = async (strGroupID, iTargetClass, dateStart, dateEnd, search) => {
    let strSales = '';
    let strSalesChild = '';
    if (iTargetClass == 0) {
        strSales = 'iRollingAdmin';
        strSalesChild = 'iRollingPAdmin+iRollingVAdmin+iRollingAgent+iRollingShop+iRollingUser';
    } else if (iTargetClass == 1) {
        strSales = 'iRollingPAdmin';
        strSalesChild = 'iRollingVAdmin+iRollingAgent+iRollingShop+iRollingUser';
    } else if (iTargetClass == 2) {
        strSales = 'iRollingVAdmin';
        strSalesChild = 'iRollingAgent+iRollingShop+iRollingUser';
    } else if (iTargetClass == 3) {
        strSales = 'iRollingAgent';
        strSalesChild = 'iRollingShop+iRollingUser';
    } else if (iTargetClass == 4) {
        strSales = 'iRollingShop';
        strSalesChild = 'iRollingUser';
    } else {
        strSales = 'iRollingUser';
        strSalesChild = 'iRollingUser';
    }
	// 검색 조건: strID 또는 strNickname
    let searchCondition = search ? `(t2.strID = '${search}' OR t2.strNickname = '${search}')` : '';
    let groupCondition = iTargetClass == 4 ? 'AND strID != t2.strID' : 'AND strGroupID != t2.strGroupID';
    let strParentGroupID = await GetParentStrGroupID(strGroupID,iTargetClass-1);

    const [list] = await db.sequelize.query(`
        SELECT
        t2.id as id,
        t2.strID as strID,
        t2.strNickname as strNickname,
        t2.iClass as iClass,
        t2.iCash as iMyMoney,
        t2.iRolling as iMyRolling,
        t2.fHoldemR as fHoldemR,
        t2.fHoldemR as fSitgoR,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'INPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}' ),0) as iInput,
        IFNULL((SELECT sum(iAmount) FROM Inouts WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND eState = 'COMPLETE' AND eType = 'OUTPUT' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'),0) as iOutput,
        IFNULL((SELECT SUM(iCash) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND iClass != 0),0) as iTotalMoney,
        IFNULL((SELECT SUM(iRolling) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND iClass != 0),0) as iTotalPoint,
        IFNULL((SELECT SUM(iAmount) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'HOLDEM' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalBetsHoldem,
        IFNULL((SELECT SUM(iAmount) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalBetsSitgo,
        IFNULL((SELECT SUM(iWinCoin) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'HOLDEM' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalWinsHoldem,
        IFNULL((SELECT SUM(iWinCoin) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalWinsSitgo,
        IFNULL((SELECT SUM(${strSales}) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'HOLDEM' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalRollingHoldem,
        IFNULL((SELECT SUM(${strSales}) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalRollingSitgo,
        IFNULL((SELECT SUM(${strSalesChild}) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'HOLDEM' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalRollingChildHoldem,
        IFNULL((SELECT SUM(${strSalesChild}) FROM RecordRollings WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') ${groupCondition} AND eGameType = 'SITGO' AND date(createdAt) BETWEEN '${dateStart}' AND '${dateEnd}'), 0) as iTotalRollingChildSitgo,
        IFNULL((SELECT COUNT(*) FROM Users WHERE strGroupID LIKE CONCAT(t2.strGroupID,'%') AND iClass = ${parseInt(iTargetClass+1)}), 0) as iAgentCount
        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.id = t1.id
        WHERE t2.iClass = '${iTargetClass}' AND t2.strGroupID LIKE CONCAT('${strParentGroupID}', '%') ${searchCondition ? `AND ${searchCondition}` : ''};`
    );

    return list;
}

let RecursiveGetParent = async (strGroupID, iTargetClass, dateStart, dateEnd, search, list) =>
{
    if ( parseInt(iTargetClass) >= 5 )
    //if ( iTargetClass > 0 )
        return;
    
    let parent = await GetParent(strGroupID, parseInt(iTargetClass), dateStart, dateEnd, search);
    for ( let i in parent )
    {
        list.push(parent[i]);
        //console.log(`==========> Pushed ${children[i].strID}`);
        //await RecursiveGetChildren(children[i].strGroupID, parseInt(children[i].iClass), dateStart, dateEnd, list);
    }
}

let GetParentStrGroupID = async (strGroupID, iTargetClass) =>
{  
    console.log(`GetParentStrGroupID`);
    console.log(strGroupID, iTargetClass);
    if (iTargetClass <= 0) {
        return strGroupID.substring(0, 1);
    }
    // iTargetClass가 3이면 strGroupID의 길이는 9, 길이 10 넘으면 else로 가서 strGroupID 그대로 return
    // 2이면 7, 1이면 5가 되어야 합니다.
    let requiredLength = 2 * iTargetClass + 3;
    if (typeof strGroupID === 'string' && strGroupID.length === requiredLength) {
        // Class 당 2자리를 제거하고 남은 문자열을 반환합니다.
        return strGroupID.substring(0, requiredLength - 2);
    } else {
        return strGroupID;
    }
}

router.post('/request_saleslistparent', async(req, res) => {

    console.log('/request_saleslistparent');
    console.log(req.body);

    //console.log(`strID : ${req.user.strID}, iClass : ${req.user.iClass}, strGroupID : ${req.user.strGroupID}`);
    var user = await db.Users.findOne({where:{id:req.body.id}});
    let iTargetClass = 0;
    let message = '';
    let result = '';
    console.log(user.iClass,req.user.iClass);

    if (user.iClass <= req.user.iClass) {
        // Send a message if user.iClass is 4.
        //res.send({result:'NotChild', reason:'더 이상의 하부는 없습니다.'});
        iTargetClass = parseInt(user.iClass);
        message = '상부를 조회할 수 있는 권한이 없습니다.';
        result = 'NotParent';
    }
    else
    {
        iTargetClass = parseInt(user.iClass) - 1;
        result = 'OK';
    }
    let strGroupID = await GetParentStrGroupID(user.strGroupID,iTargetClass);

    var data = [];
    let listAgents = [];
    
    await RecursiveGetParent(strGroupID, iTargetClass, req.body.dateStart, req.body.dateEnd, req.body.search, listAgents);

    // 이 부분에서 start와 length를 사용해야 합니다.
    let start = req.body.start; // Ajax 요청에서 시작 인덱스를 가져옵니다.
    let length = req.body.length; // Ajax 요청에서 가져올 데이터의 수를 가져옵니다.

    // 잘라낸 배열을 사용해 data를 채웁니다.
    for (let i = start; i < start + length && i < listAgents.length; i++) {
        data.push(listAgents[i]);
    }

    let totalRecords = await db.Users.count();  // 전체 레코드 수를 얻는 쿼리

    let filteredRecords = listAgents.length;

    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = totalRecords;
    object.recordsFiltered = filteredRecords;
    object.data = data;
    object.message = message;
    object.result = result;

    res.send(JSON.stringify(object));
});

router.get('/jackpotlist', async (req, res) => {
    console.log("jackpotlist");
    console.log(req.body);
    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('sale/jackpotlist', {type:0, user:req.user});
});

router.post('/request_jackpotlist', async (req, res) => {
    console.log('/request_jackpotlist');
    console.log(req.body);

    var data = [];
    var strTimeStart = req.body.startDate;
    var strTimeEnd = req.body.endDate;
    var start = parseInt(req.body.start); // Pagination start index
    var length = parseInt(req.body.length); // Number of records per page

    try {
        var querydatas = await db.Results.findAll({
            order: [['id', 'DESC']],
            where: {
                [Op.and]: [{
                    createdAt: {
                        [Op.between]: [moment(strTimeStart).startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment(strTimeEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss')]
                    },
                    iJackpot: {[Op.gt]: 0},
                }]
            },
            offset: start, // Pagination offset
            limit: length // Pagination limit
        });

        for (let record of querydatas) {
            let combinedWinnerIds = record.strWinner.split(','); // strWinner를 쉼표로 분리
            let combinedWinnerNicknames = [];
        
            for (let combinedId of combinedWinnerIds) {
                let winnerId = combinedId.split(':')[0].trim(); // 콜론으로 분리하여 ID 추출
                let user = await db.Users.findOne({ where: { strID: winnerId } });
        
                if (user) {
                    combinedWinnerNicknames.push(user.strNickname); // 닉네임 추가
                }
            }
        
            // ID와 닉네임을 쉼표로 결합
            let finalWinnerIds = combinedWinnerIds.join(',');
            let finalWinnerNicknames = combinedWinnerNicknames.join(',');
        
            data.push({
                createdAt: record.createdAt,
                strID: finalWinnerIds,
                strNickname: finalWinnerNicknames,
                iBlind: record.iBlind,
                iJackpot: record.iJackpot
            });
        }

        var full_count = await db.Results.count({
            where: {
                [Op.and]: [{
                    createdAt: {
                        [Op.between]: [moment(strTimeStart).startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment(strTimeEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss')]
                    },
                    iJackpot: {[Op.gt]: 0},
                }]
            }
        });

        var object = {
            draw: req.body.draw,
            recordsTotal: full_count,
            recordsFiltered: data.length,
            data: data
        };
        console.log(object.data);
        res.send(JSON.stringify(object));
    } catch (error) {
        console.error("Error in /request_jackpotlist: ", error);
        res.status(500).send("Internal Server Error : /request_jackpotlist");
    }
});

module.exports = router;