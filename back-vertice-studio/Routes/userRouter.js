const express = require("express");
const verifyToken = require("../Middlewares/auth");
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require("../Controllers/userController");

const router = express.Router();

router.post("/createUser", createUser);
router.get("/getAllUsers", getAllUsers);
router.get("/getUserById/:id", verifyToken, getUserById);
router.patch("/updateUser/:id", verifyToken, updateUser);
router.delete("/deleteUser/:id", verifyToken, deleteUser);

module.exports = router;