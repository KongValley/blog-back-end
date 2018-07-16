var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    username: {type: String, required: true,unique: true},
    nickname: {type: String, required: true},
    password: {type: String, required: true},
},{
    collection: "user"
});


var User=mongoose.model('User',userSchema);
module.exports = User;