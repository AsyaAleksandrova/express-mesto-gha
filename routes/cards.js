const router = require('express').Router();
const validateNewCard = require('../middlewares/validations');
const validateCardId = require('../middlewares/validations');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard, checkRights,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', validateNewCard, createCard);
router.delete('/cards/:cardId', validateCardId, checkRights, deleteCard);
router.put('/cards/:cardId/likes', validateCardId, likeCard);
router.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
