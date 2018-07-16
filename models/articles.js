var mongoose = require('mongoose');
var articleSchema = mongoose.Schema({
    username: {type: String, required: true},
    nickname: {type: String, required: true},
    title: {type: String, required: true},
    about: {type: String},
    content: {type: String},
    chips: {type: Array},
    comment: [{nickname: String, content: String, time: String}],
    thumbUp: {type: Array},
    thumbDown: {type: Array},
},{
    timestamps: {createAt: 'created',updateAt: 'updated'}
},{
    collection: "articles"
});


var Article=mongoose.model('Article',articleSchema);
module.exports = Article;