//authMiddleware
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const sessionService = require("../services/sessionService");

dotenv.config();

async function authMiddleware(req, res, next) {
  try {
    // =========================
    // TOKEN
    // =========================

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Acesso não autorizado",
      });
    }

    // =========================
    // JWT
    // =========================

    const decoded = jwt.verify(token, process.env.JWT_SECURITY);

    // =========================
    // validate jwt
    // =========================

    const sessionValid = await sessionService.isValidToken(
      sessionService.SCOPES.ADMIN,
      decoded.id,
      decoded.jti,
      token
    );

    if (!sessionValid) {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
      });
    }

    // =========================
    // SAVE USER
    // =========================

    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido",
    });
  }
}

module.exports = authMiddleware;
