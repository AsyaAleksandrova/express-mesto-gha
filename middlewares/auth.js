const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports.auth = (req, res, next) => {
  if (!req.cookies.jwt || !req.cookies.jwt.startsWith('Bearer ')) {
    next(new AuthError('Необходима авторизация'));
  }
  const token = req.cookies.jwt.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
