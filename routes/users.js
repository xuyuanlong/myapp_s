var express = require('express');
var router = express.Router();
var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 查询
// find，findById，findOne

router.post('/add', function(req, res, next) {
  const  {name,age} = req.body;
  // User.insertMany([{ size: 'small' }], function(err) {
        // 插入大量数据
  // });
  if (!name || !age) {
    // console.log()
    return res.send('参数错误')
  }
  let user = {
    name:name,
    age:age
  }
  User.create(user,function(err,data) {
    if(!err) {
      return res.send('success');
    }
    
  })
});
router.get('/add2', function(req, res, next) {
  const query = req.query
  return res.send('success')
});
module.exports = router;
