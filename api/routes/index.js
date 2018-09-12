const auth = require('api/services/auth');

module.exports = app => {
    app.use('/user', require('api/controllers/user/'));
    app.use('/lock', auth.checkAuth(), require('api/controllers/lock/'));
}