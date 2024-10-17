const emailForgotPasswordTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
        }
        p {
            font-size: 16px;
            color: #555;
        }
        a.button {
            display: inline-block;
            background-color: #aedfe3;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        a.button:hover {
            background-color: #aedfe3;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>Restablecer Contraseña</h1>
        <p>Hola <strong>{{name}}</strong>,</p>
        <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no has hecho esta solicitud, puedes ignorar este correo.</p>
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
        <p>
            <a href="{{reset_link}}" class="button">Restablecer Contraseña</a>
        </p>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <p>Gracias,<br>El equipo de Grupo Vértice</p>
    </div>

</body>
</html>
`
module.exports = { emailForgotPasswordTemplate };