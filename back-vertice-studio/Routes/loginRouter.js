const express = require("express");
const router = express.Router();
const passwordValidator = require("../Middlewares/passwordValidator")
const verifyToken = require("../Middlewares/auth")

const { 
    login,
    register,
    verifyUser,
    getRefreshToken,
    forgotPassword,
    resetPassword
} = require("../Controllers/loginController"); 


//! http://localhost:5432/api-doc-postgres -> link para ver los swaggers de PostgreSQL PORT 5432

/**
 * @swagger
 * /login/login:
 *  post:
 *    tags: [Login | PORT 5432]
 *    summary: Iniciar sesión
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: Inicio de sesión exitoso
 *      401:
 *        description: Credenciales inválidas
 */
router.post("/login", login);

/**
 * @swagger
 * /login/register:
 *  post:
 *    tags: [Login | PORT 5432]
 *    summary: Registrar un nuevo usuario
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      201:
 *        description: Usuario registrado exitosamente
 *      400:
 *        description: Error en la validación de los datos
 */
router.post("/register", passwordValidator, register);

/**
 * @swagger
 * /login/verify:
 *  get:
 *    tags: [Login | PORT 5432]
 *    summary: Verificar usuario
 *    parameters:
 *      - in: query
 *        name: token
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Usuario verificado exitosamente
 *      400:
 *        description: Token inválido o expirado
 */
router.get("/verify", verifyUser);

/**
 * @swagger
 * /login/forgotPassword:
 *  post:
 *    tags: [Login | PORT 5432]
 *    summary: Solicitar restablecimiento de contraseña
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *    responses:
 *      200:
 *        description: Enlace de restablecimiento de contraseña enviado
 *      400:
 *        description: Error al enviar el enlace de restablecimiento
 */
router.post("/forgotPassword", forgotPassword)

/**
 * @swagger
 * /login/getRefreshToken:
 *  get:
 *    tags: [Login | PORT 5432]
 *    summary: Obtener un nuevo token de acceso
 *    parameters:
 *      - in: header
 *        name: auth-token
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Nuevo token de acceso generado
 *      401:
 *        description: Token inválido o expirado
 */
router.get("/getRefreshToken", verifyToken, getRefreshToken);

/**
 * @swagger
 * /login/resetPassword:
 *  post:
 *    tags: [Login | PORT 5432]
 *    summary: Restablecer la contraseña
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *              newPassword:
 *                type: string
 *              confirmPassword:
 *                type: string
 *    responses:
 *      200:
 *        description: Contraseña restablecida exitosamente
 *      400:
 *        description: Token inválido o expirado
 */
router.post("/resetPassword", resetPassword)

module.exports = router;