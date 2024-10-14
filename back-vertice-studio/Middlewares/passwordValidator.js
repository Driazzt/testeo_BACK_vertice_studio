const passwordValidator = (req, res, next) => {
    const { password } = req.body;
  
    // Definir el patrón de validación: al menos 8 caracteres, una letra mayúscula, una minúscula, numero y un carácter especial.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
      });
    }
    next();
  };
  
  module.exports = passwordValidator;