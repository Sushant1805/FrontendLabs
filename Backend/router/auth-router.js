const express = require("express");
const router = express.Router();
const {home,register,login,getUser} = require('../Controllers/auth-controller');
const authMiddleware = require('../Middlewares/authMiddleware');


router.get('/',home);
router.route('/register').post(register);
router.route('/login').post(login);
router.get('/user-profile', authMiddleware, getUser)


module.exports = router

