const express = require("express");
const router = express.Router();
const passwordValidator = require("../Middlewares/passwordValidator")
const verifyToken = require("../Middlewares/auth")
const { login, register, verifyUser, getRefreshToken, forgotPassword, resetPassword, getLastVisitedCourseName } = require("../Controllers/loginController"); 
const verifyRoles = require("../Middlewares/verifyRoles");

router.post("/login", login);
router.post("/register", passwordValidator, register)
router.get("/verify", verifyUser);
router.post("/forgotPassword", forgotPassword)
router.get("/getRefreshToken", verifyToken, getRefreshToken);
router.post("/resetPassword", resetPassword) //podemos utilizar tanto post como patch

router.get("/lastVisitedCourse/:userId", verifyToken, verifyRoles('administrator', 'author', 'designer', 'editor'), getLastVisitedCourseName);

module.exports = router;