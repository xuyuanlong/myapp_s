var express = require('express');
var router = express.Router();
var Menu = require('../models/menu');

router.post('/add', function(req, res, next) {
  const  {path,name,component,children} = req.body;
  var query = Menu.findOne({ 'name': name });
  // 然后执行查询
  query.exec(function (err, menu) {
    if (!err) {
      if (menu && menu.name) {
        return res.send({code:'200',msg:'exit'})
      }
    };
  });

  let newMenu = {
    path,
    name,
    component,
    children
  }
  console.log('----------')
  Menu.create(newMenu,function(err,data) {
    if(!err) {
      return res.send('success');
    }
    
  })
});

module.exports = router;
