const jwt = require('jsonwebtoken');

const verifyRoles = (...roles) => {
  return (req, res, next) => {
    try {
      const token = req.headers['auth-token'];
      if (!token) {
        return res.status(401).json({ message: 'No token, auth-token denied' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userRole = decoded.userRole;

      if (!roles.includes(userRole)) {
        return res.status(403).json({   message: `Access denied. You need one of the following roles: ${roles.join(', ')}`, });
      }

      req.payload = decoded;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = verifyRoles;
