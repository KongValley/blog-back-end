var createError = require('http-errors');
var express = require('express');
var session=require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('./config/default');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var registerRouter = require('./routes/user');
var articlesRouter = require('./routes/articles');

var app = express();

var mongodb=require('./lib/mongo');
var db=mongodb();




//设置跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Credentials",true);
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");//预检请求使用
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");//预检请求使用
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

//session中间件
app.use(session({
    name: config.session.key, //设置 cookie 保存 session id 的字段名称
    secret: config.session.secret, //通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true,   //强制更新 session
    saveUninitialized: false, //强制创建一个session,即使用户未登录
    cookie:{
        maxAge: config.session.maxAge
    },
    store: new MongoStore({
        url: config.mongodb
    })
}));

app.use('/api/user',registerRouter);
app.use('/api/articles',articlesRouter);


//使用express-formidable便捷处理上传文件
app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
    keepExtensions: true// 保留后缀
}))

//上传
app.post('/api/supload',(req,res)=> {
    const img = req.files.image.path.split(path.sep).pop();
    return res.json({
        url: img
    });
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
