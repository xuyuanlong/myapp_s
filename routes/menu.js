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
        return res.send('exit')
      } else {
        let newMenu = {
          path,
          name,
          component,
          children
        }
        Menu.create(newMenu,function(err,data) {
          if(!err) {
            return res.send('success');
          }
        })
      }
    };
  });
});

router.post('/list', function(req, res, next) {
  Menu.find(function(err,menus){
    if (!err) {
      return res.send({data:menus})
    }
  })
})

module.exports = router;
