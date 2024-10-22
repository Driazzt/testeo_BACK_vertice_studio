const express = require("express");
const router = express.Router();
const verifyToken = require("../Middlewares/auth");
const verifyRoles = require("../Middlewares/verifyRoles");

//! Enrutados
const {
  getAllCourses,
  createCourses,
  getCoursesById,
  updateCourseById,
  deleteCoursesById,
  //saveCourse,
  markCourseAsFavorite,
  removeCourseFromFavorites,
  getAllLessons,
  getLessonById,
  createLesson,
  updateLessonById,
  deleteLessonById,
  createScreen,
  getAllScreens,
  getScreenById,
  updateScreenById,
  deleteScreenById,
} = require("../Controllers/coursesController");

//! Rutas
// http://localhost:8000/api-doc -> para ver los swaggers.

router.get("/getAllCourses", verifyToken, verifyRoles('administrator', 'author', 'designer', 'editor'), getAllCourses);
/**
 * @swagger
 * /courses/getAllCourses:
 *  get:
 *    summary: Get all the courses
 *    responses:
 *      201:
 *        description: Success
 *      404:
 *        description: Error.
 */

router.post("/createCourses", verifyToken, verifyRoles('administrator', 'author', 'designer', 'editor'), createCourses);
/**
 * @swagger
 * /courses/createCourses:
 *  post:
 *    summary: Añadir un nuevo curso
 *    requestBody:
 *       require: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                   type: string
 *                   example: "Electronica"
 *                description:
 *                   type: string
 *                   example: "Curso para aprender de electrónica"
 *                category:
 *                   type: string
 *                   example: "Mecánica"
 *                duration:
 *                   type: Number
 *                   example: 40
 *                level:
 *                   type: string []
 *                   enum: ["Principiante", "Intermedio", "Avanzado"]
 *                   example: "Principiante"
 *                instructor:
 *                   type: string
 *                   example: "Juan Perez"
 *                price:
 *                   type: Number
 *                   example: 30
 *                createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: "Fecha y hora de creación del curso"
 *                updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: "Fecha y hora de la última actualización del curso"
 *    responses:
 *      201:
 *        description: Nuevo curso creado correctamente
 *      404:
 *        description: Error al crear un nuevo curso
 */

router.post('/favoriteCourse', verifyToken, markCourseAsFavorite);

router.post('/removeFavoriteCourse', verifyToken, removeCourseFromFavorites);

router.get("/getCoursesById/:_id", verifyToken, verifyRoles('administrator', 'author', 'designer', 'editor'), getCoursesById);
/**
 * @swagger
 * /courses/getCoursesById/{_id}:
 *  get:
 *    summary: Obtener los cursos por ID
 *    parameters:
 *      - in: path
 *        name: _id
 *        require: true
 *        description: ID del curso
 *        schema:
 *          type: string
 *      - in: header
 *        name: auth-token
 *        require: true
 *        schema:
 *          type: string
 *    responses:
 *      201:
 *        description: Success
 *      404:
 *        description: Error al obtener los cursos por ID
 */

router.patch("/updateCourse/:_id", verifyToken, verifyRoles('administrator', 'author', 'designer', 'editor'), updateCourseById);

router.delete("/deleteCourse/:_id", verifyToken, verifyRoles('administrator', 'editor'), deleteCoursesById);

//router.post("/saveCourse", verifyToken, verifyRoles('administrator', 'author', 'designer', 'editor'), saveCourse);

router.get('/:_id/lessons', verifyToken, getAllLessons);

router.get('/:_id/lessons/:lessonId', verifyToken, getLessonById);

router.post('/:_id/lessons', verifyToken, createLesson);

router.patch('/:_id/lessons/:lessonId', verifyToken, updateLessonById);

router.delete('/:_id/lessons/:lessonId', verifyToken, deleteLessonById);

router.post('/:_id/lessons/:lessonId/screens', verifyToken, createScreen);

router.get('/:_id/lessons/:lessonId/screens', verifyToken, getAllScreens);

router.get('/:_id/lessons/:lessonId/screens/:screenId', verifyToken, getScreenById);

router.patch('/:_id/lessons/:lessonId/screens/:screenId', verifyToken, updateScreenById);

router.delete('/:_id/lessons/:lessonId/screens/:screenId', verifyToken, deleteScreenById);

module.exports = router;