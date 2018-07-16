var express = require('express');
var router = express.Router();
var moment = require('moment');
moment.locale('zh-cn');
var article = require('./../models/articles');

router.post('/add',function (req,res,next) {
    const username = req.body.username;
    const nickname = req.body.nickname;
    const title = req.body.title;
    const about = req.body.about;
    const content = req.body.content;
    const chips = req.body.chips;
    const comments = req.body.comments;
    const thumbUp = req.body.thumbUp;
    const thumbDown = req.body.thumbDown;

    console.log(username);
    console.log(nickname);
    console.log(title);
    console.log(about);
    console.log(content);
    console.log(chips);
    console.log(comments);
    console.log(thumbUp);
    console.log(thumbDown);

    let articleInfo = new article({
        username: username,
        nickname: nickname,
        title: title,
        about: about,
        content: content,
        chips: chips,
        comments: comments,
        thumbUp: thumbUp,
        thumbDown: thumbDown
    });

    articleInfo.save(function (err) {
        if (err) throw console.log(err);
        console.log("添加成功");
        res.json({
            status:"200",
            msg:"添加成功"
        });
    });
});

router.post('/queryAllArticles',function (req,res,next) {
    const current = req.body.current;
    article.find().sort({updatedAt: -1}).skip((current-1)*9).limit(9).exec(
        function(err,docs){
            if (err) {
                res.json({
                    status:"500",
                    msg:"查询失败",
                    result: err
                });
            };
            if (docs!==null){
                console.log("查询成功");
                res.json({
                    status:"200",
                    msg:"查询成功",
                    result: docs
                });
            }
        });
});

router.post('/queryAllArticlesNumber',function (req,res,next) {
    article.find().count(function (err,count) {
        if (err) {
            res.json({
                status:"500",
                msg:"查询失败",
                result: err
            });
        };
        res.json({
            status:"200",
            msg:"查询成功",
            result: count
        });
        console.log(count)
    })
});

router.post('/queryAllMyArticlesNumber',function (req,res,next) {
    const username = req.body.username;
    article.find({'username': username}).count(function (err,count) {
        if (err) {
            res.json({
                status:"500",
                msg:"查询失败",
                result: err
            });
        };
        res.json({
            status:"200",
            msg:"查询成功",
            result: count
        });
        console.log(count)
    })
});

router.post('/queryAllMyArticles',function (req,res,next) {
    const username = req.body.username;
    const current = req.body.current;
    article.find({'username': username}).sort({_id: -1}).skip((current-1)*9).limit(9).exec(
        function(err,docs){
            if (err) {
                res.json({
                    status:"500",
                    msg:"查询失败",
                    result: err
                });
            };
            if (docs!==null){
                console.log("查询成功");
                res.json({
                    status:"200",
                    msg:"查询成功",
                    result: docs
                });
            }
        });
});


router.post('/delteMyArticle',function (req,res,next) {
    const id = req.body.id;
    article.remove({'_id': id},function(err){
            if (err) {
                res.json({
                    status:"500",
                    msg:"删除失败",
                    result: err
                });
            };
            console.log("删除成功");
            res.json({
                status:"200",
                msg:"删除成功",
                result: "删除成功"
            });
        });
});

router.post('/queryOneArticle',function (req,res,next) {
    const id = req.body.id;
    article.findOne({'_id':id}).exec(function (err,doc) {
        if(err){
            res.json({
                status:"500",
                msg:"查询失败"
            })
        }
        if (doc!==null){
            res.json({
                status:"200",
                msg:"查询成功",
                result: doc
            })
        }
    });
});

