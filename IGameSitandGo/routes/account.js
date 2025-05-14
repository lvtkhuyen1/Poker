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

router.post('/request_modifysetting', async (req, res) => {

    console.log(`/request_modifysetting`);
    console.log(req.body);

    let user = await db.Users.findOne({where:{strID:req.body.strID}});
    if ( user != null )
    {
        await user.update({
            strOptionCode:req.body.strOptionCode
        });

        res.send({result:'OK'});
    }
    else
    {
        res.send({result:'Error'});
    }
});

module.exports = router;