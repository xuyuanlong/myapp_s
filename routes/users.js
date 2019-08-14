var express = require('express');
var router = express.Router();
var cookie = require('cookie');
const cryptojs = require('cryptojs').Crypto;
const User = require('../models/user');
const returnJson = require('../returnJson');
const logger = require('../models/log');


// 登录
router.post('/login', function(req, res, next) {
  const {phone,password} = req.body;
  if (!phone || !password) {
    return res.send(returnJson(300));
  }
  console.log(phone)
  console.log(password)
  User.findOne({'phone':phone,'password':password},function(err,user){
    if (!err) {
      if(user) {
        console.log(user)
        var token = cryptojs.MD5(user._id)
        var set = {						
          token: token,
        };

        User.update({
          _id: user._id
        }, {
          $set: set
        }, function(err) {
        })
        var cookies = [cookie.serialize('user', token, {
          maxAge: 36000,
          path: '/'
        })];
        res.setHeader('Set-cookie', cookies);
        res.send(returnJson(200))
      }
    }
  })
})

//创建用户
router.post('/register', function(req, res, next) {
  const {name,age,type,phone,password} = req.body;
  if (!name || !age || !type || !phone ||!password) {
    return res.send(returnJson(300))
  } else {
    User.find({'phone':phone},function(err,data) {
      if (data && data.length) {
        return res.send(returnJson(1001))
      } else {
        let user = {name,age,type,phone,password}
        User.create(user,function(err,data) {
          if(!err) {
            return res.send(returnJson(200));
          }
        })
      }
    })
  }
});
// 用户列表
router.post('/list', function(req, res, next) {
  const {keyword,page,pageSize} = req.body;
  let opt = {}
  if (keyword) {
    opt.$or = [{
      name: {$regex : keyword,$options: '$i'},
      phone: {$regex : keyword}
    }]
  }
  
  User.find(opt,{password:0}).skip((page-1)*pageSize).limit(pageSize).exec(function(err,users) {
    if (!err) {
      logger.info('lalalalala')
      return res.send(returnJson(200,users));
    }
  })  

})
module.exports = router;
