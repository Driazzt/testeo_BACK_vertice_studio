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
  publishCourse,
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

//! http://localhost:8000/api-doc-mongo -> para ver los swaggers de MongoDB PORT 8000.

/**
 * @swagger
 * /courses/getAllCourses:
 *  get:
 *    tags: [Courses | PORT 8000]
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
router.get("/getAllCourses", verifyToken, getAllCourses);

/**
 * @swagger
 * /courses/createCourses:
 *  post:
 *    tags: [Courses | PORT 8000]
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
 *              html:
 *                type: string
 *              css:
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
router.post("/createCourses", verifyToken, createCourses);

/**
 * @swagger
 * /courses/favoriteCourse:
 *  post:
 *    tags: [Courses | PORT 8000]
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
router.post('/favoriteCourse', verifyToken, markCourseAsFavorite);

/**
 * @swagger
 * /courses/removeFavoriteCourse:
 *  post:
 *    tags: [Courses | PORT 8000]
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
router.post('/removeFavoriteCourse', verifyToken, removeCourseFromFavorites);

/**
 * @swagger
 * /courses/getCoursesById/{_id}:
 *  get:
 *    tags: [Courses | PORT 8000]
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
router.get("/getCoursesById/:_id", verifyToken, getCoursesById);

/**
 * @swagger
 * /courses/updateCourse/{_id}:
 *  patch:
 *    tags: [Courses | PORT 8000]
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
 *              html:
 *                type: string
 *              css:
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
router.patch("/updateCourse/:_id", verifyToken, updateCourseById);

/**
 * @swagger
 * /courses/deleteCourse/{_id}:
 *  delete:
 *    tags: [Courses | PORT 8000]
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
router.delete("/deleteCourse/:_id", verifyToken, verifyRoles('administrator', 'editor'), deleteCoursesById);

/**
 * @swagger
 * /courses/publishCourse/{courseId}:
 *  patch:
 *    tags: [Courses | PORT 8000]
 *    summary: Publicar un curso
 *    parameters:
 *      - in: header
 *        name: auth-token
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: courseId
 *        required: true
 *        description: ID del curso a publicar
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Curso publicado exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: success
 *                courseId:
 *                  type: string
 *                  example: 60d0fe4f5311236168a109ca
 *                published:
 *                  type: boolean
 *                  example: true
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Curso no encontrado
 *      500:
 *        description: Error interno del servidor
 */
router.patch('/publishCourse/:courseId', verifyToken, verifyRoles('administrator', 'editor'), publishCourse);

/**
 * @swagger
 * /courses/{_id}/lessons:
 *  get:
 *    tags: [Courses-Lessons | PORT 8000]
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
router.get('/:_id/lessons', verifyToken, getAllLessons);

/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}:
 *  get:
 *    tags: [Courses-Lessons | PORT 8000]
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
router.get('/:_id/lessons/:lessonId', verifyToken, getLessonById);

/**
 * @swagger
 * /courses/{_id}/lessons:
 *  post:
 *    tags: [Courses-Lessons | PORT 8000]
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
router.post('/:_id/lessons', verifyToken, createLesson);

/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}:
 *  patch:
 *    tags: [Courses-Lessons | PORT 8000]
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
router.patch('/:_id/lessons/:lessonId', verifyToken, updateLessonById);

/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}:
 *  delete:
 *    tags: [Courses-Lessons | PORT 8000]
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
router.delete('/:_id/lessons/:lessonId', verifyToken, deleteLessonById);

/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}/screens:
 *  get:
 *    tags: [Courses-Lessons-Screens | PORT 8000]
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
router.post('/:_id/lessons/:lessonId/screens', verifyToken, createScreen);

/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}/screens/{screenId}:
 *  get:
 *    tags: [Courses-Lessons-Screens | PORT 8000]
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
router.get('/:_id/lessons/:lessonId/screens', verifyToken, getAllScreens);

/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}/screens:
 *  post:
 *    tags: [Courses-Lessons-Screens | PORT 8000]
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
router.get('/:_id/lessons/:lessonId/screens/:screenId', verifyToken, getScreenById);

/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}/screens/{screenId}:
 *  patch:
 *    tags: [Courses-Lessons-Screens | PORT 8000]
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
router.patch('/:_id/lessons/:lessonId/screens/:screenId', verifyToken, updateScreenById);

/**
 * @swagger
 * /courses/{_id}/lessons/{lessonId}/screens/{screenId}:
 *   delete:
 *     tags: [Courses-Lessons-Screens | PORT 8000]
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
router.delete('/:_id/lessons/:lessonId/screens/:screenId', verifyToken, deleteScreenById);

module.exports = router;