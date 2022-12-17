const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const JWT_STRING = 'Nsl8TZXJzSYmL7TC5v5fRSaUPrUMas4TAap0NKqjqnaH3Q+0gSETQRRQz/3FYxW1zsQ8FC6QkwS2ZM4+auHH42C+dkbF1aA';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next(new AuthError('Необходима авторизация'));
  }
  const token = authorization;
  let payload;
  try {
    payload = jwt.verify(token, JWT_STRING);
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
