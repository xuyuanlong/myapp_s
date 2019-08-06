const mongoose = require('./db');
const Schema = mongoose.Schema;

const Menu = new Schema({
  path: String,
  name: String,
  component: String,
  children: [{
    path: String,
    name: String,
  }]
},{
  versionKey: false
})

module.exports = mongoose.model('Menu',Menu);