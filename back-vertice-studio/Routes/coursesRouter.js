const express = require("express");
const router = express.Router();
const verifyToken = require("../Middlewares/auth");
const verifyRoles = require("../Middlewares/verifyRoles");
//!Enrutados

const {
  getAllCourses,
  createCourses,
  getCoursesById,
  updateCoursesById,
  deleteCoursesById,
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
} = require ("../Controllers/coursesController");

//! Rutas
// http://localhost:8000/api-doc -> para ver los swaggers.

router.get("/getAllCourses", verifyToken, verifyRoles('administrator', 'author', 'designer', 'editor'), getAllCourses);
/**
 * @swagger
 * /courses/getAllCourses:
 *  get:
 *    parameters:
 *      - in: header
 *        name: auth-token
 *        require: true
 *        schema:
 *          type: string
 *    responses:
 *       200:
 *         description: List of all courses
 *       401:
 *         description: Unauthorized
 */

router.post("/createCourses", verifyToken, verifyRoles('administrator', 'author', 'designer', 'editor'), createCourses);
/**
 * @swagger
 * /courses/createCourses:
 *  post:
 *    summary: Create a new course
 *    parameters:
 *      - in: header
 *        name: auth-token
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              category:
 *                type: string
 *              duration:
 *                type: number
 *              level:
 *                type: string
 *                enum: [Principiante, Intermedio, Avanzado]
 *              instructor:
 *                type: string
 *              price:
 *                type: number
 *              image:
 *                type: string
 *              lessons:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                    content:
 *                      type: string
 *                    media:
 *                      type: string
 *                    screens:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          title:
 *                            type: string
 *                          content:
 *                            type: string
 *                          media:
 *                            type: string
 *    responses:
 *      201:
 *        description: Course created successfully
 *      401:
 *        description: Unauthorized
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
 *        description: Course details
 *      404:
 *        description: Error al obtener los cursos por ID
 */

router.patch("/updateCourse/:_id", verifyToken, verifyRoles('administrator', 'author', 'designer', 'editor'), updateCoursesById);
/**
 * @swagger
 * /courses/updateCourse/{_id}:
 *  patch:
 *    summary: Update course by ID
 *    parameters:
 *      - in: header
 *        name: auth-token
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: _id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              category:
 *                type: string
 *              duration:
 *                type: number
 *              level:
 *                type: string
 *                enum: [Principiante, Intermedio, Avanzado]
 *              instructor:
 *                type: string
 *              price:
 *                type: number
 *              image:
 *                type: string
 *              lessons:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                    content:
 *                      type: string
 *                    media:
 *                      type: string
 *                    screens:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          title:
 *                            type: string
 *                          content:
 *                            type: string
 *                          media:
 *                            type: string
 *    responses:
 *      200:
 *        description: Course updated successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Course not found
 */

router.delete("/deleteCourse/:_id", verifyToken, verifyRoles('administrator', 'editor'), deleteCoursesById);

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