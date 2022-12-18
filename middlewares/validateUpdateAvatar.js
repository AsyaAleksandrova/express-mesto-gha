const { celebrate, Joi } = require('celebrate');

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/https*:\/\/\w+/),
  }),
});

module.exports = validateUpdateAvatar;
