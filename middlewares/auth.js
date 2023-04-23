const jwt = require('jsonwebtoken');
const Authorization = require('../errors/authorization');
const { JWT_SECRET } = require('../config');

const auth = (req, res, next) => {
  let payload;
  const { authorization } = req.headers;
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next(new Authorization('Необходима авторизация'));
    }
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(
      token,
      JWT_SECRET,
    );
  } catch (err) {
    return next(new Authorization('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
