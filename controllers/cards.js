const Card = require('../models/card');
const OtherServerError = require('../errors/OtherServerError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

const MESSAGE_NOT_FOUND = 'Запрашиваемая карточка не найдена';
const MESSAGE_VALIDATION_ID = 'Переданые некорректные данные идентификатора карточки';

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
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

module.exports.checkRights = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .orFail()
    .then((card) => {
      const { owner } = card;
      if (owner.toString() !== req.user._id) {
        next(new ForbiddenError('Отсутствуют права на удаление карточки'));
        return;
      }
      next();
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(MESSAGE_NOT_FOUND));
      } else {
        next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card
    .findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(MESSAGE_VALIDATION_ID));
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
    .orFail()
    .populate('owner')
    .populate('likes')
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(MESSAGE_VALIDATION_ID));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(MESSAGE_NOT_FOUND));
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
    .orFail()
    .populate('owner')
    .populate('likes')
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(MESSAGE_VALIDATION_ID));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(MESSAGE_NOT_FOUND));
      } else {
        next(new OtherServerError(`Что-то пошло не так: ${err.message}`));
      }
    });
};
