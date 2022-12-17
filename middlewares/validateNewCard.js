const { celebrate, Joi } = require('celebrate');

const validateNewCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(/https*:\/\/\w+/),
  }),
});

module.exports = validateNewCard;
