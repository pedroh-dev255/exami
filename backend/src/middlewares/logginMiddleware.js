const { logger, sanitize } = require("./utils/logger");

const logMiddleware = (req, res, next) => {
    const start = Date.now();

    const originalJson = res.json;

    let responseBody = null;

    res.json = function (body) {
        responseBody = body;
        return originalJson.call(this, body);
    };

    res.on("finish", () => {
        const duration = Date.now() - start;

        // =========================
        // ROTAS QUE NÃO DEVEM LOGAR
        // =========================

        const isSuccessfulGet =
            req.method === "GET" &&
            res.statusCode < 400;

        const isIgnoredRoute =
            req.path === "/" ||
            req.path === "/auth/validate";

        if (isSuccessfulGet && isIgnoredRoute) {
            return;
        }

        // =========================
        // INFORMAÇÕES DA REQUISIÇÃO
        // =========================

        const ip =
            req.headers["x-client-ip"] ||
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress;

        const user =
            req.user?.id ||
            req.user?.email ||
            req.admin?.id ||
            req.admin?.email ||
            "guest";

        const request = sanitize(req.body);
        const response = sanitize(responseBody);

        // =========================
        // LOG
        // =========================

        logger(
            res.statusCode >= 400
                ? "error"
                : "info",

            `${req.method} ${req.originalUrl} ` +
            `${res.statusCode} ` +
            `${duration}ms ` +
            `IP:${ip} ` +
            `USER:${user} ` +
            `REQ:${JSON.stringify(request)} ` +
            `RES:${JSON.stringify(response)}`,

            {
                consoleLog: res.statusCode >= 500,
                status: res.statusCode,
            }
        );
    });

    next();
};

module.exports = logMiddleware;