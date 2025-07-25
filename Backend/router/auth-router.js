const express = require("express");
const router = express.Router();

const {
  home,
  register,
  login,
  getUser,
  logout,
  updateProfile,
} = require('../Controllers/auth-controller');

const authMiddleware = require('../Middlewares/authMiddleware');

router.get('/', home);
router.post('/register', register);
router.post('/login', login);
router.get('/user-profile', authMiddleware, getUser);
router.put('/update-profile', authMiddleware, updateProfile);
router.post('/logout', logout);

module.exports = router;
