let mongoose = require('mongoose');

let {db_url} = require('../config');

mongoose.connect(db_url,{useNewUrlParser:true});
// 创建一个schema
let UserSchema = new mongoose.Schema({
  username:String,
  password:String
});

module.exports = mongoose.model('User',UserSchema);



