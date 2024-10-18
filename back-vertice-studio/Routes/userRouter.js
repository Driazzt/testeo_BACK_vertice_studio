const express = require("express");
const passwordValidator = require("../Middlewares/passwordValidator");
const verifyToken = require("../Middlewares/auth");
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, getMyProfile, updateMyProfile, updateLastVisitedCourse } = require("../Controllers/userController");
const verifyRoles = require("../Middlewares/verifyRoles");
const router = express.Router();


router.post("/createUser", verifyToken, passwordValidator, verifyRoles('administrator'), createUser);
router.get("/getAllUsers", verifyToken, verifyRoles('administrator'), getAllUsers);
router.get("/getMyProfile", verifyToken, getMyProfile);
router.patch("/updateMyProfile", verifyToken, updateMyProfile);
router.get("/getUserById/:id", verifyToken, verifyRoles('administrator'), getUserById);
router.patch("/updateUser/:id", verifyToken, verifyRoles('administrator'), updateUser);
router.delete("/deleteUser/:id", verifyToken, verifyRoles('administrator'), deleteUser);
router.patch("/updateLastVisitedCourse", verifyToken, verifyRoles('administrator', 'author', 'designer', 'editor'), updateLastVisitedCourse);

module.exports = router;