var pinyin = require('pinyin2');
var multiparty = require('multiparty');
var util = require('util');
var uuid = require('node-uuid');
var fs = require('node-fs');
var gm = require('gm');
var mkdirp = require('mkdirp');
var request = require('request');
var cryptojs = require('cryptojs').Crypto;
var crypto = require('crypto');
var child_process = require('child_process');
var exec = require('child_process').exec;

var CONSTS = require('../consts');
var logger = require('../models/logger');
var resultJson = require('../result-json');

var utilsHelper = {
    MD5: function(value) { //md5 加密
        return cryptojs.MD5((value || '') + CONSTS.SECRETKEY);
    },

    Base64: function(value) {
        return new Buffer(value).toString('base64'); 
    },

    MD5Crypt: function(value) { //md5Crypt 加密,用于短信发送
        return crypto.createHash('md5').update(value).digest('hex');
    },
    
    FormatData: function(type, key) {
        if (type == null || key == null) {
            return '';
        }
        if (type == 'Date') {
            return new Date(key).pattern('yyyy-mm-dd');
        } else {
            return key;
        }
    },

    mailSend: function(to, subject, text, html, cb) {
        var nodemailer = require('nodemailer');
        var transporte = nodemailer.createTransport('SMTP', {
            server: 'QQex',
            host: 'smtp.exmail.qq.com', // 主机
            secureConnection: true, // 使用 SSL
            port: 465, // SMTP 端口
            auth: {
                user: 'bochy_pingtai@bochy.com.cn',
                pass: 'bochyadmin01'
            }
        });

        var opcionesMail = {
            from: 'bochy_pingtai@bochy.com.cn',
            to: to,
            subject: subject,
            text: text,
            html: html
        };
        transporte.sendMail(opcionesMail, function(error, response) {
            cb(error, response);
        });
    },

    //创建6位随机数（0-9范围内）
    random: function(num) {
        var items = '0123456789'.split('');
        var vcode = '';
        for (var i = 0; i < (num||6); i++) {
            var rnd = Math.random();
            var item = Math.round(rnd * (items.length - 1));
            vcode += items[item];
        }
        return vcode;
    },

    //拼音首字母
    py: function(s) {
        if (!s || s == '')
            return '';
        var result = pinyin(s, {
            style: pinyin.STYLE_FIRST_LETTER,
            heteronym: false
        });
        return result[0][0];
    },

    //拼音全字母
    pinyin: function(s) {
        if (!s || s == '')
            return '';
        var result = pinyin(s, {
            style: pinyin.STYLE_NORMAL,
            heteronym: false
        });
        var res = '';
        var length = result && result.length || 0;
        for (var i=0; i<length; i++)
            res += result[i][0];
        return res;
    },

    pad: function(num, n) {  
        var len = num.toString().length;  
        while(len < n) {  
            num = "0" + num;  
            len++;  
        }  
        return num;  
    },

    //按照去除重复数据
    uniqueInfosById: function(infos, _ids) {
        var ids = [];
        var first = true;
        var temp = [];
        var newInfos = [];
        _ids.map(function(_id) {
            infos = infos.filter(function(info) {
                var tag = true;
                ids.push(_id);
                ids = ids.unique();
                if (ids.indexOf(_id) != -1) {
                    if (first == true) {
                        first = false;
                        logger.debug("11111");
                        temp.push(_id);
                    } else {
                        if (temp.indexOf(_id) != -1) {
                            tag = false;
                          logger.debug("22222");
                        } else {
                            first = true;
                            tag = false;
                            logger.debug("33333");
                        }
                    }
                }
                return tag;
            });
            if (infos) {
                logger.debug("infos",infos);
                newInfos.push(infos);
            }
        });
        //logger.debug("infos",infos);
        return newInfos[0];
    }
};


module.exports = utilsHelper;