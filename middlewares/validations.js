const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const validateNewUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https*:\/\/\w+/),
    email: Joi.string().required().regex(/\w+@\w+\.\w+/),
    password: Joi.string().required().min(8),
  }),
});

const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().regex(/\w+@\w+\.\w+/),
    password: Joi.string().required().min(8),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
});

const validateUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https*:\/\/\w+/),
  }),
});

const validateNewCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(/https*:\/\/\w+/),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
});

module.exports = validateNewUser;
module.exports = validateAuth;
module.exports = validateUserId;
module.exports = validateUpdate;
module.exports = validateNewCard;
module.exports = validateCardId;
