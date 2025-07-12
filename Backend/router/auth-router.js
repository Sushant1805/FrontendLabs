const express = require("express");
const router = express.Router();
const {home,register} = require('../Controllers/auth-controller');

router.get('/',home);
router.route('/register').post(register);

module.exports = router

