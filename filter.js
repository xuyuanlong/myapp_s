var express = require('express');
var router = express.Router();
var url = require('url');
var cookie = require('cookie');

var CONSTS = require('./consts');
var User = require('./models/user');

var resultJson = require('./result-json');

router.post('/*', function(req, res, next) {
    var pathname = url.parse(req.url).pathname.toString();
    if (pathname != '/user/login') {
        if (req.cookies[CONSTS.COOKIE.COOKIE_CODE] != '') {
            User.findOne({
                'token': req.cookies[CONSTS.COOKIE.COOKIE_CODE],
            }, {
                '_id': 1,
                'name': 1,
                'phone': 1,
                'token':1
            }, function(err, user) {
                if (err) {
                    // logger.error(err, '提取用户身份错误：');
                    return res.send(resultJson(2));
                }
                if (user && user.token == req.cookies[CONSTS.COOKIE.COOKIE_CODE]) {
                    var cookies = [cookie.serialize(CONSTS.COOKIE.COOKIE_CODE, req.cookies[CONSTS.COOKIE.COOKIE_CODE], {
                        maxAge: CONSTS.COOKIE.MAXAGE,
                        path: '/'
                    })];
                    // 设置用户信息
                    req.body._user = user;
                    // addSysLog(pathname, req);
                    res.setHeader('Set-cookie', cookies);
                    next();
                } else {
                    res.send(resultJson(4));
                }   
            })
        } else
            res.send(resultJson(6));
    } else {
        next()
        return
        User.findOne({
            'token': req.cookies[CONSTS.COOKIE.COOKIE_CODE],
        }, {
            '_id': 1,
            'name': 1,
            'phone': 1,
        }, function(err, user) {
            req.body._user = user;
            next();
        })
    }
})

module.exports = router;