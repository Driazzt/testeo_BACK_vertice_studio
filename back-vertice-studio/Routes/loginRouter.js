const express = require("express");
const router = express.Router();
const passwordValidator = require("../Middlewares/passwordValidator")
const { login, register } = require("../Controllers/loginController"); 


router.post("/login", login);
router.post("/register", passwordValidator, register)

module.exports = router;