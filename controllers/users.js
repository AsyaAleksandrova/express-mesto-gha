const User = require('../models/user');

const ERROR_CODE_VALID = 400;
const ERROR_CODE_FIND = 404;
const ERROR_CODE_OTHER = 500;
const ERROR_CODE_OK = 200;

module.exports.getUsers = (req, res) => {
  User
    .find({})
    .then((users) => {
      res.status(ERROR_CODE_OK).send({ data: users });
    })
    .catch((err) => {
      res.status(ERROR_CODE_OTHER).send({ message: `Что-то пошло не так: ${err.message}` });
    });
};

module.exports.getUserById = (req, res) => {
  User
    .findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(ERROR_CODE_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_CODE_FIND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE_VALID).send({ message: 'Переданые некорректные данные идентификатора пользователя' });
      } else {
        res.status(ERROR_CODE_OTHER).send({ message: `Что-то пошло не так: ${err.message}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User
    .create({ name, about, avatar })
    .then((user) => {
      res.status(ERROR_CODE_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_VALID).send({ message: `Переданые некорректные данные при создании пользователя: ${err.message}` });
      } else {
        res.status(ERROR_CODE_OTHER).send({ message: `Что-то пошло не так: ${err.message}` });
      }
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
      res.status(ERROR_CODE_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_VALID).send({ message: `Переданые некорректные данные при изменении данных пользователя: ${err.message}` });
      } else {
        res.status(ERROR_CODE_OTHER).send({ message: `Что-то пошло не так: ${err.message}` });
      }
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
      res.status(ERROR_CODE_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_VALID).send({ message: `Переданые некорректные данные при изменении данных пользователя: ${err.message}` });
      } else {
        res.status(ERROR_CODE_OTHER).send({ message: `Что-то пошло не так: ${err.message}` });
      }
    });
};
