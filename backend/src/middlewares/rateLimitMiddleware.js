const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config();

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW) * 60 * 1000, // 15 min
  max: Number(process.env.MAX_REQUISITIONS),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Muitas requisições de acesso.",
  },
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Muitas requisições de Login, Aguarde 10 minutos para tentar novamente!",
  },
});

module.exports = {
  limiter,
  loginLimiter,
};
