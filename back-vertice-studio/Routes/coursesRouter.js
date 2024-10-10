const express = require("express");
const router = express.Router();

//!Enrutados

const {
  getAllCourses,
  createCourses,
  getCoursesById,
  updateCoursesById,
  deleteCoursesById,
} = require ("../Controllers/coursesController");

//! Rutas

router.get("/", getAllCourses);
router.post("/createCourses", createCourses);
// router.get("/:idCourses", getCoursesById);
// router.patch("/:idCourses", updateCoursesById);
// router.delete("/:idCourses", deleteCoursesById);

module.exports = router;