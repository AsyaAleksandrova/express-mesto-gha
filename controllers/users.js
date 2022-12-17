const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const OtherServerError = require('../errors/OtherServerError'); // 500 ERROR_CODE_OTHER
const NotFoundError = require('../errors/NotFoundError'); // 404 ERROR_CODE_FIND
const ValidationError = require('../errors/ValidationError'); // 400 ERROR_CODE_VALID
const AuthError = require('../errors/AuthError'); // 401 ERROR_CODE_AUTH
const ConflictError = require('../errors/ConflictError'); // 409

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
    .orFail()
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else if (err.name === 'CastError') {
        next(new ValidationError('Переданые некорректные данные идентификатора пользователя'));
      } else {
        next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`Переданые некорректные данные при создании пользователя: ${err.message}`));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findOne({ email })
    .orFail('Неправильные почта или пароль')
    .then((user) => {
      if (!bcrypt.compare(password, user.password)) {
        next(new AuthError('Неправильные почта или пароль'));
      } else {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        res.status(200).cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).end();
      }
    })
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
      { new: true, runValidators: true, upsert: false },
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
      { new: true, runValidators: true, upsert: false },
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
