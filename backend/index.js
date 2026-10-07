const http = require("http");
require("dotenv").config();

const app = require("./src/app");

const redis = require("./src/configs/redis");
const pool = require("./src/configs/database");
const { connectMinio } = require("./src/configs/minio");
const db_update = require("./src/configs/db_update");

const PORT = process.env.PORT || 3000;

async function start() {
    console.log("==================================");
    console.log("         EXAMI SERVER");
    console.log("==================================");
    console.log("Conectando MySQL...");
    await pool.query("SELECT 1");
    console.log("🟢 MySQL conectado");
    console.log("Conectando Redis...");
    await redis.connect();
    console.log("Conectando MinIO...");
    await connectMinio();

    console.log("Verificando atualizações do banco de dados...");
    await db_update();

    const server = http.createServer(app);
    
    server.listen(PORT, () => {
        console.log(`🟢 API iniciada`);
    });

}

start();