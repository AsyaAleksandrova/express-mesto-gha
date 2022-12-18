const { celebrate, Joi } = require('celebrate');

const validateNewUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https*:\/\/\w+/),
    email: Joi.string().required().regex(/\w+@\w+\.\w+/),
    password: Joi.string().required(),
  }),
});

module.exports = validateNewUser;
