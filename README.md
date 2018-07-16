# blog后端端部分

[![](https://img.shields.io/badge/uses-express-green.svg)](http://www.expressjs.com.cn/)

> A Vue.js and Node.js project

## 如何在自己本地上运行该项目后端端部分

1. 克隆本项目前端

```bash
git clone git@github.com:KongValley/blog-back-end.git
```

2. 安装依赖

``` bash
npm install
```

3. 运行

```bash
node ./bin/www
```



## 使用的数据库配置

```javascript
module.exports = {
    port: 3000,
    session: {
        secret: 'blogapp',
        key: 'blogapp',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://127.0.0.1:50000/blogdb'
}
```

后端端口是`localhost:3000`，数据库端口是`127.0.0.1:50000`，数据库名为`blogdb`





