const jwt = require("jsonwebtoken");

const verifyDesigner = (req, res, next) => {
  const token = req.headers['auth-token'];

  if (!token) {
    return res.status(401).send("Access Denied | No token provided.");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.userRole !== "designer") {
      return res.status(403).send("Access Denied | You need to be a designer.");
    }

    req.payload = payload;
    next();
  } catch (error) {
    return res.status(400).send("Invalid token or token has expired.");
  }
};

module.exports = verifyDesigner;