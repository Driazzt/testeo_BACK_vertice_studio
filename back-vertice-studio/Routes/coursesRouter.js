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
/**
 * @swagger
 * /courses/favoriteCourse:
 *  post:
 *    summary: Mark a course as favorite
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
 *              userId:
 *                type: string
 *              courseId:
 *                type: string
 *    responses:
 *      200:
 *        description: Course marked as favorite
 *      401:
 *        description: Unauthorized
 */

router.post('/removeFavoriteCourse', verifyToken, removeCourseFromFavorites);
/**
 * @swagger
 * /courses/removeFavoriteCourse:
 *  post:
 *    summary: Remove a course from favorites
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
 *              userId:
 *                type: string
 *              courseId:
 *                type: string
 *    responses:
 *      200:
 *        description: Course removed from favorites
 *      401:
 *        description: Unauthorized
 */

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

router.patch("/updateCourse/:_id", verifyToken, verifyRoles('administrator', 'author', 'designer', 'editor'), updateCourseById);
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
/**
 * @swagger
 * /courses/deleteCourse/{_id}:
 *  delete:
 *    summary: Delete course by ID
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
 *    responses:
 *      200:
 *        description: Course deleted successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Course not found
 */

router.get('/:_id/lessons', verifyToken, getAllLessons);
/**
 * @swagger
 * /courses/{_id}/lessons:
 *  get:
 *    summary: Get all lessons of a course
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
 *    responses:
 *      200:
 *        description: List of all lessons
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Course not found
 */

router.get('/:_id/lessons/:lessonId', verifyToken, getLessonById);
/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}:
 *  get:
 *    summary: Get lesson by ID
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
 *      - in: path
 *        name: lessonId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Lesson details
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Lesson not found
 */

router.post('/:_id/lessons', verifyToken, createLesson);
/**
 * @swagger
 * /courses/{_id}/lessons:
 *  post:
 *    summary: Create a new lesson
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
 *              content:
 *                type: string
 *              media:
 *                type: string
 *              screens:
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
 *    responses:
 *      201:
 *        description: Lesson created successfully
 *      401:
 *        description: Unauthorized
 */

router.patch('/:_id/lessons/:lessonId', verifyToken, updateLessonById);
/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}:
 *  patch:
 *    summary: Update lesson by ID
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
 *      - in: path
 *        name: lessonId
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
 *              content:
 *                type: string
 *              media:
 *                type: string
 *              screens:
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
 *    responses:
 *      200:
 *        description: Lesson updated successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Lesson not found
 */

router.delete('/:_id/lessons/:lessonId', verifyToken, deleteLessonById);
/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}:
 *  delete:
 *    summary: Delete lesson by ID
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
 *      - in: path
 *        name: lessonId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Lesson deleted successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Lesson not found
 */

router.post('/:_id/lessons/:lessonId/screens', verifyToken, createScreen);
/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}/screens:
 *  get:
 *    summary: Get all screens of a lesson
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
 *      - in: path
 *        name: lessonId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: List of all screens
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Lesson not found
 */

router.get('/:_id/lessons/:lessonId/screens', verifyToken, getAllScreens);
/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}/screens/{screenId}:
 *  get:
 *    summary: Get screen by ID
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
 *      - in: path
 *        name: lessonId
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: screenId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Screen details
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Screen not found
 */

router.get('/:_id/lessons/:lessonId/screens/:screenId', verifyToken, getScreenById);
/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}/screens:
 *  post:
 *    summary: Create a new screen
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
 *      - in: path
 *        name: lessonId
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
 *              content:
 *                type: string
 *              media:
 *                type: string
 *    responses:
 *      201:
 *        description: Screen created successfully
 *      401:
 *        description: Unauthorized
 */

router.patch('/:_id/lessons/:lessonId/screens/:screenId', verifyToken, updateScreenById);
/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}/screens/{screenId}:
 *  patch:
 *    summary: Update screen by ID
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
 *      - in: path
 *        name: lessonId
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: screenId
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
 *              content:
 *                type: string
 *              media:
 *                type: string
 *    responses:
 *      200:
 *        description: Screen updated successfully
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Screen not found
 */

router.delete('/:_id/lessons/:lessonId/screens/:screenId', verifyToken, deleteScreenById);
/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}/screens/{screenId}:
 *   delete:
 *     summary: Delete screen by ID
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         schema:
 *          type: string
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID of the course
 *         schema:
 *           type: string
 *       - in: path
 *         name: lessonId
 *         required: true
 *         description: ID of the lesson
 *         schema:
 *           type: string
 *       - in: path
 *         name: screenId
 *         required: true
 *         description: ID of the screen
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Screen deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Screen not found
 */

module.exports = router;