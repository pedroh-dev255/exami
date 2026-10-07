const fs = require("fs");
const path = require("path");

const LOG_DIR = path.join(__dirname, "../../../logs");

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
};

// =========================
// HELPERS
// =========================

function getDate() {
    return new Date().toISOString().split("T")[0];
}

function getTime() {
    return new Date().toISOString();
}

function getLogFile(type) {
    return path.join(
        LOG_DIR,
        `${type}-${getDate()}.log`
    );
}

function writeLog(type, message) {
    fs.appendFile(
        getLogFile(type),
        message + "\n",
        () => {}
    );
}

// =========================
// SANITIZE
// =========================

function sanitize(data) {

    if (data === null || data === undefined) {
        return data;
    }

    if (typeof data !== "object") {
        return data;
    }

    let result;

    try {
        result = JSON.parse(
            JSON.stringify(data)
        );
    } catch {
        return "[UNSERIALIZABLE]";
    }

    const sensitiveFields = [
        "password",
        "senha",
        "token",
        "accessToken",
        "refreshToken",
        "authorization",
        "cookie",
    ];

    function recursiveSanitize(obj) {

        if (!obj || typeof obj !== "object") {
            return;
        }

        for (const key of Object.keys(obj)) {

            if (
                sensitiveFields.includes(key)
            ) {
                obj[key] = "[REDACTED]";
                continue;
            }

            if (
                typeof obj[key] === "object"
            ) {
                recursiveSanitize(obj[key]);
            }
        }
    }

    recursiveSanitize(result);

    return result;
}

// =========================
// LOGGER
// =========================

function logger(type, message, options = {}) {

    const {
        consoleLog = false,
        status = null,
    } = options;

    const log =
        `[${getTime()}] ` +
        message;

    if (consoleLog) {

        if (status >= 500) {
            console.log(
                colors.red +
                log +
                colors.reset
            );
        }
    }

    if (status !== null && status >= 400) {
        writeLog("error", log);
    } else {
        writeLog(type, log);
    }
}

// =========================
// WEBSOCKET
// =========================

function wsLog(event, data = {}, options = {}) {

    const sanitized = sanitize(data);

    logger(
        "ws",
        `[WS] ${event} ` +
        `DATA:${JSON.stringify(sanitized)}`,
        {
            consoleLog: options.consoleLog ?? true,
            status: options.status ?? null,
        }
    );
}

module.exports = {
    logger,
    wsLog,
    sanitize,
    writeLog,
};