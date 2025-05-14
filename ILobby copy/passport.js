const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var requestIp = require('request-ip');

var db = require('./db');
//var db = require('./models');
//var User = require('../models/user')(seq.sequelize, seq.Sequelize);
// var User = seq.Users;

module.exports = () => {

    console.log('passport is passed');

    function SessionConstructor(userID, userGroup, details)
    {
        this.userID = userID;
        this.userGroup = userGroup;
        this.details = details;        
    }

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (user_id, done) => {

        const user = await db.Users.findOne({ where: { id: user_id } });
        done(null, user);
    });


    passport.use('local', new LocalStrategy(
        {
            usernameField: 'strID',
            passwordField: 'strPassword',
            session: true,
            passReqToCallback: true,
        },
        async function (req, username, password, done) {

            try {
                var user = await db.Users.findOne({ where: { strID: username } });

                if ( user == undefined ) {
                    console.log(`Invalid User`);
                    return done(null, false, { message: '없는 사용자 아이디 입니다.' });
                }

                if (user.strPassword != password) {
                    console.timeLog(`Invalid Password`);
                    return done(null, false, { message: '비밀번호가 틀렸습니다.' });
                }

                if (user.iClass != 5) {
                    console.timeLog(`Invalid Password`);
                    return done(null, false, { message: '회원 아이디로 로그인 해주세요.' });
                }

                console.log(`Passport : bLogin  ${user.bLogin}`);
                // if (user.bLogin == 1 ) {
                //     //console.timeLog(`Already Logined`);
                //     return done(null, false, { message: '이미 접속 중입니다.' });
                // }

                let ip = requestIp.getClientIp(req);
                console.log(`Parameter : ${username}, ${password}, DB User : ${user.strNickname}, ip : ${ip}`);
                //await db.Users.update({loginedAt : db.sequelize.literal('CURRENT_TIMESTAMP'),strIPlogin:ip, strURL:req.get('origin')}, { where: { strID: username } });
                await db.Users.update({bLogin:1, loginedAt : db.sequelize.literal('CURRENT_TIMESTAMP'),strIPlogin:ip, strURL:req.get('origin')}, { where: { strID: username } });

                return done(null, user);
            } 
            catch ( e ) 
            {
                console.log(e);
                return done(e);
            }
        }
    ));
}

