const Card = require('../models/card');

const ERROR_CODE_VALID = 400;
const ERROR_CODE_FIND = 404;
const ERROR_CODE_OTHER = 500;
const ERROR_CODE_OK = 200;

module.exports.getCards = (req, res) => {
  Card
    .find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch((err) => {
      res.status(ERROR_CODE_OTHER).send({ message: `Что-то пошло не так: ${err.message}` });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card
    .create({ name, link, owner })
    .then((card) => {
      res.status(ERROR_CODE_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_VALID).send({ message: `Переданые некорректные данные при создании карточки: ${err.message}` });
      }
      res.status(ERROR_CODE_OTHER).send({ message: `Что-то пошло не так: ${err.message}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card
    .findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.status(ERROR_CODE_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'DocumentNotFoundError') {
        if (req.params.cardId.length === 24) {
          res.status(ERROR_CODE_FIND).send({ message: 'Запрашиваемая карточка не найдена' });
        }
        res.status(ERROR_CODE_VALID).send({ message: 'Переданые некорректные данные идентификатора карточки' });
      }
      res.status(ERROR_CODE_OTHER).send({ message: `Что-то пошло не так: ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
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
      res.status(ERROR_CODE_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'DocumentNotFoundError') {
        if (req.params.cardId.length === 24) {
          res.status(ERROR_CODE_FIND).send({ message: 'Запрашиваемая карточка не найдена' });
        }
        res.status(ERROR_CODE_VALID).send({ message: 'Переданые некорректные данные идентификатора карточки' });
      }
      res.status(ERROR_CODE_OTHER).send({ message: `Что-то пошло не так: ${err.message}` });
    });
};

module.exports.dislikeCard = (req, res) => {
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
      res.status(ERROR_CODE_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'DocumentNotFoundError') {
        if (req.params.cardId.length === 24) {
          res.status(ERROR_CODE_FIND).send({ message: 'Запрашиваемая карточка не найдена' });
        }
        res.status(ERROR_CODE_VALID).send({ message: 'Переданые некорректные данные идентификатора карточки' });
      }
      res.status(ERROR_CODE_OTHER).send({ message: `Что-то пошло не так: ${err.message}` });
    });
};
