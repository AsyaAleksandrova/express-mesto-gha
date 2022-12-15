const User = require('../models/user');

const handleErrorUser = (err, req) => {
  if (err.name === 'CastError' || err.name === 'DocumentNotFoundError') {
    if (req.params.userId.length === 24) {
      return ({ status: 404, text: 'Запрашиваемый пользователь не найден' });
    }
    return ({ status: 400, text: 'Переданые некорректные данные идентификатора пользователя' });
  } if (err.name === 'ValidationError' || err.name === 'StrictModeError') {
    return ({ status: 400, text: `Переданые некорректные данные при создании пользователя: ${err.message}` });
  }
  return ({ status: 500, text: `Что-то пошло не так: ${err.message}` });
};

module.exports.getUsers = (req, res) => {
  User
    .find({})
    .then((users) => {
      res.status(200);
      res.send({ data: users });
    })
    .catch((err) => {
      const { status, text } = handleErrorUser(err, req);
      res.status(status).send({ message: text });
    });
};

module.exports.getUserById = (req, res) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
    })
    .catch((err) => {
      const { status, text } = handleErrorUser(err, req);
      res.status(status).send({ message: text });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User
    .create({ name, about, avatar })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      const { status, text } = handleErrorUser(err, req);
      res.status(status).send({ message: text });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true, upsert: false },
    )
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      const { status, text } = handleErrorUser(err, req);
      res.status(status).send({ message: text });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true, upsert: false },
    )
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      const { status, text } = handleErrorUser(err, req);
      res.status(status).send({ message: text });
    });
};
