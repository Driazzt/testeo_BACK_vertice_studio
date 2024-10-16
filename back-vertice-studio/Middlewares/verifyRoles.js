const jwt = require('jsonwebtoken');

const verifyRoles = (...roles) => {
  return (req, res, next) => {
    try {
      const token = req.headers['auth-token'];
      if (!token) {
        return res.status(401).json({ message: 'No token, auth-token denied' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token con tu clave secreta
      const userRole = decoded.userRole; // Extrae el rol del usuario

      // Verifica si el rol del usuario está entre los roles permitidos
      if (!roles.includes(userRole)) {
        return res.status(403).json({   message: `Access denied. You need one of the following roles: ${roles.join(', ')}`, });
      }

      req.payload = decoded; // Almacena la información del usuario en la request
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = verifyRoles;
