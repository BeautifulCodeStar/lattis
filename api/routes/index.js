module.exports = app => {
    app.use('/user', require('api/controllers/user/'));
    app.use('/user', require('api/controllers/lock/'));
}