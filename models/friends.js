var mongoose = require('mongoose');



var friendSchema = mongoose.Schema({
    name:String,
    
});


module.exports =  mongoose.model("friend",friendSchema);