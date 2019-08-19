var pinyin = require("pinyin2");
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
var arrayHelper = require('../utils/arrayHelper');

var downloadHelper = {
    //上传文件
    //rotation:是否旋转图片; updatephoto:更新头像调用该参数，会把图片转成正方形图
    //compress:是否后台压缩图片  screenshot:为上传的视频创建缩略图
    upload: function(req, cb) {
        logger.debug('downloadHelper/upload');
        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
            if (err || (!files.file[0]))
                return cb(resultJson(500));

            var rotation = req.query.rotation || 0;
            var updatephoto = req.query.updatephoto;
            var compress = req.query.compress;
            var remainName = req.query.remainName;
            var screenshot = req.query.screenshot;
            logger.debug('upload rotation-->' + rotation);
            logger.debug('upload updatephoto-->' + util.inspect(updatephoto));
            logger.debug('upload compress-->' + compress);
            logger.debug('upload remainName-->' + remainName);
            logger.debug('upload screenshot-->' + screenshot);

            var file_data = files.file[0];
            var tmp_path = file_data.path;
            var filename = file_data.originalFilename;
            var ext = downloadHelper.getExt(filename).toString().toLowerCase();
            logger.debug('ext:' + ext);
            if (ext == '') {
                logger.debug('ext is empty, donot upload it');
                return cb(resultJson(550));
            }

            var size = file_data.size;
            var uid = uuid.v1();
            var target_file = (remainName ? filename : (uid + ext));
            logger.debug('target_file:' + target_file);
            //create 'upload/image' if it doesn't exist
            mkdirp.sync(CONSTS.UPLOAD.PATH);

            var target_path = CONSTS.UPLOAD.PATH + target_file;
            logger.debug('upload, target path=' + target_path);
            if (ext != '.jpeg' && ext != '.jpg' && ext != '.png' && ext != '.mp4') {
                var is = fs.createReadStream(tmp_path);
                var os = fs.createWriteStream(target_path);
                is.pipe(os);
                is.on('end', function() {
                    return downloadHelper.uploadFinish(filename, target_file, size, tmp_path, cb);
                });
                return;
            }

            //后台压缩上传的图片
            if (compress == 1) {
                gm(tmp_path).resize(640).noProfile().write(target_path, function(err) {
                    if (err) {
                        logger.debug('gm resize error:' + err);
                    }
                    return downloadHelper.uploadFinish(filename, target_file, size, tmp_path, cb);
                });
            } else if (screenshot == 1) {
                logger.debug('upload finish, begin take screenshots');
                var thumbnail = CONSTS.UPLOAD.PATH + uid + '.jpg';
                logger.debug('thumbnail:', thumbnail);
                var cmd = 'ffmpeg -i '+tmp_path + ' -y  -f image2 -ss 3 -vframes 1 -s 114x114  ' + thumbnail;
                logger.debug('cmd:', cmd);
                exec(cmd, (error, stdout, stderr) => {
                    if (error)  {
                        logger.debug('exec cmd error:', err);
                    }
                });
            } else {
                var thumbnail = target_path.substring(0, target_path.lastIndexOf('.')) + '_thumbnail' + target_path.substring(target_path.lastIndexOf('.'));
                logger.debug('thumbnail=' + thumbnail);
                gm(tmp_path).resize(320).noProfile().write(thumbnail, function(err) {});
            }

            //把临时生成的文件保存为正式文件
            var is = fs.createReadStream(tmp_path);
            var os = fs.createWriteStream(target_path);
            is.pipe(os);
            is.on('end', function() {
                //旋转照片
                if (!rotation) {
                    logger.debug('begin rotate photo')
                    gm(target_path).rotate('#000', rotation * 90).write(target_path, function(err) {
                        if (err) {
                            logger.debug('gm rotate error');
                            return downloadHelper.uploadFinish(filename, target_file, size, tmp_path, cb);
                        }

                        //把头像转成正方形
                        if (updatephoto == true) {
                            logger.debug('resize photo, updatephoto:' + updatephoto)
                            gm(target_path).size(function(err, size) {
                                if (err) {
                                    logger.debug('gm resize picture error');
                                    return downloadHelper.uploadFinish(filename, target_file, size, tmp_path, cb);
                                }
                                var x = y = 0;
                                var width;
                                if (size.width > size.height) {
                                    x = (size.width - size.height) / 2;
                                    width = size.height;
                                } else {
                                    y = (size.height - size.width) / 2;
                                    width = size.width;
                                }
                                logger.debug('x:' + x + ' y:' + y + ' width:' + width);
                                gm(target_path).crop(width, width, x, y).noProfile().write(target_path, function(err) {
                                    logger.debug('err:' + err);
                                    downloadHelper.uploadFinish(filename, target_file, size, tmp_path, cb);
                                });
                            });
                        } else {
                            downloadHelper.uploadFinish(filename, target_file, size, tmp_path, cb);
                        }
                    });
                } else {
                    downloadHelper.uploadFinish(filename, target_file, size, tmp_path, cb);
                }
            });
        })
    },

    uploadFinish: function(filename, url, size, tmp_path, cb) {
        fs.unlink(tmp_path, function(err) {
            if (err) {
                logger.debug('rm ' + tmp_path + ' failed');
            }
        });

        cb(resultJson(0, {
            filename: filename,
            url: url,
            size: size
        }));
    },

    /**
      * 文件下载
      */
    download: function(url, type, callback, isOriginFileName){
        logger.debug(url, type);
        if (url && downloadHelper.mytype(url) == 'array') {
            var dir = CONSTS.UPLOAD.PATH; //本地存储目录
            fs.exists(dir, function(exists) {
                if (!exists) {
                    mkdirp(dir, function(err) {
                        if (err) {
                            logger.error('err'+err);
                        }
                    });
                }
            });

            if (downloadHelper.isReptile) {
                // send request:reptile;
                request(url, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var $ = cheerio.load(body);
                        $('.img img').each(function() {
                            var src = $(this).attr('src');
                            var filename = Math.floor(Math.random()*100000) + src.substr(-4,4);
                            logger.debug('正在下载' + src + '\tfilename: ' + filename);
                            downloadHelper.myDownload(src, dir, filename);
                            logger.debug('下载完成');
                        });
                    }
                });
            } else {
                var errFlag = false,errExcuteFlag = false,
                    serverPaths = [];
                url.each(function(i, singleUrl) {
                    var fileType = type == 'mp3' ? '.amr' : (type == 'pic' ? '.jpg' : ('.'+type));
                    var filename = downloadHelper.random(12, true)+fileType;
                    if(isOriginFileName) {
                        filename = singleUrl.slice(singleUrl.lastIndexOf('/') + 1);
                    }
                    downloadHelper.myDownload(singleUrl, dir, filename, function(err) {
                        if (err) {
                            errFlag = true;
                        }
                        if (errFlag) {
                            if (!errExcuteFlag) {
                                errExcuteFlag = true;
                                callback && callback.call(this,errFlag, serverPaths);
                            }
                            return false;
                        } else {
                            if (filename.indexOf('.amr') != -1) {
                                filename = filename.substring(0, filename.indexOf('.amr')) + '.mp3';
                            }
                            serverPaths.push(filename);

                            if (url.length == serverPaths.length) {
                                callback && callback.call(this, errFlag, serverPaths);
                            }
                        }
                    });
                });
            }
        } else {
            logger.info('url('+url+') is null, or is not array'+(downloadHelper.mytype(url) == 'array')+'!');
        }
    },

    //下载方法
    myDownload: function(url, dir, filename, callback) {
        request({uri:url}, function(err, response, body) {
            var rightFlag = response.statusCode == 200 && !err;

            if (body.errcode) {
                logger.info(body.errcode);
                logger.info(body.errmsg);
            }
            try {
                var filePath = dir + filename;
                logger.debug('filePath: ' + filePath);
                if (fs.exists(filePath)) {
                    fs.unlinkSync(filePath);
                    logger.debug('rm origin file:' + filePath);
                }
                request(url).pipe(fs.createWriteStream(filePath)).on('close', function() {
                    logger.debug('response close');
                    if (filePath.indexOf('.amr') != -1) { // 音频文件
                        var target = dir + downloadHelper.getFileName(filename) + '.mp3';
                        logger.debug('target:', target);
                        child_process.execFile('ffmpeg', ['-i', filePath, target], function(err, result) {
                            logger.debug('ffmpeg covert amr to mp3, err:', err, ' result:', result);
                            fs.unlink(filePath, function(err) {
                                logger.debug('rm ', filePath, ' err:', err);
                            });
                        });
                    } else if (~filePath.indexOf('.jpg') || ~filePath.indexOf('.png') || ~filePath.indexOf('.jpeg') || ~filePath.indexOf('.gif')) {   // 图片文件
                        var target_path = filePath;
                        var thumbnail = target_path.substring(0, target_path.lastIndexOf('.')) + '_thumbnail' + target_path.substring(target_path.lastIndexOf('.'));
                        logger.debug('thumbnail=' + thumbnail);
                        gm(target_path).resize(320).noProfile().write(thumbnail, function(err) {});
                    }
                }); // 下载文件
            }catch(e) {
                logger.debug(e);
                rightFlag = false;
            }

            callback && callback.call(this, !rightFlag);
        });
    },
    //获取文件后缀
    getExt: function(filename) {
        if(!filename)
            return;
        return /\.[^\.]+$/.exec(filename);
    },

    // 判断对象的类型
    mytype: function (value){
        var result = Object.prototype.toString.call(value);
        if(!value) return undefined;
        var prefix = '[object ';
        return result.substring(result.indexOf('[')+prefix.length,result.indexOf(']')).toLowerCase();
    },

    //创建6位随机数（0-9范围内）
    random: function(num) {
        var items = '0123456789'.split('');
        var vcode = '';
        for(var i = 0; i < (num||6); i++) {
            var rnd = Math.random();
            var item = Math.round(rnd * (items.length - 1));
            vcode += items[item];
        }
        return vcode;
    },
};

module.exports = downloadHelper;
