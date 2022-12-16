const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card
    .find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch((err) => {
      res.status(500).send({ message: `Что-то пошло не так: ${err.message}` });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card
    .create({ name, link, owner })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданые некорректные данные при создании карточки: ${err.message}` });
      }
      res.status(500).send({ message: `Что-то пошло не так: ${err.message}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card
    .findByIdAndRemove(req.params.cardId)
    .orFail(() => Error('Not found'))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.message === 'Not found') {
        if (req.params.cardId.length === 24) {
          req.status(404).send({ message: 'Запрашиваемая карточка не найдена.' });
        }
        res.status(400).send({ message: 'Переданые некорректные данные идентификатора карточки.' });
      }
      res.status(500).send({ message: `Что-то пошло не так: ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => Error('Not found'))
    .populate('owner')
    .populate('likes')
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.message === 'Not found') {
        if (req.params.cardId.length === 24) {
          req.status(404).send({ message: 'Запрашиваемая карточка не найдена.' });
        }
        res.status(400).send({ message: 'Переданые некорректные данные идентификатора карточки.' });
      }
      res.status(500).send({ message: `Что-то пошло не так: ${err.message}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => Error('Not found'))
    .populate('owner')
    .populate('likes')
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.message === 'Not found') {
        if (req.params.cardId.length === 24) {
          req.status(404).send({ message: 'Запрашиваемая карточка не найдена.' });
        }
        res.status(400).send({ message: 'Переданые некорректные данные идентификатора карточки.' });
      }
      res.status(500).send({ message: `Что-то пошло не так: ${err.message}` });
    });
};
