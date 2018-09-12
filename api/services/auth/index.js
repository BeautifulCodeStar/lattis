const _ = require('lodash');
const jwt = require('jsonwebtoken');

const handler = require('api/services/handler');
const resHandler = handler.resHandler;
const errorMsg = handler.errorMsg;
const setupApiRoutes = require('api/routes');

exports.checkAuth = permissions => {
  return (req, res, next) => {
    const token = req.query.Authorization || req.headers.authorization || req.query.token;
    if (!token) {
      return resHandler(res, 400, true, errorMsg.unauth);
    }
    const secret = 'xy219287dJson_Web_Token';
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return resHandler(res, 400, true, errorMsg.unauth);
      }
      req.token = decoded;
      return next();
    });
  };
};

exports.serializeUser = user => {
  const userData = _.pick(user, ['username']);
  userData.id = user.id;
  userData.pwd = user.pwd;
  console.log(userData);
  return userData;
};

exports.generateToken = (user, expires) => {
  if(!expires)
    expires = 7 * 24 * 60 * 60;
  const secret = 'xy219287dJson_Web_Token';
  console.log(user);
  return jwt.sign(
    user,
    secret,
    { expiresIn: expires }
  );
};

exports.setTokenCookie = (res, token) => {
  res.cookie('lattis1293837c93', token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: process.env.NODE_ENV === 'production',
  });
};

