const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var db = require('./db');

var requestIp = require('request-ip');

module.exports = () => {

    console.log('passport is passed');

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (user_id, done) => {

        const user = await db.Users.findOne({ where: { id: user_id } });
        done(null, user);
    });

    passport.use(new LocalStrategy(
        {
            usernameField: 'strID',
            passwordField: 'strPassword',
            session: true,
            passReqToCallback: true,
        },
        async function (req, username, password, done) {

            try {
                console.log(`********** passport loginid : ${username} / password ${password}`);

                //User.findOne({ where: { name: username } }).then(function (user) {
                    var user = await db.Users.findOne({ where: { strID: username } });
    
                    //if (!user) {
                    if ( user == undefined ) {
                        console.log('not exist user');
                        return done(null, false, { message: '없는 사용자 아이디 입니다.' });
                    }
    
                    if (user.strPassword != password) {
                        console.log('incorrect password');
                        return done(null, false, { message: '비밀번호가 틀렸습니다.' });
                    }

                    if( user.iClass >= 5 )
                    {
                        return done(null, false, { message: '유저는 로그인할 수 있습니다.' });
                    }
                    let ip = requestIp.getClientIp(req);
                    console.log(`********** user : ${user.strID}` );

                    await db.Users.update({loginedAt : db.sequelize.literal('CURRENT_TIMESTAMP'),strIPlogin:ip}, { where: { strID: username } });
    
                    return done(null, user);
            } catch ( e ) {
                console.log(e);
                return done(e);
            }
        }
    ));
}
