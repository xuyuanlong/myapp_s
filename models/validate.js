var express = require('express');
var router = express.Router();
var url = require('url');
var cookie = require('cookie');

// var CONSTS = require('./consts');
// var User = require('./models/User');
// var Event = require('./models/Event');
// var Task = require('./models/Task');
// var Grade = require('./models/Grade');
// var logger = require('./models/logger');
// var resultJson = require('./result-json');

router.post('/*', function(req, res, next) {
    var pathname = url.parse(req.url).pathname.toString();
    if (pathname != '/user/lgn' &&
        pathname != '/user/lgnout' &&  
        pathname != '/upload') {
        if (req.cookies[CONSTS.COOKIE.COOKIE_CODE] != '') {
            User.findOne({
                'token': req.cookies[CONSTS.COOKIE.COOKIE_CODE],
            }, {
                '_id': 1,
                'name': 1,
                'category': 1,
                'token': 1,
                'phone': 1,
            }, function(err, user) {
                if (err) {
                    logger.error(err, '提取用户身份错误：');
                    return res.send(resultJson(2));
                }
                if (user && user.token == req.cookies[CONSTS.COOKIE.COOKIE_CODE]) {
                    var cookies = [cookie.serialize(CONSTS.COOKIE.COOKIE_CODE, req.cookies[CONSTS.COOKIE.COOKIE_CODE], {
                        maxAge: CONSTS.COOKIE.MAXAGE,
                        path: '/'
                    })];
                    // 设置用户信息
                    req.body._user = user;
                    addSysLog(pathname, req);
                    res.setHeader('Set-cookie', cookies);
                    next();
                } else
                    res.send(resultJson(4));
            })
        } else
            res.send(resultJson(6));
    } else {
        User.findOne({
            'token': req.cookies[CONSTS.COOKIE.COOKIE_CODE],
        }, {
            '_id': 1,
            'name': 1,
            'category': 1,
            'status': 1,
            'token': 1,
            'phone': 1,
        }, function(err, user) {
            req.body._user = user;
            addSysLog(pathname, req);
            next();
        })
    }
})

function addSysLog(pathname, req) {
    var user = req.body._user;
    if(user) {
        var content = '';
        if(pathname == '/xls/importUser')
            content = '导入用户';
        else if(pathname == '/user/upsert')
            content = '新建/修改用户';
        else if(pathname == '/user/remove')
            content = '删除用户';
        else
            return;

        new Event({
            from: user._id.toString(),
            name: user.name,
            phone: user.phone,
            content: content,
            create: new Date()
        }).save(function(err) {});
    }
}

module.exports = router;