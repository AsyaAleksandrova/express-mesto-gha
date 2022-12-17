const router = require('express').Router();
const validateUserId = require('../middlewares/validations');
const validateUpdate = require('../middlewares/validations');

const {
  getUsers, getUserById, updateUserInfo, updateUserAvatar, getMyUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMyUser);
router.get('/users/:userId', validateUserId, getUserById);
router.patch('/users/me', validateUpdate, updateUserInfo);
router.patch('/users/me/avatar', validateUpdate, updateUserAvatar);

module.exports = router;
