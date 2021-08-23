       var mongoose              = require("mongoose");
       mongoose.connect("mongodb://localhost:27017/demo",{ useNewUrlParser: true });
       
       
       
       var Post                  = require('./post');
       var Comment               = require('./comment');
       var Friend                = require('./friends.js');
       var Friendreq             = require('./friendreq.js');
       
       var UserSchema = mongoose.Schema({
            username: String, 
            password: String,
            profilepicture:String,
            posts:[{
                type:mongoose.Schema.Types.ObjectId,
                ref: Post
            }],
            friends:[{
                type:mongoose.Schema.Types.ObjectId,
                ref: Friend
            }],
            friendreqs:[],
            notifications:Array,
            profilepicture:String

            
            
            
        });

        module.exports = mongoose.model("User",UserSchema);

             