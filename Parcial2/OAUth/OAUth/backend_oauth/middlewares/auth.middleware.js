const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/jwt.config.js");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];

  // Si no viene token
  if (!authHeader)
    return res.status(401).json({ msg: "Token requerido" });

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer")
    return res.status(401).json({ msg: "Formato inválido" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // guardar info del usuario
    next();
  } catch (e) {
    return res.status(401).json({ msg: "Token incorrecto" });
  }
};
