const express = require('express');
const router = express.Router();
const cookie = require('cookie');
const cryptojs = require('cryptojs').Crypto;

const User = require('../models/user');
const returnJson = require('../result-json');
const logger = require('../models/logger');

router.post('/login', function(req, res, next) {
  const {phone,password} = req.body;
  if (!phone || !password) {
    return res.send(returnJson(106));
  }
  User.findOne({'phone':phone,'password':password},function(err,user){
    if (!err) {
      if(user) {
        var token = cryptojs.MD5(user._id);
        User.updateOne({
          _id: user._id
        }, {
          $set: {						
            token: token,
          }
        }, function(err) {
        })
        var cookies = [cookie.serialize('SESSION_TOKEN_CODE', token, {
          maxAge: 36000,
          path: '/'
        })];
        res.setHeader('Set-cookie', cookies);
        logger.info('登录成功');
        return res.send(returnJson(0))
      } else {
        return res.send(returnJson(106))
      }
    }
  })
})
// 退出登录
router.post('/lgnout', function(req, res) {
  var cookies = [cookie.serialize('SESSION_TOKEN_CODE', '', {
    maxAge: 36000,
    path: '/'
  })];
  res.setHeader('Set-cookie', cookies);
  return res.send(returnJson(0));
});
//创建用户
router.post('/register', function(req, res, next) {
  const {name,age,type,phone,password} = req.body;
  if (!name || !age || !phone ||!password) {
    return res.send(returnJson(3))
  } else {
    User.find({'phone':phone},function(err,data) {
      if (data && data.length) {
        return res.send(returnJson(102))
      } else {
        let user = {name,age,type,phone,password}
        User.create(user,function(err,data) {
          if(!err) {
            return res.send(returnJson(0));
          }
        })
      }
    })
  }
});
//查询用户详情
router.post('/detail', function(req, res, next) {
  const {id} = req.body;
  if (!id) {
    return res.send(returnJson(3))
  }
  User.findOne({'_id':id},function(err,user) {
    if (!err) {
      if (user) {
        return res.send(returnJson(0,user));
      } else {

      }
    }
    if (data && data.length) {
      return res.send(returnJson(102))
    } else {
      let user = {name,age,type,phone,password}
      User.create(user,function(err,data) {
        if(!err) {
          return res.send(returnJson(0));
        }
      })
    }
  }) 
})

// 用户列表
router.post('/list', function(req, res, next) {
  const {keyword,start,count} = req.body;
  let opt = {}
  if (keyword) {
    opt.$or = [{
      name: {$regex : keyword,$options: '$i'},
      phone: {$regex : keyword}
    }]
  }
  User.find(opt,{password:0}).skip((start-1)*count).limit(count).exec(function(err,users) {
    if (!err) {
      return res.send(returnJson(0,users));
    }
  })  
})

// 删除用户
router.post('/remove', function(req, res, next) {
  const {id} = req.body;
  if (!id) {
    return res.send(returnJson(3))
  }
  User.remove({"_id":id},function(err) {
    if (!err) {
      return res.send(returnJson(0))
    }
  }) 
})

module.exports = router;
