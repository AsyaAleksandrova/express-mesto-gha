const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt || !req.cookies.jwt.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = req.cookies.jwt.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  return next();
};
