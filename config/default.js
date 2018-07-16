module.exports = {
    port: 3000,
    session: {
        secret: 'blogapp',
        key: 'blogapp',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://127.0.0.1:50000/blogdb'
}