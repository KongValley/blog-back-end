var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var user = require('./../models/user');


//查询是否已经登录接口
router.get("/checkLogin",(req,res,next)=>{
    if (req.cookies.username && req.cookies.nickname) {
        res.json({
            status:"200",
            msg:"",
            result:{
                username: req.cookies.username,
                nickname: req.cookies.nickname
            }
        })
    }else{
        res.json({
            status:"500",
            msg:"未登录",
            result:''
        });
    }
});

//注册接口
router.post("/register",(req,res,next)=>{
    const username = req.body.username;
    const nickname = req.body.nickname;
    let password = req.body.password;


    //异步生成hash密码
    bcrypt.genSalt(10,function (err,salt) {
        bcrypt.hash(password,salt,(err,hash)=>{
            this.password = hash;
            //组装要写入的数据
            let userInfo = new user({
                username: username,
                nickname: nickname,
                password: this.password
            });

            user.findOne({'username':userInfo.username},function (err,doc) {
                if (doc===null){
                    //保存
                    userInfo.save(function (err) {
                        if (err) throw console.log(err);
                        res.json({
                            status:"200",
                            msg:"注册成功"
                        });
                    })
                } else {
                    res.json({
                        status:"300",
                        msg:"用户名已被占用"
                    });
                }
            })

            //输出注册信息
            console.log(username);
            console.log(nickname);
            console.log(this.password);
        });
    });
});

//登录接口
router.post('/login',(req,res,next)=>{
    const username = req.body.username;
    let password = req.body.password;

    user.findOne({username:username},(err,doc)=>{
        if(err){
            res.json({
               status:"500",
               msg:err.msg
            });
        }else{
            if(doc!==null){

                //验证输入密码与数据库中的hash密码是否一致
                bcrypt.compare(password, doc.password, function(err, respone) {
                    if(respone===true){
                        res.cookie("username",doc.username,{
                            path:'/',
                            maxAge:2592000000
                        });
                        res.cookie("nickname",doc.nickname,{
                            path:'/',
                            maxAge:2592000000
                        });
                        res.json({
                            status:"200",
                            msg:"登录成功",
                            result:{
                                username: doc.username,
                                nickname: doc.nickname
                            }
                        })
                    }else {
                        res.json({
                            status:"500",
                            msg:"登录失败，账号密码错误",
                            result:""
                        })
                    }
                });
            }else {
                res.json({
                    status:"600",
                    msg:"登录失败，账号不存在",
                    result:""
                })
            }
        }
    });

});

//登出接口
router.post('/logout',function(req,res,next){
    res.cookie("username",'',{
        path:'/',
        maxAge:-1
    });
    res.cookie("nickname",'',{
        path:'/',
        maxAge:-1
    });
    res.json({
        status:"200",
        msg:"登出成功",
        result:''
    });
});
module.exports = router;