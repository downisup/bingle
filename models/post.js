var mongoose = require('mongoose');
const comment = require('./comment');
var Comment = require('./comment');

 var postSchema = mongoose.Schema({
    title:String,
    content: String,
    likes:Number,
    author:String,
    likers:[],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:Comment
    }]
    
});

module.exports = mongoose.model("post", postSchema);