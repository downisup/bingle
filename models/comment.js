var mongoose = require('mongoose');
var replies = require('./replies');


var commentSchema = new mongoose.Schema({
    author:String,
    content:String,
    likes:Number,
    likers:[],
    replies:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:replies
    }]
    
});

module.exports = mongoose.model("comment",commentSchema);