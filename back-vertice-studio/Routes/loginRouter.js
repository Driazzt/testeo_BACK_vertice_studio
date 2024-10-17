const express = require("express");
const router = express.Router();
const passwordValidator = require("../Middlewares/passwordValidator")
const verifyToken = require("../Middlewares/auth")
const { login, register, verifyUser, getRefreshToken } = require("../Controllers/loginController"); 


router.post("/login", login);
router.post("/register", passwordValidator, register)
router.get("/verify", verifyUser);
router.get("/getRefreshToken", verifyToken, getRefreshToken);

module.exports = router;