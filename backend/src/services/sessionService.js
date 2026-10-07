const crypto = require("crypto");
const redis = require("../configs/redis");

const SCOPES = Object.freeze({
    USER: "user",
    PACIENTE: "paciente",
    ADMIN: "admin"
});

function normalizeScope(scope) {
    return scope === SCOPES.ADMIN ? SCOPES.ADMIN : scope === SCOPES.PACIENTE ? SCOPES.PACIENTE : SCOPES.USER;
}

function sessionKey(scope, userId, sessionId) {
    return `${normalizeScope(scope)}:${userId}:session:${sessionId}`;
}

function sessionsSetKey(scope, userId) {
    return `${normalizeScope(scope)}:${userId}:sessions`;
}

function legacyKey(scope, userId) {
    return `${normalizeScope(scope)}:${userId}:token`;
}

/*
 * Gera um identificador único de sessão (jti).
 */
function newSessionId() {
    return crypto.randomUUID();
}

/*
 * Registra a sessão do usuário sem interferir nas sessões
 * já abertas em outros dispositivos.
 */
async function saveSession(scope, userId, sessionId, token, ttl) {
    const seconds = Number(ttl);

    if (!sessionId) {
        throw new Error("Sessão inválida.");
    }

    if (!Number.isFinite(seconds) || seconds <= 0) {
        throw new Error("Tempo de expiração da sessão inválido.");
    }

    await redis.setEx(
        sessionKey(scope, userId, sessionId),
        seconds,
        token
    );

    const indexKey = sessionsSetKey(scope, userId);

    await redis.sAdd(indexKey, sessionId);
    await redis.expire(indexKey, seconds);

    return true;
}

/*
 * Valida se o token enviado continua sendo o token daquela
 * sessão. Tokens antigos (sem jti) caem no modo legado.
 */
async function isValidToken(scope, userId, sessionId, token) {
    if (!token) {
        return false;
    }

    if (!sessionId) {
        const legacy = await redis.get(legacyKey(scope, userId));

        return !!legacy && legacy === token;
    }

    const stored = await redis.get(
        sessionKey(scope, userId, sessionId)
    );

    return !!stored && stored === token;
}

/*
 * Lista os jti das sessões ativas do usuário.
 */
async function listSessions(scope, userId) {
    const sessions = await redis.sMembers(
        sessionsSetKey(scope, userId)
    );

    return sessions || [];
}

/*
 * Revoga apenas uma sessão (logout de um dispositivo).
 */
async function revokeSession(scope, userId, sessionId = null) {
    if (!sessionId) {
        await redis.del(legacyKey(scope, userId));

        return true;
    }

    await redis.del(sessionKey(scope, userId, sessionId));
    await redis.sRem(sessionsSetKey(scope, userId), sessionId);

    return true;
}

/*
 * Revoga TODAS as sessões do usuário (logout global ou
 * usuario desativado pelo admin).
 */
async function revokeAllSessions(scope, userId) {
    const sessions = await listSessions(scope, userId);

    const keys = sessions.map((sessionId) =>
        sessionKey(scope, userId, sessionId)
    );

    keys.push(
        sessionsSetKey(scope, userId),
        legacyKey(scope, userId)
    );

    await redis.del(keys);

    return sessions.length;
}

module.exports = {
    SCOPES,
    newSessionId,
    saveSession,
    isValidToken,
    listSessions,
    revokeSession,
    revokeAllSessions
};
