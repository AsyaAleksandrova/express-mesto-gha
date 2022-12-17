const Card = require('../models/card');
const OtherServerError = require('../errors/OtherServerError'); // 500 ERROR_CODE_OTHER
const NotFoundError = require('../errors/NotFoundError'); // 404 ERROR_CODE_FIND
const ValidationError = require('../errors/ValidationError'); // 400 ERROR_CODE_VALID

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch((err) => {
      next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card
    .create({ name, link, owner })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`Переданые некорректные данные при создании карточки: ${err.message}`));
      } else {
        next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card
    .findByIdAndRemove(req.params.cardId)
    .orFail(() => next(new NotFoundError('Запрашиваемая карточка не найдена')))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new ValidationError('Переданые некорректные данные идентификатора карточки'));
      } else {
        next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => next(new NotFoundError('Запрашиваемая карточка не найдена')))
    .populate('owner')
    .populate('likes')
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданые некорректные данные идентификатора карточки'));
      } else {
        next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => next(new NotFoundError('Запрашиваемая карточка не найдена')))
    .populate('owner')
    .populate('likes')
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданые некорректные данные идентификатора карточки'));
      } else {
        next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
      }
    });
};
