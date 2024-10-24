const express = require("express");
const passwordValidator = require("../Middlewares/passwordValidator");
const verifyToken = require("../Middlewares/auth");
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, getMyProfile, updateMyProfile, updateLastVisitedCourse } = require("../Controllers/userController");
const verifyRoles = require("../Middlewares/verifyRoles");
const router = express.Router();

//! http://localhost:5432/api-doc-postgres -> link para ver los swaggers de PostgreSQL PORT 5432

/**
 * @swagger
 * /user/createUser:
 *  post:
 *    tags: [User | PORT 5432]
 *    summary: Crear un nuevo usuario
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
 *            required:
 *              - firstName
 *              - lastName
 *              - username
 *              - email
 *              - password
 *              - role
 *            properties:
 *              firstName:
 *                type: string
 *                description: El nombre del usuario
 *              lastName:
 *                type: string
 *                description: El apellido del usuario
 *              username:
 *                type: string
 *                description: El nombre de usuario
 *              email:
 *                type: string
 *                description: El correo electrónico del usuario
 *              password:
 *                type: string
 *                description: La contraseña del usuario (mínimo 8 caracteres, debe incluir letras y números)
 *              role:
 *                type: string
 *                description: El rol del usuario (e.g., administrador, usuario)
 *    responses:
 *      201:
 *        description: Usuario creado exitosamente
 *      401:
 *        description: No autorizado
 *      403:
 *        description: Prohibido
 */
router.post("/createUser", verifyToken, passwordValidator, verifyRoles('administrator'), createUser);

/**
 * @swagger
 * /user/getAllUsers:
 *  get:
 *    tags: [User | PORT 5432]
 *    summary: Obtener todos los usuarios
 *    parameters:
 *      - in: header
 *        name: auth-token
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Lista de todos los usuarios
 *      401:
 *        description: No autorizado
 *      403:
 *        description: Prohibido
 */
router.get("/getAllUsers", verifyToken, verifyRoles('administrator'), getAllUsers);

/**
 * @swagger
 * /user/getMyProfile:
 *  get:
 *    tags: [User - Profile | PORT 5432]
 *    summary: Obtener el perfil del usuario autenticado
 *    parameters:
 *      - in: header
 *        name: auth-token
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Perfil del usuario autenticado
 *      401:
 *        description: No autorizado
 */
router.get("/getMyProfile", verifyToken, getMyProfile);

/**
 * @swagger
 * /user/updateMyProfile:
 *  patch:
 *    tags: [User - Profile | PORT 5432]
 *    summary: Actualizar el perfil del usuario autenticado
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
 *              firstName:
 *                type: string
 *                description: El nombre del usuario
 *              lastName:
 *                type: string
 *                description: El apellido del usuario
 *              username:
 *                type: string
 *                description: El nombre de usuario
 *              password:
 *                type: string
 *                description: La password del usuario
 *              avatar:
 *                type: string
 *                description: El avatar del usuario
 *    responses:
 *      200:
 *        description: Perfil actualizado exitosamente
 *      401:
 *        description: No autorizado
 */
router.patch("/updateMyProfile", verifyToken, updateMyProfile);

/**
 * @swagger
 * /user/getUserById/{id}:
 *  get:
 *    tags: [User | PORT 5432]
 *    summary: Obtener un usuario por ID
 *    parameters:
 *      - in: header
 *        name: auth-token
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID del usuario
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Datos del usuario
 *      401:
 *        description: No autorizado
 *      403:
 *        description: Prohibido
 *      404:
 *        description: Usuario no encontrado
 */
router.get("/getUserById/:id", verifyToken, verifyRoles('administrator'), getUserById);

/**
 * @swagger
 * /user/updateUser/{id}:
 *  patch:
 *    tags: [User | PORT 5432]
 *    summary: Actualizar un usuario por ID
 *    parameters:
 *      - in: header
 *        name: auth-token
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID del usuario
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *                description: El nombre del usuario
 *              lastName:
 *                type: string
 *                description: El apellido del usuario
 *              username:
 *                type: string
 *                description: El nombre de usuario
 *              email:
 *                type: string
 *                description: El correo electrónico del usuario
 *              role:
 *                type: string
 *                description: El role del usuario
 *    responses:
 *      200:
 *        description: Usuario actualizado exitosamente
 *      401:
 *        description: No autorizado
 *      403:
 *        description: Prohibido
 *      404:
 *        description: Usuario no encontrado
 */
router.patch("/updateUser/:id", verifyToken, verifyRoles('administrator'), updateUser);

/**
 * @swagger
 * /user/deleteUser/{id}:
 *  delete:
 *    tags: [User | PORT 5432]
 *    summary: Eliminar un usuario por ID
 *    parameters:
 *      - in: header
 *        name: auth-token
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID del usuario
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Usuario eliminado exitosamente
 *      401:
 *        description: No autorizado
 *      403:
 *        description: Prohibido
 *      404:
 *        description: Usuario no encontrado
 */
router.delete("/deleteUser/:id", verifyToken, verifyRoles('administrator'), deleteUser);

/**
 * @swagger
 * /user/updateLastVisitedCourse:
 *  patch:
 *    tags: [User | PORT 5432]
 *    summary: Actualizar el último curso visitado del usuario autenticado
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
 *                description: El ID del usuario
 *              courseId:
 *                type: string
 *                description: El ID del curso
 *    responses:
 *      200:
 *        description: Último curso visitado actualizado exitosamente
 *      401:
 *        description: No autorizado
 */
router.patch("/updateLastVisitedCourse", verifyToken, updateLastVisitedCourse);

module.exports = router;