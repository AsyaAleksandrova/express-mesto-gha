const router = require('express').Router();
const validateUserId = require('../middlewares/validateUserId');
const validateUpdate = require('../middlewares/validateUpdate');
const validateUpdateAvatar = require('../middlewares/validateUpdateAvatar');

const {
  getUsers, getUserById, updateUserInfo, updateUserAvatar, getMyUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMyUser);
router.get('/users/:userId', validateUserId, getUserById);
router.patch('/users/me', validateUpdate, updateUserInfo);
router.patch('/users/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = router;
