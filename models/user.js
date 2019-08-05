const mongoose = require('./db');
const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  age: Number
},{
  versionKey: false
})

module.exports = mongoose.model('User',User);