router.post('/thumbUp',function (req,res,next) {
    const id = req.body.id;
    const username = req.body.username;
    const flag = req.body.flag;
    article.findOne({'_id':id}).exec(function (err,doc) {
        if(err){
            res.json({
                status:"500",
                msg:"查询失败"
            });
        }
        if (doc!==null){
            if(!flag){
                doc.thumbUp.push(username);
                article.update({'_id':id},{thumbUp:doc.thumbUp},function (err,raw) {
                    if(err){
                        res.json({
                            status:"500",
                            msg:"点赞失败"
                        });
                    }else {
                        res.json({
                            status:"200",
                            msg:"点赞成功",
                            result: doc.thumbUp
                        });
                    }
                });
            }else {
                var index = doc.thumbUp.indexOf(username);
                if (index >-1 ){
                    doc.thumbUp.splice(index,1);
                    article.update({'_id':id},{thumbUp:doc.thumbUp},function (err,raw) {
                        if(err){
                            res.json({
                                status:"500",
                                msg:"取消失败"
                            });
                        }else {
                            res.json({
                                status:"200",
                                msg:"取消成功",
                                result: doc.thumbUp
                            });
                        }
                    });
                }
            }
        }
    });
});


router.post('/thumbDown',function (req,res,next) {
    const id = req.body.id;
    const username = req.body.username;
    const flag = req.body.flag;
    article.findOne({'_id':id}).exec(function (err,doc) {
        if(err){
            res.json({
                status:"500",
                msg:"查询失败"
            });
        }
        if (doc!==null){
            if(!flag){
                doc.thumbDown.push(username);
                article.update({'_id':id},{thumbDown:doc.thumbDown},function (err,raw) {
                    if(err){
                        res.json({
                            status:"500",
                            msg:"踩人失败"
                        });
                    }else {
                        res.json({
                            status:"200",
                            msg:"踩人成功",
                            result: doc.thumbDown
                        });
                    }
                });
            }else {
                var index = doc.thumbDown.indexOf(username);
                if (index >-1 ){
                    doc.thumbDown.splice(index,1);
                    article.update({'_id':id},{thumbDown:doc.thumbDown},function (err,raw) {
                        if(err){
                            res.json({
                                status:"500",
                                msg:"取消失败"
                            });
                        }else {
                            res.json({
                                status:"200",
                                msg:"取消成功",
                                result: doc.thumbDown
                            });
                        }
                    });
                }
            }
        }
    });
});

router.post('/update',function (req,res,next) {
    const id = req.body.id;
    const username = req.body.username;
    const nickname = req.body.nickname;
    const title = req.body.title;
    const about = req.body.about;
    const content = req.body.content;
    const time = moment().format("YYYY-MM-dd").toString();
    article.findOne({'_id':id}).exec(function (err,doc) {
        if(err){
            res.json({
                status:"500",
                msg:"查询失败"
            });
        }
        if (doc!==null){
            article.update({'_id':id},{
                username:username,
                nickname:nickname,
                title:title,
                about:about,
                content:content,
                chips:chips
            },function (err,raw) {
                if(err){
                    res.json({
                        status:"500",
                        msg:"更新失败"
                    });
                }else {
                    res.json({
                        status:"200",
                        msg:"更新成功",
                    });
                }
            });
        }
    });
});


router.post('/queryAllChips',function (req,res,next) {
    article.find(null,'chips',function (err,docs) {
        var chips = [];
        docs.forEach(function(item){
            for (var i = 0;i<item.chips.length ; i++) {
                chips.push(item.chips[i]);
            }
        });
        console.log(chips);
        res.json({
            status: "200",
            msg: "查询成功",
            result: chips
        });
    });
});

router.post('/saveComment',function (req,res,next) {
    const id = req.body.id;
    const nickname = req.body.nickname;
    const content = req.body.content;
    const time = moment().format('llll').toString();
    article.findOne({'_id':id}).exec(function (err,doc) {
        if(err){
            res.json({
                status:"500",
                msg:"查询失败"
            });
        }
        if (doc!==null){
            doc.comment.unshift({nickname:nickname,content:content,time:time});
            article.update({'_id':id},{
                comment:doc.comment
            },function (err,raw) {
                if(err){
                    res.json({
                        status:"500",
                        msg:"更新失败"
                    });
                }else {
                    res.json({
                        status:"200",
                        msg:"更新成功",
                        result: doc.comment
                    });
                    console.log(doc.comment);
                }
            });
        }
    });
});









module.exports = router;