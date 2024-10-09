const jwt = require("jsonwebtoken");

const verifytoken = (req, res, next) => {
  const token = req.header("auth-token");
  console.log("token", token);
  if (!token)
    return res
      .status(400)
      .send("Access Denied, you need to verify the Token first.");

  try {
    const payload = jwt.verify(token, process.env.PASSWORD_SECRET);
    req.payload = payload;
    next();
  } catch (error) {
    try {
      const payload = jwt.verify(token, process.env.PASSWORD_SECRET_REFRESH);
      req.payload = payload;
      next();
    } catch (error) {
      res.status(400).send("The token has expired, you need to refresh it.");
    }
  }
};

module.exports = verifytoken;