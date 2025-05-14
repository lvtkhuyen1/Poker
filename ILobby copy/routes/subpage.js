const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));

let axios = require('axios');

const db = require('../db');

router.get('/notice', async(req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
    {
        res.render('subpage/notice', {type:0, user:req.user});
    }
});

router.get('/message', async(req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
    {
        res.render('subpage/message', {type:0, user:req.user});
    }
});


router.get('/mypage', async(req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
    {
        res.render('subpage/mypage', {type:0, user:req.user});
    }
});
router.get('/push', async(req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
    {
        res.render('subpage/push', {type:0, user:req.user});
    }
});
router.get('/cashout', async(req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
    {
        res.render('subpage/cashout', {type:0, user:req.user});
    }
});
router.get('/customercenter', async(req, res) => {

    if ( req.user == undefined )
        res.redirect('/account/login');
    else
    {
        res.render('subpage/customercenter', {type:0, user:req.user});
    }
});
module.exports = router;