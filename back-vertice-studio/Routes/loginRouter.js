const express = require("express");
const router = express.Router();
const { login } = require("../Controllers/loginController"); 
router.post("/login", login);

module.exports = router;