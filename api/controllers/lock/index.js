const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');

const handler = require('api/services/handler');
const resHandler = handler.resHandler;
const errorMsg = handler.errorMsg;

const helpers = require('api/helpers');
const middleware = require('api/services/middleware');

const createLock = async (req, res) => {
    let query = `SELECT * FROM lattis.locks WHERE user_id = '${req.token.id}' AND name LIKE "${req.body.name}"`;
    const result = await helpers.executeQuery(query);
    if (result && result.length > 0) { 
        resHandler(res, 400, true, errorMsg.exist);
    } else {
        const uuid = uuidv4();
        let saveQuery = `INSERT INTO lattis.locks (mac_id, name, user_id) VALUES ('${uuid}', "${req.body.name}", '${req.token.id}')`;
        const save = await helpers.executeQuery(saveQuery);
        if (save) {
            resHandler(res, 200, false, null, 'Created lock successfully!');
        } else {
            resHandler(res, 400, true, errorMsg.db);
        }
    }
};

const getLocks = async (req, res) => {
    let query = `SELECT mac_id, name, user_id FROM lattis.locks WHERE user_id = '${req.token.id}'`;
    if (req.query.macId) {
        query += ` WHERE mac_id LIKE '${req.query.macId}'`;
    } else if (req.query.id) {
        query += ` WHERE id = '${req.query.id}'`;
    }
    const result = await helpers.executeQuery(query);
    console.log("locks:", result);
    if (result && result.length > 0) {
        resHandler(res, 200, false, null, result);
    } else {
        resHandler(res, 400, true, errorMsg.empty);
    }
};

const updateLocks = async (req, res) => {
    const name = req.body.name;
    let query = `SELECT * FROM lattis.locks WHERE user_id = '${req.token.id}' AND id = '${req.body.id}'`;
    const result = await helpers.executeQuery(query);
    if (result && result.length > 0) {
        let updateQuery = `UPDATE lattis.locks SET name = "${name}" WHERE user_id = '${req.token.id}' AND id = '${req.body.id}'`;
        const updateResult = await helpers.executeQuery(updateQuery);
        if (updateResult) {
            resHandler(res, 200, false, null, "Updated Lock information!");
        } else {
            resHandler(res, 400, true, errorMsg.db);
        }
    } else {
        resHandler(res, 400, true, errorMsg.empty);
    }
};

const deleteLock = async (req, res) => {
    let query = `SELECT * FROM lattis.locks WHERE user_id = '${req.token.id}' AND id = '${req.query.id}'`;
    const result = await helpers.executeQuery(query);
    if (result && result.length > 0) {
        let delQuery = `DELETE FROM lattis.locks WHERE user_id = '${req.token.id}' AND id = '${req.query.id}'`;
        const delResult = await helpers.executeQuery(delQuery);
        if (delResult) {
            resHandler(res, 200, false, null, "Delete Locks successfully");
        } else {
            resHandler(res, 400, true, errorMsg.db);
        }
    } else {
        resHandler(res, 400, true, errorMsg.empty);
    }
};

router.post('/create', middleware.createLock(), createLock);
router.get('/list', getLocks);
router.all('/update', middleware.updateLock(), updateLocks);
router.delete('/delete', middleware.deleteLock(), deleteLock);

module.exports = router;