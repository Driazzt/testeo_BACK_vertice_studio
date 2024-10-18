const express = require("express");
const passwordValidator = require("../Middlewares/passwordValidator");
const verifyToken = require("../Middlewares/auth");
const verifyAdmin = require("../Middlewares/verifyAdmin");
const verifyEditor = require("../Middlewares/verifyEditor");
const verifyAuthor = require("../Middlewares/verifyAuthor");
const verifyDesigner = require("../Middlewares/verifyDesigner");
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, getMyProfile, updateMyProfile } = require("../Controllers/userController");

const router = express.Router();

router.post("/createUser", verifyToken, passwordValidator, verifyAdmin, createUser);
router.get("/getAllUsers", verifyToken, verifyAdmin, getAllUsers);
router.get("/getMyProfile", verifyToken, getMyProfile);
router.patch("/updateMyProfile", verifyToken, updateMyProfile);
router.get("/getUserById/:id", verifyToken, verifyAdmin, getUserById);
router.patch("/updateUser/:id", verifyToken, verifyAdmin, updateUser);
router.delete("/deleteUser/:id", verifyToken, verifyAdmin, deleteUser);

module.exports = router;