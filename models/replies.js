var mongoose = require('mongoose');


var repliesSchema = new mongoose.Schema({
    author:String,
    text:String,    
    likes:Number,
    replies:[]
    
});

module.exports = mongoose.model("replies",repliesSchema);