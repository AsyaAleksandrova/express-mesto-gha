const Card = require('../models/card');

const handleErrorCards = (err, req) => {
  if (err.name === 'CastError' || err.name === 'DocumentNotFoundError') {
    if (req.params.cardId.length === 24) {
      return ({ status: 404, text: 'Запрашиваемая карточка не найдена' });
    }
    return ({ status: 400, text: 'Переданые некорректные данные идентификатора карточки' });
  } if (err.name === 'ValidationError' || err.name === 'StrictModeError') {
    return ({ status: 400, text: `Переданые некорректные данные при создании карточки: ${err.message}` });
  }
  return ({ status: 500, text: `Что-то пошло не так: ${err.message}` });
};

module.exports.getCards = (req, res) => {
  Card
    .find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch((err) => {
      const { status, text } = handleErrorCards(err, req);
      res.status(status).send({ message: text });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card
    .create({ name, link })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      const { status, text } = handleErrorCards(err, req);
      res.status(status).send({ message: text });
    });
};

module.exports.deleteCard = (req, res) => {
  Card
    .findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
    })
    .catch((err) => {
      const { status, text } = handleErrorCards(err, req);
      res.status(status).send({ message: text });
    });
};

module.exports.likeCard = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .populate('owner')
    .populate('likes')
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
    })
    .catch((err) => {
      const { status, text } = handleErrorCards(err, req);
      res.status(status).send({ message: text });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .populate('owner')
    .populate('likes')
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
    })
    .catch((err) => {
      const { status, text } = handleErrorCards(err, req);
      res.status(status).send({ message: text });
    });
};
