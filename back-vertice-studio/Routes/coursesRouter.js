const express = require("express");
const router = express.Router();
const verifyToken = require("../Middlewares/auth");
const verifyEditor = require("../Middlewares/verifyEditor");
const verifyAdmin = require("../Middlewares/verifyAdmin");
const verifyAuthor = require("../Middlewares/verifyAuthor");
const verifyDesigner = require("../Middlewares/verifyDesigner");

//!Enrutados

const {
  getAllCourses,
  createCourses,
  getCoursesById,
  updateCoursesById,
  deleteCoursesById,
} = require ("../Controllers/coursesController");

//! Rutas
// http://localhost:8000/api-doc -> para ver los swaggers.

router.get("/getAllCourses", verifyToken, verifyAdmin, verifyAuthor, verifyDesigner, verifyEditor, getAllCourses);
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

router.post("/createCourses", verifyToken, verifyAdmin, verifyAuthor, verifyDesigner, verifyEditor, createCourses);
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

router.get("/getCoursesById/:_id", verifyToken, verifyAdmin, verifyAuthor, verifyDesigner, verifyEditor, getCoursesById);
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

router.patch("/updateCourse/:_id", verifyToken, verifyAdmin, verifyAuthor, verifyDesigner, verifyEditor, updateCoursesById);
router.delete("/deleteCourse/:_id", verifyToken, verifyAdmin, verifyEditor, deleteCoursesById);

module.exports = router;