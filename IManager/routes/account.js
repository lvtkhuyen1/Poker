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

router.get('/', async(req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
        res.render('account/index', {type:0, user:req.user});

});

router.get('/login', async(req, res) => {

    res.render('account/login', {type:1, user:req.user, messages:req.flash('error')[0]});

});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',    
    failureRedirect: '/account/login',
    failureFlash: true
}), (req, res) => {

    console.log(`post : /account/login : req.session.messages}`);
});


router.post('/register', async(req, res) => {

    console.log('/register');
    console.log(req.body);

    var object = {};
    object.result = "OK";
    const randomAvatar = Math.floor(Math.random() * 14); // This will generate a random integer between 0 and 30

    var user = await db.Users.findOne({where:{strID:req.body.strID}});
    if ( null == user )
    {
        await db.Users.create({
            strID:req.body.strID,
            strName:req.body.strName,
            strPassword:req.body.strPassword,
            strEMail:req.body.strEMail,
            strNickname:req.body.strNickname,
            strImage:'',
            eStatus:req.body.eState,
            eAuthenticated:'NONE',
            iClass:5,
            iLevel:1,
            iExp:0,
            iRolling:0,
            iPoint:0,
            iCash:0,
            strMobileNo:req.body.strMobileNo,
            iAvartar:randomAvatar
        });
        
        res.send(object);
    }
    else
    {
        await user.update({
            strID:req.body.strID,
            strName:req.body.strName,
            strPassword:req.body.strPassword,
            strEMail:req.body.strEMail,
            strNickname:req.body.strNickname,
            eStatus:req.body.eState,
            eAuthenticated:'NONE',
            iRolling:req.body.iPoint,
            iCash:req.body.iCash,
            strMobileNo:req.body.strMobileNo,
        });
        res.send(object);

        console.log(`/regi`);

        let data = {strLoginID:req.body.LoginID, iPoint:req.body.iPoint};
        axios.post('http://localhost:3000/updateinfo', data).catch((error)=> {

        });
    }
});

router.get('/logout', (req, res) => {
    // //req.session.destroy();
    // console.log('get : /account/logout');
    // req.logout();
    // req.session.save(function () {
    //     res.redirect('/account/login');
    // });
        req.logout(function (err) {
        if (err) {
          return next(err);
        }
        // if you're using express-flash
        req.flash('success_msg', 'session terminated');
        res.redirect('/account/login');
      });
});

module.exports = router;