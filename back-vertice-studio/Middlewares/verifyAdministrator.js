const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  try {
    const payload = req.payload;

    if (payload.role !== "administrator") {
      return res.status(403).send("Access Denied / You have to be administrator.");
    }
    req.payload = payload;
    next();
  } catch (error) {
    res.status(400).send("Token has expired.");
  }
};

module.exports = verifyAdmin;