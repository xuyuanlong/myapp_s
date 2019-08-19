var fs = require('node-fs');

var CONSTS = require('../consts');
var logger = require('../models/logger');

var fileHelper = {
   //删除文件
    delete: function(url) {
        if (!url) {
            return;
        }
        var file = CONSTS.UPLOAD.PATH + url;
        logger.debug('delete file:', file);
        fs.unlink(file, function(err) {
            logger.debug('delete file, err:', err);
        });
    },

    //获取扩展名
    getExt: function(filename) {
        if (!filename) {
            return;
        }
        return /\.[^\.]+$/.exec(filename);
    },

    getFile: function(url) {
        if (!url) {
            return;
        }
        return url.split('/').pop().split('#')[0].split('?')[0];
    },


    // 判断对象的类型
    mytype: function(value) {
        if (!value) {
            return undefined;
        }
        var result = Object.prototype.toString.call(value);
        var prefix = '[object ';
        return result.substring(result.indexOf('[')+prefix.length,result.indexOf(']')).toLowerCase();
    },

    //获取文件名，不带后缀
    getFileName: function(filename) {
        if (!filename) {
           return;
        }
        var pos = filename.lastIndexOf('.');
        return filename.substring(0, pos);  
    },
};

module.exports = fileHelper;