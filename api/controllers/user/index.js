const express = require('express');
const router = express.Router();

const handler = require('api/services/handler');
const resHandler = handler.resHandler;
const errorMsg = handler.errorMsg;

const helpers = require('api/helpers');

const middleware = require('api/services/middleware');
const auth = require('api/services/auth');

const signUp = async (req, res) => {
    let query = `SELECT * FROM lattis.users WHERE username LIKE '${req.body.username}'`;
    const result = await helpers.executeQuery(query);
    if (result && result.length > 0) { 
        resHandler(res, 400, true, errorMsg.exist);
    } else {
        const pwd = await helpers.encryptPassword(req.body.password);
        let saveQuery = `INSERT INTO lattis.users (username, password, birth_date) VALUES ('${req.body.username}', '${pwd}', '${req.body.birthDate}')`;
        const save = await helpers.executeQuery(saveQuery);
        if (save) {
            resHandler(res, 200, false, null, 'Created account successfully!');
        } else {
            resHandler(res, 400, true, errorMsg.db);
        }
    }
};

const signIn = async (req, res) => {
    let query = `SELECT * FROM lattis.users WHERE username LIKE '${req.body.username}'`;
    const result = await helpers.executeQuery(query);
    if (result && result.length > 0) { 
        const pwd = result[0]['password'];
        const user = {
            username: req.body.username,
            pwd: pwd,
            id: result[0].id
        };
        const check = await helpers.decryptPwd(req.body.password, pwd);
        if (check) {
            const token = auth.generateToken(auth.serializeUser(user));
            resHandler(res, 200, false, null, token);
        } else {
            resHandler(res, 400, true, errorMsg.dismatch);
        }
    } else {
        resHandler(res, 400, true, errorMsg.dismatch);
    }
};

const udpate = async (req, res) => {
    const name = req.body.username;
    const birthDate = req.body.birthDate;
    let query = `SELECT * FROM lattis.users WHERE id = '${req.token.id}'`;
    const result = await helpers.executeQuery(query);
    if (result && result.length > 0) {
        let updateQuery = `UPDATE lattis.users SET username = '${name}', birth_date='${birthDate}' WHERE id = '${req.token.id}'`;
        const updateResult = await helpers.executeQuery(updateQuery);
        if (updateResult) {
            resHandler(res, 200, false, null, "Updated information!");
        } else {
            resHandler(res, 400, true, errorMsg.db);
        }
    } else {
        resHandler(res, 400, true, errorMsg.empty);
    }
};

const remove = async (req, res) => {
    let query = `SELECT * FROM lattis.users WHERE id = '${req.token.id}'`;
    const result = await helpers.executeQuery(query);
    if (result && result.length > 0) {
        let delQuery = `DELETE FROM lattis.users WHERE id = '${req.token.id}'`;
        const delResult = await helpers.executeQuery(delQuery);
        if (delResult) {
            resHandler(res, 200, false, null, "You are removed from the system!");
        } else {
            resHandler(res, 400, true, errorMsg.db);
        }
    } else {
        resHandler(res, 400, true, errorMsg.empty);
    }
};

const getUserList = async (req, res) => {
    let query = `SELECT id, username, birth_date FROM lattis.users`;
    if (req.query.username) {
        query += ` WHERE username LIKE "${req.query.username}"`;
    } else if (req.query.id) {
        query += ` WHERE id = '${req.query.id}'`;
    }
    const result = await helpers.executeQuery(query);
    if (result && result.length > 0) {
        resHandler(res, 200, false, null, null, result);
    } else {
        resHandler(res, 400, true, errorMsg.empty);
    }
};

const getProfile = async (req, res) => {
    let query = `SELECT id, username, birth_date FROM lattis.users  WHERE id = '${req.token.id}'`;
    const result = await helpers.executeQuery(query);
    if (result && result.length > 0) {
        resHandler(res, 200, false, null, null, result);
    } else {
        resHandler(res, 400, true, errorMsg.empty);
    }
};

router.post('/signup', middleware.signup(), signUp);
router.post('/login',  middleware.login(), signIn);
router.get('/list',  auth.checkAuth(), getUserList);
router.get('/me',  auth.checkAuth(), getProfile);
router.all('/update', [auth.checkAuth(), middleware.update()], udpate);
router.delete('/delete', auth.checkAuth(), remove);

module.exports = router;