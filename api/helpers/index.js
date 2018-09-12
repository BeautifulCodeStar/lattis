require('rootpath')();
require('dotenv').config();

const bcrypt = require('bcrypt');
const db = require('api/services/database');

const saltRounds = 10;

module.exports = {
    encryptPassword: function(password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, function(err, hash) {
                if (err) {
                    reject(false);
                } else {
                    resolve(hash);
                }
            });
        })
    },

    decryptPwd: function(pwd, hash) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(pwd, hash, function(err, res) {
                resolve(res);
            });
        });
    },

    executeQuery: function(query) {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })
    }
}