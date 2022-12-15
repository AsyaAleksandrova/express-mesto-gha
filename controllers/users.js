const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User
    .find({})
    .then((users) => {
      res.status(200);
      res.send({ data: users });
    })
    .catch((err) => {
      res.status(500).send({ message: `Что-то пошло не так: ${err.message}` });
    });
};

module.exports.getUserById = (req, res) => {
  User
    .findById(req.params.userId)
    .orFail(() => Error('CastError'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'DocumentNotFoundError') {
        if (req.params.userId.length === 24) {
          res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        }
        res.status(400).send({ message: 'Переданые некорректные данные идентификатора пользователя' });
      }
      res.status(500).send({ message: `Что-то пошло не так: ${err.message}` });
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
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданые некорректные данные при создании пользователя: ${err.message}` });
      }
      res.status(500).send({ message: `Что-то пошло не так: ${err.message}` });
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
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданые некорректные данные при изменении данных пользователя: ${err.message}` });
      }
      res.status(500).send({ message: `Что-то пошло не так: ${err.message}` });
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
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданые некорректные данные при изменении данных пользователя: ${err.message}` });
      }
      res.status(500).send({ message: `Что-то пошло не так: ${err.message}` });
    });
};
