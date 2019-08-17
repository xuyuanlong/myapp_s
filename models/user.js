const mongoose = require('./db');
const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  age: Number,
  type: String,  //用户类型 1管理员 2普通用户
  phone: String, //手机号
  password: String,
  token:String,
  create: {
    type: Date,
    default: Date.now
  }
},{
  versionKey: false
})

module.exports = mongoose.model('User',User);