const i18n = require('i18n');

i18n.configure({
    locales:['en','mn'],
    directory:__dirname + '/locales',
    defaultLocale:'en',
    // cookie:'vtm_lang',
});

module.exports = (req, res, next) => {
    // if(!req.cookies.vtm_lang) {
    //     res.cookie('vtm_lang', 'mn');
    // }

    i18n.init(req, res);
    res.locals.__ = res.__;

    return next();
}