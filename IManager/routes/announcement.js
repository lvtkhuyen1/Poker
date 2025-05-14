const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '..', 'public')));

const db = require('../db');
const ITime = require('../utils/time');
const {Op}= require('sequelize');

const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async(req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
    {
        res.render('announcement/announcement', {type:0, user:req.user});
    }
});

router.post('/annregister', async (req, res) => {
    console.log(`/announcement/register`);
    console.log(req.body);

    // req.body.registerType가 배열인 경우, 첫 번째 요소를 사용
    let registerType = Array.isArray(req.body.registerType) ? req.body.registerType[0] : req.body.registerType;

    // 'EVENT'이면 eType을 'EVENT'로, 그렇지 않으면 'ANN'으로 설정
    let eType = registerType === 'EVENT' ? 'EVENT' : 'ANN';
    let data = await db.Announcements.findOne({where:{id:req.body.id}});

    if (data == null) {
        await db.Announcements.create({
            strSubject: req.body.strSubject,
            strContents: req.body.strContents,
            iClass: req.body.iClass,
            eType: eType
        });
    } else {
        await data.update({
            strSubject: req.body.strSubject,
            strContents: req.body.strContents,
            iClass: req.body.iClass,
            eType: eType
        });
    }

    res.send({result: 'OK'});
});

router.post('/request_announcementlist', async (req, res) => {

    console.log("request_announcementlist");
    console.log(req.body);

    let list = await db.Announcements.findAll({where:{eType:req.body.AnnFilter}});

    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = list.length;
    object.recordsFiltered = list.length;
    object.data = list;

    console.log(object.data);
    res.send(JSON.stringify(object));
});

router.post('/request_main_announcementlist', async (req, res) => {

    let list = await db.Announcements.findAll({
        where: { eType: 'ANN' },
        order: [
            ['id', 'DESC']
        ]
    });

    res.send({result:'OK', data:list});
});

router.post('/request_announcementdetail', async (req, res) => {

    console.log(`/announcement/request_announcementdetail`);
    console.log(req.body);

    let data = await db.Announcements.findOne({where:{id:req.body.id}});

    res.send({result:'OK', data:data});

    // let list = await db.Announcements.findAll();

    // var object = {};
    // object.draw = req.body.draw;
    // object.recordsTotal = list.length;
    // object.recordsFiltered = list.length;
    // object.data = list;

    // res.send(JSON.stringify(object));
});

router.post('/request_announceremove', async (req, res) => {

    console.log('request_announceremove');
    console.log(req.body);

    await db.Announcements.destroy({where:{id:req.body.id}});

    res.send({result:'OK'});
});

router.get('/popup', async(req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
    {
        res.render('announcement/popup', {type:0, user:req.user});
    }
});

router.post('/request_popuplist', async (req, res) => {

    let list = await db.Announcements.findAll({where:{eType:'POPUP'}});

    var object = {};
    object.draw = req.body.draw;
    object.recordsTotal = list.length;
    object.recordsFiltered = list.length;
    object.data = list;

    console.log(object.data);
    res.send(JSON.stringify(object));
});

router.post('/popupregister', upload.single('popupImage'), async (req, res) => {

    console.log(`/announcement/popupregister`);

    const popupName = req.body.popupName;
    console.log(popupName);

    let data = await db.Announcements.findOne({ where: { strSubject: popupName, eType:'POPUP' } });

    if ( data == null )
    {
        res.send({result:'Error', reason:'해당 팝업은 존재 하지 않습니다. 다시확인 바랍니다.'});
    }
    else {
        if (req.file) {
            try {
                const currentTime = new Date(); // 현재 시간 생성
                const timestamp = Math.floor(currentTime.getTime() / 1000); // 밀리초를 제외한 초 단위 타임스탬프
                const newFileName = `${popupName}_${timestamp}${path.extname(req.file.originalname)}`;

                await data.update({ oldImageName:data.newImageName, newImageName:newFileName });
                const formData = new FormData();
                formData.append('image', req.file.buffer, { filename: newFileName });
                formData.append('popupName',popupName);

                console.log(`newFileName : ${newFileName}`);

                const response = await axios.post(`${global.strLobbyAddress}/popup`, formData, {
                    headers: {
                        ...formData.getHeaders(),
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
                    }
                });

                console.log('다른 서버로의 이미지 전송 성공:', response.data);
            } catch (error) {
                console.error('다른 서버로의 이미지 전송 실패:', error);
                return res.redirect('/announcement/popup');
            }
        }
    }

    res.redirect('/announcement/popup');
    //res.send({result:'OK'});
});
router.post('/popupregister_setting', async (req, res) => {

    console.log(`/announcement/popupregister_setting`);
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
module.exports = router;