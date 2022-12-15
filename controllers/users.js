const User = require('../models/user');

const handleErrorUser = (err) => {
  if (err.name === 'CastError' || err.name === 'DocumentNotFoundError') {
    return ({ status: 404, text: 'Запрашиваемый пользователь не найден' });
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
      const { status, text } = handleErrorUser(err);
      res.status(status).send({ message: text });
    });
};

module.exports.getUserById = (req, res) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      res.status(200);
      res.send({ data: user });
    })
    .catch((err) => {
      const { status, text } = handleErrorUser(err);
      res.status(status).send({ message: text });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User
    .create({ name, about, avatar })
    .then((user) => {
      res.status(200);
      res.send({ data: user });
    })
    .catch((err) => {
      const { status, text } = handleErrorUser(err);
      res.status(status).send({ message: text });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  if (name && about) {
    User
      .findByIdAndUpdate(req.user._id, { name, about })
      .then((user) => {
        res.status(200);
        res.send({ data: user });
      })
      .catch((err) => {
        const { status, text } = handleErrorUser(err);
        res.status(status).send({ message: text });
      });
  } else {
    res.status(400).send({ message: 'Не заполнены данные для обновления профиля' });
  }
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (avatar) {
    User
      .findByIdAndUpdate(req.user._id, { avatar })
      .then((user) => {
        res.status(200);
        res.send({ data: user });
      })
      .catch((err) => {
        const { status, text } = handleErrorUser(err);
        res.status(status).send({ message: text });
      });
  } else {
    res.status(400).send({ message: 'Не заполнены данные для обновления профиля' });
  }
};
