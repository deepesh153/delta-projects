const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
 from : {
  type : String,
  required : true
 },
 to : {
  type : String,
  required : true
 },
 message : {
  type : String,
  maxLength : 50
 }

},
 
 {
  timestamps:{createdAt :'created_at', updatedAt: 'updated_at'}
 });

// chatSchema.pre('save', function(next){
//  now = new Date();
//  this.updated_at = now;
//  if ( !this.created_at ) {
//    this.created_at = now;
//  }
//  next();
// });

const Chat = mongoose.model("Chat",chatSchema);


module.exports = Chat;