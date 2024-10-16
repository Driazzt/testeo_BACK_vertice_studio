const express = require("express");
const router = express.Router();
const passwordValidator = require("../Middlewares/passwordValidator")
const verifyToken = require("../Middlewares/auth")
const { login, register, getRefreshToken, forgotPassword, resetPassword } = require("../Controllers/loginController"); 


router.post("/login", login);
router.post("/register", passwordValidator, register)
router.post("/forgotPassword", forgotPassword)
router.get("/getRefreshToken", verifyToken, getRefreshToken);
router.post("/resetPassword", resetPassword) //podemos utilizar tanto post como patch

module.exports = router;