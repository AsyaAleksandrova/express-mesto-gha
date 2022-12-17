const { celebrate, Joi } = require('celebrate');

const validateUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https*:\/\/\w+/),
  }),
});

module.exports = validateUpdate;
