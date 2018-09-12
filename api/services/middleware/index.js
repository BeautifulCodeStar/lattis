const handler = require('api/services/handler');
const resHandler = handler.resHandler;
const errorMsg = handler.errorMsg;

const pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

exports.signup = () => {
    return (req, res, next) => {
        const username = req.body.username,
          password = req.body.password;
    
        if (!username) {
          return resHandler(res, 400, true, errorMsg.missingFields);
        }
    
        if (!password || !pwdRegex.test(password)) {
          return resHandler(res, 400, true, errorMsg.invalidPwd);
        }
        next();
    }
}

exports.login = () => {
    return (req, res, next) => {
        const username = req.body.username;
        const password = req.body.password;
        if (!username) {
            return resHandler(res, 400, true, errorMsg.missingFields);
        }
        if (!password || !pwdRegex.test(password)) {
            return resHandler(res, 400, true, errorMsg.invalidPwd);
        }
        next();
    }
}

exports.update = () => {
    return (req, res, next) => {
        const username = req.body.username;
        if (!username) {
            return resHandler(res, 400, true, errorMsg.missingFields);
        }   
        const birthDate = req.body.birthDate;
        if (!birthDate) {
            return resHandler(res, 400, true, errorMsg.missingFields);
        }
        next();
    }
}

exports.createLock = () => {
    return (req, res, next) => {
        const name = req.body.name;
        if (!name) {
          return resHandler(res, 400, true, errorMsg.missingFields);
        }
        next();
    }
}

exports.updateLock = () => {
    return (req, res, next) => {
        const name = req.body.name;
        const id = req.body.id;
        if (!name) {
          return resHandler(res, 400, true, errorMsg.missingFields);
        }
        if (!id) {
          return resHandler(res, 400, true, errorMsg.missingFields);
        }
        next();
    }
}

exports.deleteLock = () => {
    return (req, res, next) => {
        const id = req.body.id;
        if (!id) {
          return resHandler(res, 400, true, errorMsg.missingFields);
        }
        next();
    }
}