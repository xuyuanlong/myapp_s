var express = require('express');
var router = express.Router();
const User = require('../models/user');
const returnJson = require('../returnJson');

//创建用户
router.post('/create', function(req, res, next) {
  const {name,age,type,phone} = req.body;
  // User.insertMany([{ size: 'small' }], function(err) {
        // 插入大量数据
  // });
  if (!name || !age || !type || !phone) {
    return res.send(returnJson(300))
  } else {
    User.find({'phone':phone},function(err,data) {
      if (data && data.length) {
        return res.send(returnJson(1001))
      } else {
        let user = {name,age,type,phone}
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
      return res.send(returnJson(200,users));
    }
  })  

})
module.exports = router;
