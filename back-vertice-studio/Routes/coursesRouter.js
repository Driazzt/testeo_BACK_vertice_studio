const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  createCourses,
  getCoursesById,
  updateCourseById,
  deleteCoursesById,
  publishCourse,
  markCourseAsFavorite,
  removeCourseFromFavorites,
  getLessonById,
  getAllLessons,
  createLesson,
  updateLessonById,
  deleteLessonById,
  createScreen,
  getAllScreens,
  getScreenById,
  updateScreenById,
  deleteScreenById,
  updateCourses,
  updateAuthors,
  syncCourseMetadata
} = require("../Controllers/coursesController");

//! Rutas de Cursos
router.get("/getAllCourses", getAllCourses);
router.post("/createCourses", createCourses);
router.get("/getCoursesById/:_id", getCoursesById);
router.put("/updateCourseById/:_id", updateCourseById);
router.delete("/deleteCoursesById/:_id", deleteCoursesById);
router.post("/publishCourse/:courseId", publishCourse);
router.post("/markCourseAsFavorite", markCourseAsFavorite);
router.post("/removeCourseFromFavorites", removeCourseFromFavorites);
router.get("/getAllLessons/:_id", getAllLessons);
router.get("/getLessonById/:_id/:lessonId", getLessonById);
router.post("/createLesson/:_id", createLesson);
router.put("/updateLessonById/:_id/:lessonId", updateLessonById);
router.delete("/deleteLessonById/:_id/:lessonId", deleteLessonById);
router.post("/createScreen/:_id/:lessonId", createScreen);
router.get("/getAllScreens/:_id/:lessonId", getAllScreens);
router.get("/getScreenById/:_id/:lessonId/:screenId", getScreenById);
router.put("/updateScreenById/:_id/:lessonId/:screenId", updateScreenById);
router.delete("/deleteScreenById/:_id/:lessonId/:screenId", deleteScreenById);
router.post("/syncCourseMetadata", syncCourseMetadata);
module.exports = router;