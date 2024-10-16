const express = require("express");
const router = express.Router();
const passwordValidator = require("../Middlewares/passwordValidator")
const verifyToken = require("../Middlewares/auth")
const { login, register, getRefreshToken, forgotPassword } = require("../Controllers/loginController"); 


router.post("/login", login);
router.post("/register", passwordValidator, register)
router.post("/forgotPassword", forgotPassword)
router.get("/getRefreshToken", verifyToken, getRefreshToken);

module.exports = router;