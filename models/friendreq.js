var mongoose = require('mongoose');


var friendReqSchema = mongoose.Schema({
    name:String,
    
});

module.exports = mongoose.model("friendreq", friendReqSchema);