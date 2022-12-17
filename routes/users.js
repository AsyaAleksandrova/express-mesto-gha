const router = require('express').Router();
const { ObjectId } = require('mongoose').Types;
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, updateUserInfo, updateUserAvatar, getMyUser,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getMyUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/https*:\/\/\w+/),
  }),
}), updateUserAvatar);

module.exports = router;
