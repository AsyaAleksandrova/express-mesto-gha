const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_STRING = 'Nsl8TZXJzSYmL7TC5v5fRSaUPrUMas4TAap0NKqjqnaH3Q+0gSETQRRQz/3FYxW1zsQ8FC6QkwS2ZM4+auHH42C+dkbF1aA';

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const OtherServerError = require('../errors/OtherServerError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const AuthError = require('../errors/AuthError');
const ConflictError = require('../errors/ConflictError');

const MESSAGE_AUTH = 'Неправильные почта или пароль';

module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
    });
};

module.exports.getUserById = (req, res, next) => {
  User
    .findById(req.params.userId)
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданые некорректные данные идентификатора пользователя'));
      } else {
        next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
      }
    });
};

module.exports.getMyUser = (req, res, next) => {
  User
    .findById(req.user._id)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then((user) => {
      res.status(201).send({
        data: {
          name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`Переданые некорректные данные при создании пользователя: ${err.message}`));
      } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findOne({ email }).select('+password')
    .orFail(new AuthError(MESSAGE_AUTH))
    .then((user) => bcrypt.compare(password, user.password)
      .then((compare) => {
        if (!compare) {
          next(new AuthError(MESSAGE_AUTH));
        } else {
          const token = jwt.sign({ _id: user._id }, JWT_STRING, { expiresIn: '7d' });
          res.status(200).send({ token });
        }
      }))
    .catch((err) => {
      next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`Переданые некорректные данные при изменении данных пользователя: ${err.message}`));
      } else {
        next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`Переданые некорректные данные при изменении данных пользователя: ${err.message}`));
      } else {
        next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
      }
    });
};
